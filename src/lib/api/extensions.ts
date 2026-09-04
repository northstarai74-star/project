// TODO(backend): Replace mock data with a call to the Node.js API,
// e.g. GET /api/nail-extensions
// which will query Supabase table `nail_extension_looks`
// (columns: id, title, shape, description, image_url, sort_order).
import type { NailExtensionLook } from '../types'

const MOCK_EXTENSIONS: NailExtensionLook[] = [
  {
    id: 'ext-classic-gel',
    title: 'Classic Gel Extensions',
    shape: 'Round',
    description: 'A natural, everyday length with a glossy gel finish — durable and low-maintenance.',
    image: 'extension-classic-gel',
  },
  {
    id: 'ext-coffin',
    title: 'Coffin / Ballerina Extensions',
    shape: 'Coffin',
    description: 'Squared-off tips with tapered sides for a bold, editorial silhouette.',
    image: 'extension-coffin',
  },
  {
    id: 'ext-almond',
    title: 'Almond Extensions',
    shape: 'Almond',
    description: 'Softly rounded and elongating — a timeless, elegant everyday shape.',
    image: 'extension-almond',
  },
  {
    id: 'ext-stiletto',
    title: 'Stiletto Extensions',
    shape: 'Stiletto',
    description: 'Sharp, dramatic points for clients who want a statement-making set.',
    image: 'extension-stiletto',
  },
  {
    id: 'ext-square',
    title: 'Square Extensions',
    shape: 'Square',
    description: 'Clean, straight edges with sharp corners for a modern, structured look.',
    image: 'extension-square',
  },
  {
    id: 'ext-ombre',
    title: 'Ombré French Extensions',
    shape: 'Almond',
    description: 'A soft gradient tip built on an extended almond base — a bridal favorite.',
    image: 'extension-ombre',
  },
]

export async function getNailExtensionLooks(): Promise<NailExtensionLook[]> {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return MOCK_EXTENSIONS
}
