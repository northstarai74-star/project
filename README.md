# Nail Art Certification

A public certificate-verification site for a nail art school: admins add and
remove student certificate records (with a photo and a scan of the
certificate), and anyone can look up a record by its reference number to see
that it's genuine. Backed by Supabase (Postgres + Auth + Storage + Edge
Functions) as the permanent database.

## Stack

- **Frontend**: React + TypeScript + Vite, React Router
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions)

## Project layout

```
src/
  lib/               Supabase client SDK + shared TypeScript types
  context/           Auth context (session, admin status)
  components/        Layout, route guarding
  pages/
    Home, Login, Signup             Public + account pages
    VerifyLookup                    Public: look up a certificate by reference number
    AdminGate                       Shown to a signed-in user who isn't an admin yet
    AdminStudents                   Admin: list/search/remove students
    AdminStudentForm                Admin: add/edit a student + upload photo & certificate
supabase/
  migrations/        SQL schema, RLS policies, storage bucket setup
  functions/
    redeem-admin-code/    Edge Function: grants admin access given the invite code
```

## How it works

- **Public verification** (`/verify`): anyone enters a reference number and,
  if it matches a `students` row, sees the student's name, course, status,
  dates, and the certificate image. No login required.
- **Admin panel** (`/admin`): a signed-in admin can add a student record
  (reference number, name, course, dates, status), upload a photo and a
  certificate image, edit a record, or remove one.
- **Becoming an admin**: anyone can create an account, but only becomes an
  admin by entering the invite code on `/admin` (checked server-side by the
  `redeem-admin-code` Edge Function against the `ADMIN_SIGNUP_CODE` secret —
  the code is never shipped to the browser). Once redeemed, they're added to
  `admin_users` and can manage students from then on.

## Setup

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com) and grab its Project
URL and anon key from **Project Settings → API**.

### 2. Apply the database schema

In the Supabase SQL Editor, run `supabase/migrations/0001_init.sql`. This creates:

- `admin_users` — who has admin access (rows only ever written server-side)
- `students` — one row per certificate: `reference_number` (public lookup
  key), `name`, `course`, dates, `status`, `photo_url`, `certificate_image_url`
- Row Level Security: anyone can `SELECT` from `students` (that's the public
  lookup); only admins can insert/update/delete
- The `student-certificates` storage bucket (public read, admin-only write)

Or with the Supabase CLI:

```bash
supabase link --project-id YOUR_PROJECT_ID
supabase db push
```

### 3. Deploy the Edge Function and set the admin invite code

```bash
supabase functions deploy redeem-admin-code
supabase secrets set ADMIN_SIGNUP_CODE=choose-a-secret-code
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
provided to Edge Functions automatically by Supabase.

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

Sign up for an account, go to `/admin`, and enter the `ADMIN_SIGNUP_CODE` you
set in step 3 to unlock the admin panel.

## Security notes

- The `students` table is publicly readable by design (that's what makes
  `/verify` work for anonymous visitors) — don't add sensitive personal data
  (phone numbers, addresses, etc.) to it.
- `admin_users` has no client-side write policy; the only way in is the
  `redeem-admin-code` function, which checks the invite code server-side.
- Rotate `ADMIN_SIGNUP_CODE` (via `supabase secrets set`) if it leaks.
