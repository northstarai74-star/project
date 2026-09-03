# Self Pampering — Nail Art Studio & Training Academy

A complete, responsive marketing website for Self Pampering: a nail art
studio and training academy. Includes a certificate verification and
PDF-download feature for academy graduates.

This is a **frontend-only** build. All data (services, gallery, courses,
testimonials, certificates) comes from a typed mock API layer designed to
be swapped for a real Node.js + Supabase backend without touching any UI
code — see [`docs/backend-handoff-notes.md`](docs/backend-handoff-notes.md)
for the integration plan.

## Stack

- React + TypeScript + Vite
- Tailwind CSS for styling
- React Router for routing
- Framer Motion for scroll/entrance animations
- react-hook-form + zod for form validation
- jsPDF + html2canvas for client-side certificate PDF generation
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. No environment variables or backend are
required — everything runs against mock data.

Other scripts:

```bash
npm run build    # type-check and production build
npm run preview  # preview the production build locally
npm run lint      # lint with oxlint
```

## Project structure

```
src/
  components/
    layout/        Header, Footer, page Layout
    ui/             Shared primitives (Button, Card, Field, Lightbox, ...)
    home/           Home page sections (Hero, Highlights, Testimonials, ...)
    certificate/    The certificate preview used on the verification page
  pages/            One component per route (Home, Services, Gallery, Academy,
                     VerifyCertificate, About, Booking, Contact, NotFound)
  lib/
    api/            Mock, typed "service layer" — see Backend integration below
    types.ts        Shared TypeScript interfaces
    pdf.ts          Client-side PDF generation helper
    utils.ts        Small shared helpers
docs/
  backend-handoff-notes.md   Supabase schema + API contract for the future backend
```

## Pages

- **Home** — hero, highlights, featured services, gallery preview, testimonials,
  certificate verification teaser, newsletter signup
- **Services** — filterable service list with pricing and booking CTA
- **Gallery** — filterable, lightbox-enabled image grid
- **Academy** — course listings with curriculum, fees, and certificate info
- **Verify Certificate** — the core feature (see below)
- **About** — studio story and team bios
- **Booking** — validated appointment request form
- **Contact** — contact form, hours, and map placeholder

## Certificate verification (core feature)

`/verify-certificate` lets a visitor enter a certificate reference number
(try `SP-2026-00123`, `SP-2025-00987`, `SP-2025-00456`, or `SP-2024-00078`)
and:

- shows a loading state while "checking" the reference number,
- renders a styled, official-looking certificate on a match, with a
  **Download as PDF** button that generates a print-quality PDF from the
  exact certificate shown, or
- shows a friendly "not found" state for an invalid reference.

## Backend integration points

Every function in `src/lib/api/*.ts` is async, typed, and already shaped
like a real network call (with a simulated delay). Each file starts with a
`TODO(backend)` comment describing the real endpoint it should call. To wire
in a real backend:

1. Build the Node.js API + Supabase schema described in
   [`docs/backend-handoff-notes.md`](docs/backend-handoff-notes.md).
2. Replace the body of each function in `src/lib/api/*.ts` with a `fetch`
   call to the matching endpoint.
3. No page or component needs to change — they only ever import from
   `src/lib/api/*`.

## A note on the gallery photos

The brief asked for photos from the studio's Instagram
(`@selfpampering2022`), but this build environment cannot reach
instagram.com, and Instagram has no public API for pulling a business
account's photos without authentication. The gallery, hero, and about-page
images currently use placeholder stock photography (Lorem Picsum) so every
page is fully demonstrable. Before launch, download the real photos from
Instagram and swap the URLs in `src/lib/api/gallery.ts`,
`src/components/home/Hero.tsx`, and `src/pages/About.tsx` — see the note at
the bottom of `docs/backend-handoff-notes.md`.
