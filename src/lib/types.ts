export type CertificateStatus = 'active' | 'expired' | 'revoked';

export interface Student {
  id: string;
  reference_number: string;
  name: string;
  course: string;
  issued_date: string; // ISO date
  expiry_date?: string | null; // ISO date
  status: CertificateStatus;
  photo_url?: string | null;
  certificate_image_url?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export type StudentInput = Pick<
  Student,
  'reference_number' | 'name' | 'course' | 'issued_date' | 'expiry_date' | 'status' | 'notes'
>;

export interface AdminUser {
  id: string;
  auth_user_id: string;
  email: string;
  created_at: string;
}
