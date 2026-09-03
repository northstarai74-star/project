import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock3 } from 'lucide-react'
import { getServices } from '../lib/api/services'
import type { Service } from '../lib/types'
import { PageHeader } from '../components/ui/PageHeader'
import { Skeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { ArtTile } from '../components/ui/ArtTile'

const CATEGORIES: Array<Service['category'] | 'All'> = [
  'All',
  'Classic',
  'Gel & Extensions',
  '3D Nail Art',
  'Bridal',
]

export function Services() {
  const [services, setServices] = useState<Service[] | null>(null)
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All')

  useEffect(() => {
    document.title = 'Services | Self Pampering'
    getServices().then(setServices)
  }, [])

  const visible = services?.filter((s) => filter === 'All' || s.category === filter)

  return (
    <>
      <PageHeader
        eyebrow="Menu"
        title="Our Services"
        description="Every treatment is performed with sterilized tools and professional-grade products."
      />

      <section className="container-app py-16">
        <div className="mb-10 flex flex-wrap justify-center gap-3" role="group" aria-label="Filter services by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`focus-ring rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === cat
                  ? 'bg-charcoal text-cream'
                  : 'bg-blush-light text-charcoal hover:bg-blush'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {!services &&
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
          {visible?.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 0.08}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft">
                <ArtTile
                  seed={service.image}
                  label={service.name}
                  radius="none"
                  className="h-48 w-full"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
                    {service.category}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-charcoal">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-charcoal/70">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-serif text-lg font-semibold text-charcoal">
                      ${service.price}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-charcoal/60">
                      <Clock3 size={14} /> {service.durationMinutes} min
                    </span>
                  </div>
                  <Link to={`/booking?service=${service.id}`} className="mt-5">
                    <Button className="w-full" variant="secondary">
                      Book This Service
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
