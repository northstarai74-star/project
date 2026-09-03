# Backend Handoff Notes

This document is **not** part of the live site. It's the integration contract
for whoever builds the Node.js + Supabase backend for Self Pampering next.

The frontend (in `src/`) is fully built against mock data in `src/lib/api/*`.
Every function in that folder is async and already shaped like a real network
call, with a `TODO(backend)` comment at the top of the file pointing at the
endpoint it should eventually call. Swapping mock data for real data means
rewriting the body of those functions — no UI component should need to
change.

## 1. Supabase schema

### `certificates`

| column           | type        | notes                                   |
|------------------|-------------|------------------------------------------|
| id               | uuid, pk    | default `gen_random_uuid()`             |
| reference_number | text, unique| e.g. `SP-2026-00123`, indexed for lookup|
| student_name     | text        |                                          |
| course_title     | text        |                                          |
| course_id        | uuid, fk -> courses.id | nullable                      |
| issue_date       | date        |                                          |
| pdf_url          | text        | nullable, Supabase Storage URL if pre-rendered |
| created_at       | timestamptz | default `now()`                         |

Certificates are issued/added by an **admin** — either via a future admin
dashboard or directly in the Supabase Table Editor — after a student
completes their course. The reference number should be generated in a
consistent, hard-to-guess format, e.g. `SP-<year>-<5-6 random alphanumeric
or sequential zero-padded digits>`, and enforced unique at the database level.

### `courses`

| column            | type        |
|-------------------|-------------|
| id                | uuid, pk    |
| title             | text        |
| level             | text        | `Beginner` \| `Advanced` \| `Diploma` |
| duration_weeks    | int         |
| fee               | numeric     |
| curriculum        | jsonb       | array of strings |
| certificate_title | text        |
| image_url         | text        |

### `services`

| column           | type    |
|------------------|---------|
| id               | uuid, pk|
| category         | text    |
| name             | text    |
| description      | text    |
| price            | numeric |
| duration_minutes | int     |
| image_url        | text    |

### `gallery_images`

| column     | type    |
|------------|---------|
| id         | uuid, pk|
| category   | text    | `Bridal` \| `3D Art` \| `Seasonal` \| `Minimal` |
| image_url  | text    | Supabase Storage URL |
| alt_text   | text    |
| created_at | timestamptz |

### `bookings`

| column      | type        |
|-------------|-------------|
| id          | uuid, pk    |
| name        | text        |
| phone       | text        |
| email       | text        |
| service_id  | uuid, fk -> services.id |
| date        | date        |
| time        | time        |
| notes       | text, nullable |
| status      | text        | `pending` \| `confirmed` \| `cancelled`, default `pending` |
| created_at  | timestamptz |

### `enrollments`

| column      | type        |
|-------------|-------------|
| id          | uuid, pk    |
| name        | text        |
| phone       | text        |
| email       | text        |
| course_id   | uuid, fk -> courses.id |
| notes       | text, nullable |
| status      | text        | `pending` \| `confirmed` \| `cancelled`, default `pending` |
| created_at  | timestamptz |

### `testimonials`

| column     | type    |
|------------|---------|
| id         | uuid, pk|
| name       | text    |
| quote      | text    |
| rating     | int     | 1-5 |
| avatar_url | text    |
| approved   | boolean | default `false`, so an admin can moderate before it goes live |
| created_at | timestamptz |

### `newsletter_subscribers`

| column     | type        |
|------------|-------------|
| id         | uuid, pk    |
| email      | text, unique|
| created_at | timestamptz |

## 2. API endpoints (Node.js/Express or Next.js API routes)

| Method | Path                              | Purpose                              |
|--------|------------------------------------|---------------------------------------|
| GET    | `/api/services`                    | List all services                    |
| GET    | `/api/courses`                     | List all courses                     |
| GET    | `/api/gallery`                     | List gallery images (optional `?category=`) |
| GET    | `/api/testimonials`                | List approved testimonials           |
| GET    | `/api/certificates/:referenceNumber` | Look up one certificate by reference number — 404 if not found |
| POST   | `/api/bookings`                    | Create a booking request             |
| POST   | `/api/enrollments`                 | Create a course enrollment request   |
| POST   | `/api/contact`                     | Submit a contact form message        |
| POST   | `/api/newsletter`                  | Subscribe an email to the newsletter |

Each mock function in `src/lib/api/*.ts` maps 1:1 to one of the endpoints
above — see the `TODO(backend)` comment at the top of each file.

## 3. Certificate issuance flow

1. A student completes a course.
2. An admin (via a future admin dashboard, or directly in the Supabase Table
   Editor) inserts a row into `certificates` with a freshly generated,
   unique `reference_number`.
3. The student is given their reference number (e.g. via email).
4. Anyone can verify it at `/verify-certificate` on the public site, which
   calls `GET /api/certificates/:referenceNumber`.
5. On a match, the frontend renders the certificate and lets the visitor
   download it as a PDF client-side (no server-side PDF generation needed,
   though `pdf_url` is reserved on the schema in case a pre-rendered PDF is
   preferred later).

## 4. Environment variables (backend)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PORT=
# Optional, if outbound email is added later (e.g. booking confirmations)
RESEND_API_KEY=
```

Do not commit real values — these are placeholders for the backend project's
own `.env`.

## 5. Notes on the gallery images used in this build

The client's Instagram (`@selfpampering2022`) was named as the source for
gallery photography, but this environment could not reach instagram.com
(network egress to Instagram is blocked here, and Instagram does not offer a
public, unauthenticated API for pulling a business account's photos). The
gallery and hero images currently use placeholder stock photography from
Lorem Picsum so every layout is fully demonstrable. Before launch, replace
the URLs in `src/lib/api/gallery.ts` (and the hero/about images in
`src/components/home/Hero.tsx` and `src/pages/About.tsx`) with real photos
downloaded from the studio's Instagram and uploaded to Supabase Storage (or
`public/images/`).
