import { useEffect, useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { getTestimonials } from '../../lib/api/testimonials'
import type { Testimonial } from '../../lib/types'
import { SectionHeading } from '../ui/SectionHeading'
import { ArtTile } from '../ui/ArtTile'

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    getTestimonials().then(setTestimonials)
  }, [])

  if (testimonials.length === 0) return null

  const current = testimonials[index]

  return (
    <section className="bg-charcoal py-20 text-cream">
      <div className="container-app">
        <SectionHeading
          eyebrow="Client Love"
          title="What Our Clients Say"
          className="[&_h2]:text-cream [&_p]:text-cream/70"
        />

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <Quote className="mx-auto text-gold" size={32} aria-hidden="true" />
          <p className="mt-6 font-serif text-xl italic text-cream sm:text-2xl">
            “{current.quote}”
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <ArtTile
              seed={current.avatar}
              label={`Portrait of ${current.name}`}
              icon="none"
              shape="round"
              className="h-12 w-12"
            />
            <div className="text-left">
              <p className="font-semibold text-cream">{current.name}</p>
              <div className="flex gap-0.5" aria-label={`${current.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < current.rating ? 'fill-gold text-gold' : 'text-cream/30'}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous testimonial"
              className="focus-ring rounded-full bg-cream/10 p-2 hover:bg-cream/20"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  className={`h-2 w-2 rounded-full ${i === index ? 'bg-gold' : 'bg-cream/30'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              aria-label="Next testimonial"
              className="focus-ring rounded-full bg-cream/10 p-2 hover:bg-cream/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
