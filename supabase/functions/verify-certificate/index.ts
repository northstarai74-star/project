// supabase/functions/verify-certificate/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { VerifyCertificatePayload, Certificate, ExternalVerificationResponse, CertificateStatus } from '../types.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Service-role client: bypasses RLS, used for the actual read/write work.
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Resolves the calling user from their JWT and confirms they own the certificate
// being verified, so one artist can't trigger verification for another's certs.
async function assertCallerOwnsCertificate(
  authHeader: string | null,
  certificateId: string
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  if (!authHeader) {
    return { ok: false, status: 401, message: 'Missing Authorization header' };
  }

  const callerClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser();

  if (userError || !user) {
    return { ok: false, status: 401, message: 'Invalid or expired session' };
  }

  const { data: cert, error: certError } = await supabase
    .from('certificates')
    .select('nail_artist_id, nail_artists!inner(auth_user_id)')
    .eq('id', certificateId)
    .single();

  if (certError || !cert) {
    return { ok: false, status: 404, message: 'Certificate not found' };
  }

  const ownerAuthId = (cert as unknown as { nail_artists: { auth_user_id: string } }).nail_artists
    .auth_user_id;

  if (ownerAuthId !== user.id) {
    return { ok: false, status: 403, message: 'You do not have access to this certificate' };
  }

  return { ok: true };
}

// Verification implementations for different authorities
const verificationProviders: Record<string, (cert: Certificate) => Promise<ExternalVerificationResponse | null>> = {
  'NAILS_BOARD_OF_INDIA': verifyWithNailsBoardIndia,
  'INDIAN_BEAUTY_COUNCIL': verifyWithBeautyCouncil,
  'NAIL_TECHNICIANS_ASSOCIATION': verifyWithAssociation,
  'DEFAULT_API': verifyWithDefaultAPI,
};

