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

## A note on photos and video

The brief asked for photos and video from the studio's Instagram
(`@selfpampering2022`), but this build environment cannot reach
instagram.com or any stock media host (Unsplash, Pexels, Pixabay, Mixkit —
all blocked by the sandbox's network policy), and Instagram has no public
API for pulling a business account's photos without authentication.

Every photo/video slot in the site currently renders `<ArtTile>`
(`src/components/ui/ArtTile.tsx`) instead: a small, deterministic
illustration generated from a CSS gradient in the brand palette, topped with
a hand-drawn fingernail/manicure line icon (`icon="nail"` or `icon="nails"`)
so it reads as an actual nail image rather than an abstract shape — plus a
CSS "sheen" sweep on the hero tile standing in for real video motion. Swap
them for real media once available:

- For a photo, replace the `<ArtTile seed="..." label="..." />` with a real
  `<img>` (or Next/Image-style component), reusing the same `label` as
  `alt` text.
- For the hero, `<ArtTile seed="hero" ... />` in
  `src/components/home/Hero.tsx` can become a `<video autoPlay muted loop
  playsInline>` once a real clip exists — no other change needed, since it's
  the only "hero visual" slot in the layout.
- The mock `image`/`src`/`avatar` fields in `src/lib/api/*.ts` are currently
  just seed strings for the tile's gradient; once real backend-hosted photo
  URLs exist, those same fields become that URL.

## Color palette

Defined in `tailwind.config.js` — a premium/luxury palette (true onyx-black
+ champagne gold, in the spirit of black-and-gold beauty packaging) rather
than a pastel one. The Header, Hero, Testimonials, and Footer use `charcoal`
as a background to bookend the page with dark "luxury moments"; content
sections in between stay on the light `cream` ground for readability.

| Token | Hex | Use |
|---|---|---|
| `cream` | `#FAF7F1` | page background |
| `charcoal` | `#141110` | true near-black — header/hero/footer backgrounds, body text |
| `blush` / `blush-light` / `blush-dark` | `#B98A93` / `#EDDCD8` / `#8F5A64` | soft accent surfaces |
| `gold` / `gold-light` / `gold-dark` | `#B8933F` / `#DCC17E` / `#8C6B28` | brand accent, CTAs, certificate foil |

`.foil-text` (in `src/index.css`) applies an animated gold-foil gradient to
text — used sparingly, on the hero's emphasis word only, per the "spend
boldness in one place" principle.
