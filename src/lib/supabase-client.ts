// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';
import type { Certificate, NailArtist, VerificationResult } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Certificate Management Client
 * Provides methods for uploading, verifying, and managing nail technician certificates
 */
export class CertificateClient {
  // ============ CERTIFICATE VERIFICATION ============

  /**
   * Verify a certificate with external issuing authority
   * @param certificateId - The certificate ID to verify
   * @param forceRefresh - Force re-verification even if recently verified
   */
  async verifyCertificate(
    certificateId: string,
    forceRefresh = false
  ): Promise<VerificationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('verify-certificate', {
        body: {
          certificate_id: certificateId,
          force_refresh: forceRefresh,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Certificate verification failed:', error);
      throw error;
    }
  }

  /**
   * Check certificate expiration status and duration
   * @param certificateId - Check specific certificate (optional)
   * @param nailArtistId - Check all certificates for artist (optional)
   * @param daysThreshold - Alert if expiring within X days (default: 30)
   */
  async checkCertificateDuration(
    certificateId?: string,
    nailArtistId?: string,
    daysThreshold = 30
  ) {
    try {
      const params = new URLSearchParams({
        action: 'check',
        days: daysThreshold.toString(),
      });

      if (certificateId) params.append('certificate_id', certificateId);
      if (nailArtistId) params.append('nail_artist_id', nailArtistId);

      const { data, error } = await supabase.functions.invoke(
        'check-certificate-duration',
        {
          body: { action: 'check', certificate_id: certificateId, nail_artist_id: nailArtistId, days_threshold: daysThreshold },
        }
      );

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Duration check failed:', error);
      throw error;
    }
  }

  /**
   * Get all certificates for a nail artist
   */
  async getCertificatesForArtist(nailArtistId: string) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('nail_artist_id', nailArtistId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Certificate[];
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      throw error;
    }
  }

  /**
   * Get a single certificate by ID
   */
  async getCertificate(certificateId: string) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', certificateId)
        .single();

      if (error) throw error;
      return data as Certificate;
    } catch (error) {
      console.error('Failed to fetch certificate:', error);
      throw error;
    }
  }

  // ============ CERTIFICATE UPLOAD ============

  /**
   * Upload certificate file to Supabase Storage
   */
  async uploadCertificateFile(
    certificateId: string,
    file: File
  ): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `certificates/${certificateId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('nail-certificates')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('nail-certificates')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  /**
   * Create a new certificate record
   */
  async createCertificate(
    nailArtistId: string,
    certificateData: {
      certificate_number: string;
      issuing_authority: string;
      certificate_type: string;
      issued_date: string;
      expiry_date: string;
      verification_token?: string;
    }
  ): Promise<Certificate> {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          nail_artist_id: nailArtistId,
          ...certificateData,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Certificate;
    } catch (error) {
      console.error('Certificate creation failed:', error);
      throw error;
    }
  }

  /**
   * Update certificate details
   */
  async updateCertificate(
    certificateId: string,
    updates: Partial<Certificate>
  ): Promise<Certificate> {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .update(updates)
        .eq('id', certificateId)
        .select()
        .single();

      if (error) throw error;
      return data as Certificate;
    } catch (error) {
      console.error('Certificate update failed:', error);
      throw error;
    }
  }

  /**
   * Delete a certificate
   */
  async deleteCertificate(certificateId: string): Promise<void> {
    try {
      // Also delete the file from storage
      const cert = await this.getCertificate(certificateId);
      if (cert.certificate_file_url) {
        const filePath = cert.certificate_file_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('nail-certificates')
            .remove([`certificates/${filePath}`]);
        }
      }

      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certificateId);

      if (error) throw error;
    } catch (error) {
      console.error('Certificate deletion failed:', error);
      throw error;
    }
  }

  // ============ VERIFICATION LOGS ============

  /**
   * Get verification history for a certificate
   */
  async getVerificationLogs(certificateId: string) {
    try {
      const { data, error } = await supabase
        .from('certificate_verification_logs')
        .select('*')
        .eq('certificate_id', certificateId)
        .order('verified_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch verification logs:', error);
      throw error;
    }
  }

  // ============ NAIL ARTIST PROFILE ============

  /**
   * Get current user's nail artist profile
   */
  async getCurrentArtistProfile(): Promise<NailArtist | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from('nail_artists')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return (data as NailArtist) || null;
    } catch (error) {
      console.error('Failed to fetch artist profile:', error);
      throw error;
    }
  }

  /**
   * Update nail artist profile
   */
  async updateArtistProfile(
    updates: Partial<NailArtist>
  ): Promise<NailArtist> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('nail_artists')
        .update(updates)
        .eq('auth_user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as NailArtist;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  /**
   * Create nail artist profile (called on first registration)
   */
  async createArtistProfile(profileData: Partial<NailArtist>): Promise<NailArtist> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('nail_artists')
        .insert({
          auth_user_id: user.id,
          email: user.email || '',
          ...profileData,
        })
        .select()
        .single();

      if (error) throw error;
      return data as NailArtist;
    } catch (error) {
      console.error('Profile creation failed:', error);
      throw error;
    }
  }

  // ============ BATCH OPERATIONS ============

  /**
   * Verify all certificates for a nail artist
   */
  async verifyAllArtistCertificates(nailArtistId: string) {
    try {
      const certificates = await this.getCertificatesForArtist(nailArtistId);
      const results = await Promise.allSettled(
        certificates.map((cert) => this.verifyCertificate(cert.id, true))
      );

      return {
        total: results.length,
        succeeded: results.filter((r) => r.status === 'fulfilled').length,
        failed: results.filter((r) => r.status === 'rejected').length,
        results: results.map((r, i) => ({
          certificateId: certificates[i].id,
          result: r.status === 'fulfilled' ? r.value : r.reason,
        })),
      };
    } catch (error) {
      console.error('Batch verification failed:', error);
      throw error;
    }
  }

  /**
   * Check all certificates nearing expiration
   */
  async checkExpiringCertificates(nailArtistId: string, daysThreshold = 30) {
    try {
      const { data, error } = await supabase.functions.invoke(
        'check-certificate-duration',
        {
          body: {
            action: 'check',
            nail_artist_id: nailArtistId,
            days_threshold: daysThreshold,
          },
        }
      );

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Expiration check failed:', error);
      throw error;
    }
  }

  // ============ AUTHENTICATION ============

  /**
   * Sign up new nail artist
   */
  async signUp(email: string, password: string, profileData: Partial<NailArtist>) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create artist profile
      if (authData.user) {
        const profile = await this.createArtistProfile({
          ...profileData,
          email,
        });
        return { user: authData.user, profile };
      }

      return authData;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  /**
   * Sign in nail artist
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const certificateClient = new CertificateClient();
