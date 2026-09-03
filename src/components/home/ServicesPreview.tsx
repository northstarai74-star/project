import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../../lib/api/services'
import type { Service } from '../../lib/types'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Skeleton } from '../ui/Skeleton'
import { Button } from '../ui/Button'
import { ArtTile } from '../ui/ArtTile'

export function ServicesPreview() {
  const [services, setServices] = useState<Service[] | null>(null)

  useEffect(() => {
    let active = true
    getServices().then((data) => {
      if (active) setServices(data.slice(0, 4))
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="bg-blush-light/40 py-20">
      <div className="container-app">
        <SectionHeading
          eyebrow="What We Offer"
          title="Featured Services"
          description="From everyday manicures to bridal-ready artistry, every service is tailored to you."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!services &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          {services?.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.08}>
              <div className="group h-full overflow-hidden rounded-2xl bg-white shadow-soft">
                <ArtTile
                  seed={service.image}
                  label={service.name}
                  radius="none"
                  className="h-40 w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
                    {service.category}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-charcoal">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-charcoal/70">
                    ${service.price} · {service.durationMinutes} min
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/services">
            <Button variant="secondary">View All Services</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
