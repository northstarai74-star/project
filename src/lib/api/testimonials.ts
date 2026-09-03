// TODO(backend): Replace mock data with a call to the Node.js API,
// e.g. GET /api/testimonials
// which will query Supabase table `testimonials`
// (columns: id, name, quote, rating, avatar_url, approved, created_at).
import type { Testimonial } from '../types'

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Amara O.',
    quote: 'My bridal nails were absolutely flawless. The team listened to every detail and the result exceeded my vision.',
    rating: 5,
    avatar: 'self-pampering-avatar-1',
  },
  {
    id: 'test-2',
    name: 'Priya S.',
    quote: 'I trained in their Diploma in Nail Art program and now run my own studio. The trainers genuinely care about your growth.',
    rating: 5,
    avatar: 'self-pampering-avatar-2',
  },
  {
    id: 'test-3',
    name: 'Lucia M.',
    quote: 'Hygienic, professional, and so relaxing. It is the only place I trust with my nails now.',
    rating: 5,
    avatar: 'self-pampering-avatar-3',
  },
  {
    id: 'test-4',
    name: 'Grace T.',
    quote: 'The 3D nail art is genuinely wearable art. I get compliments every single time.',
    rating: 4,
    avatar: 'self-pampering-avatar-4',
  },
]

export async function getTestimonials(): Promise<Testimonial[]> {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return MOCK_TESTIMONIALS
}
