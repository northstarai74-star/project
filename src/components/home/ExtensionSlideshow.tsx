import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { getNailExtensionLooks } from '../../lib/api/extensions'
import type { NailExtensionLook } from '../../lib/types'
import { ArtTile } from '../ui/ArtTile'
import { SectionHeading } from '../ui/SectionHeading'
import { Skeleton } from '../ui/Skeleton'
import { cn, prefersReducedMotion } from '../../lib/utils'

const AUTOPLAY_MS = 4500

export function ExtensionSlideshow() {
  const [looks, setLooks] = useState<NailExtensionLook[] | null>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const reducedMotion = useRef(prefersReducedMotion())

  useEffect(() => {
    getNailExtensionLooks().then(setLooks)
  }, [])

  useEffect(() => {
    if (!looks || paused || reducedMotion.current) return
    const timer = setInterval(() => {
      setDirection(1)
      setIndex((i) => (i + 1) % looks.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [looks, paused])

  function goTo(next: number) {
    if (!looks) return
    setDirection(next > index ? 1 : -1)
    setIndex((next + looks.length) % looks.length)
  }

  return (
    <section className="bg-cream py-20">
      <div className="container-app">
        <SectionHeading
          eyebrow="Extension Shapes"
          title="Nail Extensions, Every Shape"
          description="A quick look at the extension shapes and finishes clients love most — swipe or let it play."
        />

        {!looks && <Skeleton className="mx-auto mt-12 h-[420px] w-full max-w-3xl" />}

        {looks && (
          <div
            className="relative mx-auto mt-12 max-w-3xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-soft sm:aspect-[16/9]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={looks[index].id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <ArtTile
                    seed={looks[index].image}
                    label={`${looks[index].title} — ${looks[index].description}`}
                    icon="nail"
                    radius="none"
                    className="h-full w-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent p-6 pt-16 sm:p-8 sm:pt-24">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
                      {looks[index].shape} Shape
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-semibold text-cream sm:text-2xl">
                      {looks[index].title}
                    </h3>
                    <p className="mt-1 max-w-md text-sm text-cream/75">{looks[index].description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous extension shape"
              className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 p-2 text-charcoal shadow-soft hover:bg-cream"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next extension shape"
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 p-2 text-charcoal shadow-soft hover:bg-cream"
            >
              <ChevronRight size={20} />
            </button>

            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                className="focus-ring rounded-full border border-blush-light p-2 text-charcoal/70 hover:text-gold-dark"
              >
                {paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <div className="flex gap-2" role="tablist" aria-label="Extension shape slides">
                {looks.map((look, i) => (
                  <button
                    key={look.id}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show ${look.title}`}
                    onClick={() => goTo(i)}
                    className={cn(
                      'h-2 w-2 rounded-full transition-all',
                      i === index ? 'w-6 bg-gold' : 'bg-blush-light hover:bg-blush',
                    )}
                  />
                ))}
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              {looks[index].title}: {looks[index].description}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
