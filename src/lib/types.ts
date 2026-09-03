// Certificate Status Types
export type CertificateStatus = 'pending' | 'verified' | 'expired' | 'revoked' | 'invalid';

export interface Certificate {
  id: string;
  nail_artist_id: string;
  certificate_number: string;
  issuing_authority: string;
  certificate_type: string;
  issued_date: string; // ISO date
  expiry_date: string; // ISO date
  status: CertificateStatus;
  verification_token?: string;
  external_id?: string;
  last_verified_at?: string;
  verification_attempts: number;
  verification_error?: string;
  certificate_file_url?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NailArtist {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profile_image_url?: string;
  location?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CertificationAuthority {
  id: string;
  name: string;
  country?: string;
  api_endpoint?: string;
  verification_method: 'api_lookup' | 'database_query' | 'signature';
  is_active: boolean;
}

// External API Response Types
export interface ExternalVerificationResponse {
  status: 'valid' | 'invalid' | 'revoked' | 'expired';
  certificate_number: string;
  holder_name?: string;
  issue_date: string;
  expiry_date: string;
  certification_level?: string;
  verified_at: string;
  external_id?: string;
  metadata?: Record<string, any>;
}

export interface VerificationRequest {
  certificate_number: string;
  issuing_authority: string;
  holder_name?: string;
  issued_date?: string;
}

export interface VerificationResult {
  is_valid: boolean;
  status: CertificateStatus;
  message: string;
  external_data?: ExternalVerificationResponse;
  error?: string;
}

// Edge Function Request/Response
export interface VerifyCertificatePayload {
  certificate_id: string;
  force_refresh?: boolean;
}

export interface CertificateDurationCheckPayload {
  certificate_id?: string;
  nail_artist_id?: string;
  days_threshold?: number; // Alert if expiring within X days
}
