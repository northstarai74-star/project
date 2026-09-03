// supabase/functions/check-certificate-duration/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { CertificateDurationCheckPayload } from '../types.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Resolves the calling user from their JWT and confirms they own the nail
// artist profile (or certificate) being queried.
async function assertCallerOwnsScope(
  authHeader: string | null,
  { certificateId, nailArtistId }: { certificateId?: string; nailArtistId?: string }
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

  const { data: artist, error: artistError } = await supabase
    .from('nail_artists')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (artistError || !artist) {
    return { ok: false, status: 403, message: 'No artist profile for this account' };
  }

  if (nailArtistId && nailArtistId !== artist.id) {
    return { ok: false, status: 403, message: 'You do not have access to this artist profile' };
  }

  if (certificateId) {
    const { data: cert, error: certError } = await supabase
      .from('certificates')
      .select('nail_artist_id')
      .eq('id', certificateId)
      .single();

    if (certError || !cert || cert.nail_artist_id !== artist.id) {
      return { ok: false, status: 403, message: 'You do not have access to this certificate' };
    }
  }

  return { ok: true };
}

// 'notify' and 'batch' operate across all artists, so only the service role
// (e.g. a scheduled job calling with the service role key) may trigger them.
function isServiceRoleCaller(authHeader: string | null): boolean {
  return authHeader === `Bearer ${serviceRoleKey}`;
}

interface CertificateDurationStatus {
  id: string;
  certificate_number: string;
  nail_artist_id: string;
  expiry_date: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  days_until_expiry: number;
  alert_level: 'none' | 'warning' | 'critical';
}

interface DurationCheckResult {
  success: boolean;
  certificates: CertificateDurationStatus[];
  summary: {
    total: number;
    valid: number;
    expiring_soon: number;
    expired: number;
  };
}

async function checkCertificateDuration(
  certificateId?: string,
  nailArtistId?: string,
  daysThreshold: number = 30
): Promise<DurationCheckResult> {
  try {
    let query = supabase
      .from('certificates')
      .select('id, certificate_number, nail_artist_id, expiry_date, status');

    if (certificateId) {
      query = query.eq('id', certificateId);
    } else if (nailArtistId) {
      query = query.eq('nail_artist_id', nailArtistId);
    }

    const { data: certificates, error } = await query;

    if (error) {
      throw error;
    }

    if (!certificates || certificates.length === 0) {
      return {
        success: true,
        certificates: [],
        summary: {
          total: 0,
          valid: 0,
          expiring_soon: 0,
          expired: 0,
        },
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results: CertificateDurationStatus[] = certificates.map((cert) => {
      const expiryDate = new Date(cert.expiry_date);
      expiryDate.setHours(0, 0, 0, 0);

      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      let status: 'valid' | 'expiring_soon' | 'expired';
      let alertLevel: 'none' | 'warning' | 'critical';

      if (daysUntilExpiry < 0) {
        status = 'expired';
        alertLevel = 'critical';
      } else if (daysUntilExpiry <= daysThreshold) {
        status = 'expiring_soon';
        alertLevel = daysUntilExpiry <= 7 ? 'critical' : 'warning';
      } else {
        status = 'valid';
        alertLevel = 'none';
      }

      return {
        id: cert.id,
        certificate_number: cert.certificate_number,
        nail_artist_id: cert.nail_artist_id,
        expiry_date: cert.expiry_date,
        status,
        days_until_expiry: daysUntilExpiry,
        alert_level: alertLevel,
      };
    });

    // Calculate summary
    const summary = {
      total: results.length,
      valid: results.filter((c) => c.status === 'valid').length,
      expiring_soon: results.filter((c) => c.status === 'expiring_soon').length,
      expired: results.filter((c) => c.status === 'expired').length,
    };

    return {
      success: true,
      certificates: results,
      summary,
    };
  } catch (error) {
    console.error('Duration check error:', error);
    throw error;
  }
}

// Batch check for all nail artists with expiring certificates
async function checkAllExpiringSoon(
  daysThreshold: number = 30
): Promise<Map<string, CertificateDurationStatus[]>> {
  try {
    const { data: certificates, error } = await supabase
      .from('certificates')
      .select('id, certificate_number, nail_artist_id, expiry_date');

    if (error) {
      throw error;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiringByArtist = new Map<string, CertificateDurationStatus[]>();

    certificates?.forEach((cert) => {
      const expiryDate = new Date(cert.expiry_date);
      expiryDate.setHours(0, 0, 0, 0);

      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry <= daysThreshold) {
        let status: 'valid' | 'expiring_soon' | 'expired';
        let alertLevel: 'none' | 'warning' | 'critical';

        if (daysUntilExpiry < 0) {
          status = 'expired';
          alertLevel = 'critical';
        } else {
          status = 'expiring_soon';
          alertLevel = daysUntilExpiry <= 7 ? 'critical' : 'warning';
        }

        const certStatus: CertificateDurationStatus = {
          id: cert.id,
          certificate_number: cert.certificate_number,
          nail_artist_id: cert.nail_artist_id,
          expiry_date: cert.expiry_date,
          status,
          days_until_expiry: daysUntilExpiry,
          alert_level: alertLevel,
        };

        if (!expiringByArtist.has(cert.nail_artist_id)) {
          expiringByArtist.set(cert.nail_artist_id, []);
        }
        expiringByArtist.get(cert.nail_artist_id)!.push(certStatus);
      }
    });

    return expiringByArtist;
  } catch (error) {
    console.error('Batch check error:', error);
    throw error;
  }
}

// Send notifications for expiring certificates
async function notifyExpiringCertificates(): Promise<{
  notified: number;
  failed: number;
}> {
  try {
    const expiringByArtist = await checkAllExpiringSoon(30);

    let notified = 0;
    let failed = 0;

    for (const [artistId, expiringCerts] of expiringByArtist.entries()) {
      // Get artist email
      const { data: artist, error: artistError } = await supabase
        .from('nail_artists')
        .select('email, name')
        .eq('id', artistId)
        .single();

      if (artistError || !artist) {
        failed++;
        continue;
      }

      // Prepare notification (integrate with your email service)
      const message = {
        to: artist.email,
        subject: `Certificate Expiration Notice - ${expiringCerts.length} certificate(s) expiring soon`,
        html: generateExpirationEmail(artist.name, expiringCerts),
      };

      // Send email (integrate with Resend, SendGrid, AWS SES, etc.)
      try {
        // Example with Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'noreply@nailart.app',
            to: message.to,
            subject: message.subject,
            html: message.html,
          }),
        });

        if (resendResponse.ok) {
          notified++;
        } else {
          failed++;
        }
      } catch (emailError) {
        console.error(`Failed to send email to ${artist.email}:`, emailError);
        failed++;
      }
    }

    return { notified, failed };
  } catch (error) {
    console.error('Notification error:', error);
    throw error;
  }
}

