// TODO(backend): Replace mock data with a call to the Node.js API,
// e.g. GET /api/gallery
// which will query Supabase table `gallery_images`
// (columns: id, category, image_url, alt_text, created_at), or Supabase Storage
// for the underlying files. Real photos should be sourced from the studio's
// Instagram (@selfpampering2022) and uploaded to Supabase Storage.
import type { GalleryImage } from '../types'

const MOCK_GALLERY: GalleryImage[] = [
  { id: 'gal-1', category: 'Bridal', src: 'https://picsum.photos/seed/self-pampering-gallery-1/600/750', alt: 'Elegant bridal nail set with pearl and lace detailing' },
  { id: 'gal-2', category: '3D Art', src: 'https://picsum.photos/seed/self-pampering-gallery-2/600/750', alt: '3D sculptural nail art with gold foil accents' },
  { id: 'gal-3', category: 'Seasonal', src: 'https://picsum.photos/seed/self-pampering-gallery-3/600/750', alt: 'Autumn-themed nail art in warm tones' },
  { id: 'gal-4', category: 'Minimal', src: 'https://picsum.photos/seed/self-pampering-gallery-4/600/750', alt: 'Minimal nude nail set with a single gold line accent' },
  { id: 'gal-5', category: 'Bridal', src: 'https://picsum.photos/seed/self-pampering-gallery-5/600/750', alt: 'Bridal French tip nails with subtle shimmer' },
  { id: 'gal-6', category: '3D Art', src: 'https://picsum.photos/seed/self-pampering-gallery-6/600/750', alt: 'Chrome mirror nail art with hand-painted florals' },
  { id: 'gal-7', category: 'Seasonal', src: 'https://picsum.photos/seed/self-pampering-gallery-7/600/750', alt: 'Festive holiday nail art with glitter accents' },
  { id: 'gal-8', category: 'Minimal', src: 'https://picsum.photos/seed/self-pampering-gallery-8/600/750', alt: 'Soft blush minimal manicure' },
  { id: 'gal-9', category: '3D Art', src: 'https://picsum.photos/seed/self-pampering-gallery-9/600/750', alt: 'Textured 3D nail art with pearls and crystals' },
  { id: 'gal-10', category: 'Bridal', src: 'https://picsum.photos/seed/self-pampering-gallery-10/600/750', alt: 'Classic bridal white and gold nail set' },
  { id: 'gal-11', category: 'Seasonal', src: 'https://picsum.photos/seed/self-pampering-gallery-11/600/750', alt: 'Spring floral nail art in pastel tones' },
  { id: 'gal-12', category: 'Minimal', src: 'https://picsum.photos/seed/self-pampering-gallery-12/600/750', alt: 'Clean geometric line art manicure' },
]

export async function getGalleryImages(): Promise<GalleryImage[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return MOCK_GALLERY
}
