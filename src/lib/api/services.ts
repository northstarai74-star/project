// TODO(backend): Replace mock data with a call to the Node.js API,
// e.g. GET /api/services
// which will query Supabase table `services`
// (columns: id, category, name, description, price, duration_minutes, image_url).
import type { Service } from '../types'

const MOCK_SERVICES: Service[] = [
  {
    id: 'svc-classic-mani',
    category: 'Classic',
    name: 'Classic Manicure',
    description: 'Nail shaping, cuticle care, hand massage, and a polish finish in the shade of your choice.',
    price: 25,
    durationMinutes: 45,
    image: 'self-pampering-classic-1',
  },
  {
    id: 'svc-classic-pedi',
    category: 'Classic',
    name: 'Classic Pedicure',
    description: 'Relaxing soak, exfoliation, nail shaping, and polish for soft, camera-ready feet.',
    price: 35,
    durationMinutes: 60,
    image: 'self-pampering-classic-2',
  },
  {
    id: 'svc-gel-extension',
    category: 'Gel & Extensions',
    name: 'Gel Extensions',
    description: 'Durable, chip-resistant gel extensions built and shaped to your desired length.',
    price: 55,
    durationMinutes: 90,
    image: 'self-pampering-gel-1',
  },
  {
    id: 'svc-gel-overlay',
    category: 'Gel & Extensions',
    name: 'Gel Overlay & Refill',
    description: 'Strengthen and refresh your natural nails with a glossy, long-lasting gel overlay.',
    price: 40,
    durationMinutes: 60,
    image: 'self-pampering-gel-2',
  },
  {
    id: 'svc-3d-art',
    category: '3D Nail Art',
    name: '3D Sculptural Nail Art',
    description: 'Hand-sculpted charms, embellishments, and textures for a truly one-of-a-kind set.',
    price: 65,
    durationMinutes: 120,
    image: 'self-pampering-3d-1',
  },
  {
    id: 'svc-3d-chrome',
    category: '3D Nail Art',
    name: 'Chrome & Mixed Media Art',
    description: 'Mirror chrome finishes layered with fine-line art for a bold, editorial look.',
    price: 60,
    durationMinutes: 105,
    image: 'self-pampering-3d-2',
  },
  {
    id: 'svc-bridal-trial',
    category: 'Bridal',
    name: 'Bridal Nail Trial',
    description: 'A one-on-one design trial to perfect your wedding-day nail look ahead of the big day.',
    price: 45,
    durationMinutes: 60,
    image: 'self-pampering-bridal-1',
  },
  {
    id: 'svc-bridal-party',
    category: 'Bridal',
    name: 'Bridal Party Package',
    description: 'On-site or in-studio nail styling for the bride and her full wedding party.',
    price: 250,
    durationMinutes: 240,
    image: 'self-pampering-bridal-2',
  },
]

export async function getServices(): Promise<Service[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return MOCK_SERVICES
}

export async function getServiceById(id: string): Promise<Service | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return MOCK_SERVICES.find((service) => service.id === id) ?? null
}