// Example: Verify with Nails Board of India API
async function verifyWithNailsBoardIndia(cert: Certificate): Promise<ExternalVerificationResponse | null> {
  const authority = await supabase
    .from('certification_authorities')
    .select('api_endpoint, api_key')
    .eq('name', 'NAILS_BOARD_OF_INDIA')
    .single();

  if (!authority.data?.api_endpoint) {
    throw new Error('API endpoint not configured for NAILS_BOARD_OF_INDIA');
  }

  try {
    const response = await fetch(`${authority.data.api_endpoint}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authority.data.api_key}`,
      },
      body: JSON.stringify({
        certificate_number: cert.certificate_number,
        issued_date: cert.issued_date,
        verification_token: cert.verification_token,
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      status: data.status || 'invalid',
      certificate_number: data.certificate_number,
      holder_name: data.holder_name,
      issue_date: data.issued_date,
      expiry_date: data.expiry_date,
      certification_level: data.level,
      verified_at: new Date().toISOString(),
      external_id: data.id,
      metadata: data.metadata,
    };
  } catch (error) {
    console.error('NAILS_BOARD_OF_INDIA verification failed:', error);
    return null;
  }
}

// Example: Verify with Indian Beauty Council
async function verifyWithBeautyCouncil(cert: Certificate): Promise<ExternalVerificationResponse | null> {
  const authority = await supabase
    .from('certification_authorities')
    .select('api_endpoint, api_key')
    .eq('name', 'INDIAN_BEAUTY_COUNCIL')
    .single();

  if (!authority.data?.api_endpoint) {
    throw new Error('API endpoint not configured');
  }

  try {
    const response = await fetch(
      `${authority.data.api_endpoint}/certificates/${cert.certificate_number}`,
      {
        headers: {
          'x-api-key': authority.data.api_key!,
        },
      }
    );

    if (!response.ok) {
      return null; // Certificate not found
    }

    const data = await response.json();
    return {
      status: data.is_active ? 'valid' : 'revoked',
      certificate_number: data.cert_number,
      holder_name: data.technician_name,
      issue_date: data.issue_date,
      expiry_date: data.expiry_date,
      verified_at: new Date().toISOString(),
      external_id: data.id,
    };
  } catch (error) {
    console.error('INDIAN_BEAUTY_COUNCIL verification failed:', error);
    return null;
  }
}

// Default/Generic API verification
async function verifyWithDefaultAPI(cert: Certificate): Promise<ExternalVerificationResponse | null> {
  // Implement a generic verification pattern
  // This can be customized per authority
  return {
    status: 'valid',
    certificate_number: cert.certificate_number,
    issue_date: cert.issued_date,
    expiry_date: cert.expiry_date,
    verified_at: new Date().toISOString(),
  };
}

// Placeholder for association verification
async function verifyWithAssociation(_cert: Certificate): Promise<ExternalVerificationResponse | null> {
  return null;
}

// Main verification logic
async function verifyCertificate(
  certificateId: string,
  forceRefresh: boolean = false
): Promise<{ success: boolean; status: CertificateStatus; message: string; data?: any }> {
  try {
    // 1. Fetch certificate from database
    const { data: cert, error: fetchError } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .single();

    if (fetchError || !cert) {
      return {
        success: false,
        status: 'invalid' as CertificateStatus,
        message: 'Certificate not found',
      };
    }

    // 2. Check if already verified recently (skip if forceRefresh is true)
    if (!forceRefresh && cert.last_verified_at) {
      const lastVerified = new Date(cert.last_verified_at);
      const hoursSinceVerification = (Date.now() - lastVerified.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceVerification < 24) {
        return {
          success: true,
          status: cert.status,
          message: `Certificate already verified ${hoursSinceVerification.toFixed(1)} hours ago`,
          data: cert,
        };
      }
    }

    // 3. Check certificate expiry
    const expiryDate = new Date(cert.expiry_date);
    const today = new Date();
    
    if (expiryDate < today) {
      await updateCertificateStatus(certificateId, 'expired', 'Certificate has expired');
      return {
        success: true,
        status: 'expired' as CertificateStatus,
        message: 'Certificate has expired',
      };
    }

    // 4. Call external verification API
    const verifier = verificationProviders[cert.issuing_authority] || verificationProviders['DEFAULT_API'];
    let externalResponse: ExternalVerificationResponse | null = null;

    try {
      externalResponse = await verifier(cert);
    } catch (error) {
      console.error('External verification error:', error);
      
      // Log failed attempt
      await logVerification(certificateId, 'invalid', error instanceof Error ? error.message : 'Unknown error');
      
      // Update attempt counter
      await supabase
        .from('certificates')
        .update({
          verification_attempts: cert.verification_attempts + 1,
          verification_error: error instanceof Error ? error.message : 'Verification failed',
        })
        .eq('id', certificateId);

      return {
        success: false,
        status: 'invalid' as CertificateStatus,
        message: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }

    // 5. Parse external response and determine status
    let newStatus: CertificateStatus = 'invalid';
    
    if (externalResponse) {
      if (externalResponse.status === 'revoked') {
        newStatus = 'revoked';
      } else if (externalResponse.status === 'expired') {
        newStatus = 'expired';
      } else if (externalResponse.status === 'valid') {
        newStatus = 'verified';
      }

      // Update certificate with external data
      const { error: updateError } = await supabase
        .from('certificates')
        .update({
          status: newStatus,
          external_id: externalResponse.external_id || cert.external_id,
          last_verified_at: new Date().toISOString(),
          verification_attempts: 0,
          verification_error: null,
          metadata: {
            ...cert.metadata,
            external_verification: externalResponse,
          },
        })
        .eq('id', certificateId);

      if (updateError) {
        throw updateError;
      }

      // Log successful verification
      await logVerification(certificateId, newStatus, externalResponse);
    } else {
      // External API returned null - certificate not found in external system
      await updateCertificateStatus(certificateId, 'invalid', 'Certificate not found in issuing authority database');
      newStatus = 'invalid';
    }

    return {
      success: externalResponse !== null,
      status: newStatus,
      message: `Certificate verification ${externalResponse ? 'successful' : 'failed'}: ${newStatus}`,
      data: externalResponse,
    };
  } catch (error) {
    console.error('Certificate verification error:', error);
    return {
      success: false,
      status: 'invalid' as CertificateStatus,
      message: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function updateCertificateStatus(
  certificateId: string,
  status: CertificateStatus,
  errorMessage: string
): Promise<void> {
  await supabase
    .from('certificates')
    .update({
      status,
      last_verified_at: new Date().toISOString(),
      verification_error: errorMessage,
    })
    .eq('id', certificateId);

  await logVerification(certificateId, status, errorMessage);
}

async function logVerification(
  certificateId: string,
  status: CertificateStatus,
  data: any
): Promise<void> {
  await supabase
    .from('certificate_verification_logs')
    .insert({
      certificate_id: certificateId,
      verification_status: status,
      response_data: typeof data === 'string' ? null : data,
      error_message: typeof data === 'string' ? data : null,
      verified_by: 'system',
    });
}

// Main Edge Function handler
Deno.serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const payload: VerifyCertificatePayload = await req.json();
    const { certificate_id, force_refresh } = payload;

    if (!certificate_id) {
      return new Response(
        JSON.stringify({ error: 'certificate_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const authCheck = await assertCallerOwnsCertificate(req.headers.get('Authorization'), certificate_id);
    if (!authCheck.ok) {
      return new Response(
        JSON.stringify({ error: authCheck.message }),
        { status: authCheck.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await verifyCertificate(certificate_id, force_refresh);
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
