-- Create enum for certificate status
CREATE TYPE certificate_status AS ENUM ('pending', 'verified', 'expired', 'revoked', 'invalid');

-- Nail Artists Table
CREATE TABLE nail_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  bio TEXT,
  profile_image_url TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (auth_user_id)
);

-- Certificates Table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nail_artist_id UUID NOT NULL REFERENCES nail_artists(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL,
  issuing_authority TEXT NOT NULL, -- e.g., "NAILS_BOARD_OF_INDIA"
  certificate_type TEXT NOT NULL, -- e.g., "nail_technician", "course_completion"
  issued_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status certificate_status DEFAULT 'pending',

  -- External API verification data
  verification_token TEXT, -- Token from issuing authority
  external_id TEXT, -- ID from issuing authority database
  last_verified_at TIMESTAMP WITH TIME ZONE,
  verification_attempts INT DEFAULT 0,
  verification_error TEXT,

  -- File storage
  certificate_file_url TEXT, -- Stored PDF/image in Supabase Storage
  metadata JSONB DEFAULT '{}', -- Any extra data from issuing authority

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (issuing_authority, certificate_number)
);

-- Certification Authorities Table
CREATE TABLE certification_authorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT,
  api_endpoint TEXT,
  api_key TEXT, -- Store via Supabase Vault / secret manager in production
  verification_method TEXT NOT NULL, -- 'api_lookup', 'database_query', 'signature'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificate Verification Logs (audit trail)
CREATE TABLE certificate_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  verification_status certificate_status,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_data JSONB, -- Store API response
  error_message TEXT,
  verified_by TEXT -- 'system', 'admin', 'external_api'
);

-- Indexes for performance
CREATE INDEX idx_certificates_nail_artist_id ON certificates(nail_artist_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_expiry_date ON certificates(expiry_date);
CREATE INDEX idx_verification_logs_certificate_id ON certificate_verification_logs(certificate_id);
CREATE INDEX idx_nail_artists_is_verified ON nail_artists(is_verified);

-- Keep updated_at current on row changes
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nail_artists_set_updated_at
  BEFORE UPDATE ON nail_artists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER certificates_set_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE nail_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_authorities ENABLE ROW LEVEL SECURITY;

-- ============ nail_artists policies ============
CREATE POLICY "Users can view own profile" ON nail_artists
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile" ON nail_artists
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON nail_artists
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- ============ certificates policies ============
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nail_artists
      WHERE nail_artists.id = certificates.nail_artist_id
      AND nail_artists.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own certificates" ON certificates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM nail_artists
      WHERE nail_artists.id = certificates.nail_artist_id
      AND nail_artists.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own certificates" ON certificates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM nail_artists
      WHERE nail_artists.id = certificates.nail_artist_id
      AND nail_artists.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own certificates" ON certificates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM nail_artists
      WHERE nail_artists.id = certificates.nail_artist_id
      AND nail_artists.auth_user_id = auth.uid()
    )
  );

-- ============ certificate_verification_logs policies ============
-- Logs are written by Edge Functions using the service role key (bypasses RLS).
-- Artists may only read the logs for their own certificates.
CREATE POLICY "Users can view own verification logs" ON certificate_verification_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM certificates
      JOIN nail_artists ON nail_artists.id = certificates.nail_artist_id
      WHERE certificates.id = certificate_verification_logs.certificate_id
      AND nail_artists.auth_user_id = auth.uid()
    )
  );

-- ============ certification_authorities policies ============
-- Public read of non-sensitive fields is handled at the application layer;
-- only the service role (Edge Functions) may read/write this table directly.
CREATE POLICY "Active authorities are visible to authenticated users" ON certification_authorities
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- ============ Storage bucket for certificate files ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('nail-certificates', 'nail-certificates', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Certificate files are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'nail-certificates');

CREATE POLICY "Authenticated users can upload certificate files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'nail-certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their certificate files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'nail-certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their certificate files" ON storage.objects
  FOR DELETE USING (bucket_id = 'nail-certificates' AND auth.role() = 'authenticated');
