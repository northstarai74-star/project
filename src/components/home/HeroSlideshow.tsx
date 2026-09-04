import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getNailExtensionLooks } from '../../lib/api/extensions'
import { getGalleryImages } from '../../lib/api/gallery'
import { ArtTile } from '../ui/ArtTile'
import { Skeleton } from '../ui/Skeleton'
import { cn, prefersReducedMotion } from '../../lib/utils'

const AUTOPLAY_MS = 3200

interface HeroSlide {
  id: string
  label: string
  title: string
  seed: string
  icon: 'nail' | 'nails'
}

async function loadSlides(): Promise<HeroSlide[]> {
  const [extensions, gallery] = await Promise.all([getNailExtensionLooks(), getGalleryImages()])

  const extensionSlides: HeroSlide[] = extensions.map((look) => ({
    id: look.id,
    label: `${look.shape} Shape`,
    title: look.title,
    seed: look.image,
    icon: 'nails',
  }))

  const gallerySlides: HeroSlide[] = gallery.slice(0, 6).map((image) => ({
    id: image.id,
    label: image.category,
    title: image.alt,
    seed: image.src,
    icon: 'nail',
  }))

  // Interleave so the loop alternates between extension shapes and gallery
  // work rather than running through one category, then the other.
  const combined: HeroSlide[] = []
  const max = Math.max(extensionSlides.length, gallerySlides.length)
  for (let i = 0; i < max; i++) {
    if (extensionSlides[i]) combined.push(extensionSlides[i])
    if (gallerySlides[i]) combined.push(gallerySlides[i])
  }
  return combined
}

/**
 * A looping, auto-advancing "video-like" slideshow of nail extension shapes
 * and gallery work for the hero visual slot. This build can't embed a real
 * video clip (see README's "A note on photos and video"), so this
 * crossfades through illustrated ArtTiles instead — the closest
 * ambient-motion stand-in available without real footage.
 */
export function HeroSlideshow() {
  const [slides, setSlides] = useState<HeroSlide[] | null>(null)
  const [index, setIndex] = useState(0)
  const reducedMotion = useRef(prefersReducedMotion())

  useEffect(() => {
    loadSlides().then(setSlides)
  }, [])

  useEffect(() => {
    if (!slides || reducedMotion.current) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [slides])

  if (!slides) {
    return <Skeleton className="h-[420px] w-full sm:h-[520px]" />
  }

  const current = slides[index]

  return (
    <div className="relative h-[420px] w-full overflow-hidden sm:h-[520px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <ArtTile
            seed={current.seed}
            icon={current.icon}
            label={`${current.label} — ${current.title}`}
            radius="none"
            className="h-full w-full"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent p-5 pt-16 sm:p-6 sm:pt-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
          {current.label}
        </p>
        <p className="mt-1 font-serif text-lg font-semibold text-cream sm:text-xl">{current.title}</p>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-1.5" aria-hidden="true">
        {slides.map((slide, i) => (
          <span
            key={slide.id}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-5 bg-gold' : 'w-1.5 bg-cream/40',
            )}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Now showing: {current.title}
      </p>
    </div>
  )
}