function generateExpirationEmail(
  artistName: string,
  expiringCerts: CertificateDurationStatus[]
): string {
  const criticalCerts = expiringCerts.filter((c) => c.alert_level === 'critical');
  const warningCerts = expiringCerts.filter((c) => c.alert_level === 'warning');

  return `
    <h2>Certificate Expiration Notice</h2>
    <p>Dear ${artistName},</p>
    
    ${
      criticalCerts.length > 0
        ? `
      <div style="background: #fee; padding: 10px; border-radius: 4px; margin: 10px 0;">
        <h3 style="color: #c00;">🔴 CRITICAL - Certificates Expiring Soon</h3>
        <ul>
          ${criticalCerts
            .map(
              (c) => `
            <li>${c.certificate_number} - Expires in ${c.days_until_expiry} day(s) (${c.expiry_date})</li>
          `
            )
            .join('')}
        </ul>
      </div>
    `
        : ''
    }
    
    ${
      warningCerts.length > 0
        ? `
      <div style="background: #ffe; padding: 10px; border-radius: 4px; margin: 10px 0;">
        <h3 style="color: #880;">⚠️ WARNING - Certificates Expiring Soon</h3>
        <ul>
          ${warningCerts
            .map(
              (c) => `
            <li>${c.certificate_number} - Expires in ${c.days_until_expiry} day(s) (${c.expiry_date})</li>
          `
            )
            .join('')}
        </ul>
      </div>
    `
        : ''
    }
    
    <p>Please renew your certificates to maintain your verified status on the platform.</p>
    <p>Best regards,<br/>Nail Art Platform</p>
  `;
}

// Main Edge Function handler
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const url = new URL(req.url);
    let body: Partial<CertificateDurationCheckPayload & { action: string }> = {};
    if (req.method === 'POST') {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    const action = body.action || url.searchParams.get('action') || 'check';
    const certificateId = body.certificate_id || url.searchParams.get('certificate_id') || undefined;
    const nailArtistId = body.nail_artist_id || url.searchParams.get('nail_artist_id') || undefined;
    const daysThreshold = body.days_threshold || parseInt(url.searchParams.get('days') || '30', 10);
    const authHeader = req.headers.get('Authorization');

    let result;

    if (action === 'check') {
      const authCheck = await assertCallerOwnsScope(authHeader, { certificateId, nailArtistId });
      if (!authCheck.ok) {
        return new Response(
          JSON.stringify({ error: authCheck.message }),
          { status: authCheck.status, headers: { 'Content-Type': 'application/json' } }
        );
      }
      result = await checkCertificateDuration(certificateId, nailArtistId, daysThreshold);
    } else if (action === 'notify') {
      if (!isServiceRoleCaller(authHeader)) {
        return new Response(
          JSON.stringify({ error: 'Only the service role may trigger notifications' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      result = await notifyExpiringCertificates();
    } else if (action === 'batch') {
      if (!isServiceRoleCaller(authHeader)) {
        return new Response(
          JSON.stringify({ error: 'Only the service role may run batch checks' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const expiringMap = await checkAllExpiringSoon(daysThreshold);
      result = {
        success: true,
        data: Object.fromEntries(expiringMap),
      };
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown action: ${action}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Duration check error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
