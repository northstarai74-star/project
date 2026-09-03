-- Certificate status
CREATE TYPE certificate_status AS ENUM ('active', 'expired', 'revoked');

-- Admins Table
-- Membership here (not a role on auth.users) is what makes someone an admin.
-- Rows are only ever written by the redeem-admin-code Edge Function (service role),
-- never directly by clients.
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students Table
-- One row per issued certificate. reference_number is the public lookup key
-- shown on the physical/PDF certificate, used by anyone to verify it on the site.
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  issued_date DATE NOT NULL,
  expiry_date DATE,
  status certificate_status NOT NULL DEFAULT 'active',
  photo_url TEXT,
  certificate_image_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_students_reference_number ON students(reference_number);
CREATE INDEX idx_students_status ON students(status);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER students_set_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Helper used by RLS policies below: is the current caller an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- ============ admin_users policies ============
-- Signed-in users may check whether *they themselves* are an admin.
-- No INSERT/UPDATE/DELETE policy exists for regular clients: admin_users rows
-- are only ever written by the service role, from the redeem-admin-code function.
CREATE POLICY "Users can check own admin status" ON admin_users
  FOR SELECT USING (auth.uid() = auth_user_id);

-- ============ students policies ============
-- Public verification: anyone (including anonymous visitors) can look up
-- certificate records by reference number.
CREATE POLICY "Anyone can view student records" ON students
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert students" ON students
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update students" ON students
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete students" ON students
  FOR DELETE USING (is_admin());

-- ============ Storage bucket for student photos + certificate images ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-certificates', 'student-certificates', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Student certificate files are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'student-certificates');

CREATE POLICY "Admins can upload student certificate files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'student-certificates' AND is_admin());

CREATE POLICY "Admins can update student certificate files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'student-certificates' AND is_admin());

CREATE POLICY "Admins can delete student certificate files" ON storage.objects
  FOR DELETE USING (bucket_id = 'student-certificates' AND is_admin());
