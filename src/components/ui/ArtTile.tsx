import type { ReactElement } from 'react'
import { cn } from '../../lib/utils'

// Illustrated stand-in for real photography/video. This project cannot reach
// any external image or video host from its build environment, so every
// place a photo would normally go uses one of these generated art tiles
// instead of a broken or unlicensed placeholder image. Swap in real photos
// or a <video> element from the studio's Instagram once available — see
// README.md and docs/backend-handoff-notes.md.

type Icon = 'nail' | 'nails' | 'sparkle' | 'flower' | 'brush' | 'shield' | 'none'
type Radius = 'md' | 'none' | 'full'

interface ArtTileProps {
  seed: string
  label: string
  icon?: Icon
  shape?: 'rect' | 'round'
  /** Corner radius. Defaults from `shape`, but can be overridden — e.g. set
   *  to 'none' when the tile sits inside a card that already clips corners. */
  radius?: Radius
  className?: string
}

// Matches the palette in tailwind.config.js (blush/gold tokens). Each pair
// is a fully opaque diagonal wash so tiles read as deliberate blocks of
// brand color rather than a faint tint of the page background.
const PALETTES: Array<[string, string]> = [
  ['#C9AD73', '#C08893'], // gold-light -> blush
  ['#C08893', '#A6813C'], // blush -> gold
  ['#EFDDD9', '#9C5F6C'], // blush-light -> blush-dark
  ['#A6813C', '#7E5F28'], // gold -> gold-dark
]

function hashSeed(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }
  return h
}

const ICONS: Record<Exclude<Icon, 'none'>, ReactElement> = {
  // A single manicured fingernail, close-up: nail plate + cuticle line +
  // a glossy highlight streak — the closest thing to an actual "photo of a
  // nail" this build can offer without real photography (see note above).
  nail: (
    <g>
      <rect x="7.5" y="3.5" width="9" height="15.5" rx="4.5" ry="7" />
      <path fill="none" d="M8.3 7.6c1.1-1.5 2.4-2.1 3.7-2.1s2.6.6 3.7 2.1" opacity="0.55" />
      <path fill="none" d="M9.7 6.2c-.9 2-1.1 5-1 9.5" opacity="0.4" />
    </g>
  ),
  // Three fingertips in a row, each with a polished nail — a stand-in for
  // a "hand shot" of a finished manicure.
  nails: (
    <g>
      <rect x="3.2" y="8" width="5.4" height="12.5" rx="2.7" ry="4.3" />
      <rect x="9.3" y="3.5" width="5.4" height="16.5" rx="2.7" ry="4.6" />
      <rect x="15.4" y="7" width="5.4" height="13" rx="2.7" ry="4.3" />
      <path fill="none" d="M4.2 11c.7-.9 1.5-1.3 2.3-1.3s1.6.4 2.3 1.3" opacity="0.5" />
      <path fill="none" d="M10.3 6.2c.8-1 1.6-1.4 2.4-1.4s1.6.4 2.4 1.4" opacity="0.5" />
      <path fill="none" d="M16.4 10c.7-.9 1.5-1.3 2.3-1.3s1.6.4 2.3 1.3" opacity="0.5" />
    </g>
  ),
  sparkle: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  ),
  flower: <path d="M12 2c2 4 6 5 9 5-2 3-2 8 0 11-3-1-7 0-9 4-2-4-6-5-9-4 2-3 2-8 0-11 3 0 7-1 9-5z" />,
  brush: <path d="M4 20c2-9 8-14 16-16-2 8-7 14-16 16z" />,
  shield: <path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z" />,
}

const RADIUS_CLASS: Record<Radius, string> = {
  md: 'rounded-2xl',
  none: 'rounded-none',
  full: 'rounded-full',
}

export function ArtTile({ seed, label, icon = 'nail', shape = 'rect', radius, className }: ArtTileProps) {
  const hash = hashSeed(seed)
  const [a, b] = PALETTES[hash % PALETTES.length]
  const resolvedRadius = radius ?? (shape === 'round' ? 'full' : 'md')

  return (
    <div
      role="img"
      aria-label={label}
      className={cn('relative overflow-hidden', RADIUS_CLASS[resolvedRadius], className)}
      style={{
        backgroundImage: `linear-gradient(${135 + (hash % 60)}deg, ${a} 0%, ${b} 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(45% 40% at ${20 + (hash % 25)}% ${15 + (hash % 20)}%, rgba(255,255,255,.28), transparent 70%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(1.6px 1.6px at 20% 30%, #FAF6F0 45%, transparent 46%), radial-gradient(1.6px 1.6px at 70% 20%, #FAF6F0 45%, transparent 46%), radial-gradient(1.6px 1.6px at 40% 75%, #FAF6F0 45%, transparent 46%), radial-gradient(1.6px 1.6px at 85% 65%, #FAF6F0 45%, transparent 46%), radial-gradient(1.6px 1.6px at 55% 45%, #FAF6F0 45%, transparent 46%)',
        }}
      />
      {icon !== 'none' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            aria-hidden="true"
            width={icon === 'nail' || icon === 'nails' ? '34%' : '22%'}
            height={icon === 'nail' || icon === 'nails' ? '34%' : '22%'}
            viewBox="0 0 24 24"
            fill={icon === 'nail' || icon === 'nails' ? '#FAF7F1' : 'none'}
            fillOpacity={icon === 'nail' || icon === 'nails' ? 0.92 : 1}
            stroke="#FAF7F1"
            strokeWidth={1.1}
            className="opacity-90 drop-shadow-sm"
          >
            {ICONS[icon]}
          </svg>
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/5" />
    </div>
  )
}
