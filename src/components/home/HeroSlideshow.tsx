import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getNailExtensionLooks } from '../../lib/api/extensions'
import type { NailExtensionLook } from '../../lib/types'
import { ArtTile } from '../ui/ArtTile'
import { Skeleton } from '../ui/Skeleton'
import { cn, prefersReducedMotion } from '../../lib/utils'

const AUTOPLAY_MS = 3200

/**
 * A looping, auto-advancing "video-like" slideshow of nail extension shapes
 * for the hero visual slot. This build can't embed a real video clip (see
 * README's "A note on photos and video"), so this crossfades through
 * illustrated ArtTiles instead — the closest ambient-motion stand-in
 * available without real footage.
 */
export function HeroSlideshow() {
  const [looks, setLooks] = useState<NailExtensionLook[] | null>(null)
  const [index, setIndex] = useState(0)
  const reducedMotion = useRef(prefersReducedMotion())

  useEffect(() => {
    getNailExtensionLooks().then(setLooks)
  }, [])

  useEffect(() => {
    if (!looks || reducedMotion.current) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % looks.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [looks])

  if (!looks) {
    return <Skeleton className="h-[420px] w-full sm:h-[520px]" />
  }

  const current = looks[index]

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
            seed={current.image}
            icon="nails"
            label={`${current.title} — ${current.description}`}
            radius="none"
            className="h-full w-full"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent p-5 pt-16 sm:p-6 sm:pt-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
          {current.shape} Shape
        </p>
        <p className="mt-1 font-serif text-lg font-semibold text-cream sm:text-xl">{current.title}</p>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-1.5" aria-hidden="true">
        {looks.map((look, i) => (
          <span
            key={look.id}
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
