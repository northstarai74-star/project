# Nail Art Certification

A website for nail technicians to upload, verify, and track the expiry of their
professional certifications. Backed by Supabase (Postgres + Auth + Storage +
Edge Functions) as the permanent database.

## Stack

- **Frontend**: React + TypeScript + Vite, React Router
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions)

## Project layout

```
src/
  lib/               Supabase client SDK + shared TypeScript types
  context/           Auth context (session, current artist profile)
  components/        Layout, route guarding
  pages/             Login, signup, dashboard, certificate detail/create, profile
supabase/
  migrations/        SQL schema, RLS policies, storage bucket setup
  functions/
    verify-certificate/            Edge Function: verifies a certificate against
                                    its issuing authority
    check-certificate-duration/    Edge Function: expiry/duration checks + email
                                    notifications
```

## Setup

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com) and grab its Project
URL and anon key from **Project Settings → API**.

### 2. Apply the database schema

In the Supabase SQL Editor, run `supabase/migrations/0001_init.sql`. This creates:

- `nail_artists`, `certificates`, `certification_authorities`,
  `certificate_verification_logs` tables
- Row Level Security policies so artists can only see/manage their own data
- The `nail-certificates` storage bucket for uploaded certificate files

Or, with the Supabase CLI:

```bash
supabase link --project-id YOUR_PROJECT_ID
supabase db push
```

### 3. Deploy the Edge Functions

```bash
supabase functions deploy verify-certificate
supabase functions deploy check-certificate-duration
```

Both functions require `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` to be set as function secrets (the CLI sets the
first two automatically; set the service role key yourself):

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set RESEND_API_KEY=your-resend-key   # optional, for email alerts
```

### 4. Configure the frontend

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run it

```bash
npm install
npm run dev
```

## How certificate verification works

1. An artist signs up, completes their profile, and adds a certificate
   (number, issuing authority, issue/expiry dates, optional file upload).
2. From the certificate's detail page they can trigger **Verify now**, which
   calls the `verify-certificate` Edge Function.
3. The function looks up the caller's session, confirms they own the
   certificate, then calls the configured verification method for that
   issuing authority (`NAILS_BOARD_OF_INDIA`, `INDIAN_BEAUTY_COUNCIL`, etc.),
   or falls back to a generic default.
4. The certificate's `status` (`pending` / `verified` / `expired` / `revoked`
   / `invalid`) is updated and every attempt is written to
   `certificate_verification_logs` for an audit trail.
5. The `check-certificate-duration` function computes days-until-expiry and
   alert level (`none` / `warning` / `critical`) for an artist's certificates,
   and can batch-notify artists with certificates expiring soon (service-role
   only, intended to be run on a schedule).

## Adding a new issuing authority

1. Insert a row into `certification_authorities` with its API endpoint and
   verification method.
2. Add a `verifyWith<Authority>` function in
   `supabase/functions/verify-certificate/index.ts` and register it in the
   `verificationProviders` map.
3. Redeploy: `supabase functions deploy verify-certificate`.
