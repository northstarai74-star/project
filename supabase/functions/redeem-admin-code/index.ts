// supabase/functions/redeem-admin-code/index.ts
//
// Lets a signed-in user grant themselves admin access by presenting the
// invite code configured as the ADMIN_SIGNUP_CODE function secret. The code
// is only ever compared server-side, so it never ships in the frontend
// bundle. Grants are recorded in admin_users, which regular clients have no
// write access to (see 0001_init.sql).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const adminSignupCode = Deno.env.get('ADMIN_SIGNUP_CODE');

const supabase = createClient(supabaseUrl, serviceRoleKey);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    if (!adminSignupCode) {
      return new Response(
        JSON.stringify({ error: 'Admin signup is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const callerClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await callerClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { code } = await req.json();
    if (typeof code !== 'string' || code !== adminSignupCode) {
      return new Response(
        JSON.stringify({ error: 'Invalid admin code' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { error: upsertError } = await supabase
      .from('admin_users')
      .upsert({ auth_user_id: user.id, email: user.email ?? '' }, { onConflict: 'auth_user_id' });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('redeem-admin-code error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
