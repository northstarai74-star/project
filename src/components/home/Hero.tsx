import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { HeroSlideshow } from './HeroSlideshow'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(60% 55% at 82% 15%, rgba(184,147,63,.35), transparent 60%), radial-gradient(50% 45% at 8% 90%, rgba(184,147,63,.18), transparent 65%)',
        }}
      />
      <div className="container-app relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            <BadgeCheck size={16} /> Certified Nail Artistry
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
            Nail art that feels like{' '}
            <span className="foil-text italic">self‑care.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/70">
            Self Pampering is a boutique nail art studio and training academy — where
            hygienic craftsmanship meets bespoke design, for clients and future
            nail artists alike.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/booking">
              <Button size="lg" variant="invert">
                Book an Appointment
              </Button>
            </Link>
            <Link to="/verify-certificate">
              <Button size="lg" variant="outline-invert">
                Verify Certificate
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-soft ring-1 ring-gold/20">
            <HeroSlideshow />
            {/* Diagonal light sweep layered on top for extra "in motion"
                shine — this environment cannot embed a real video clip, see
                README's "A note on photos and video". */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
          </div>
          <div className="absolute -top-6 -right-6 hidden rounded-2xl bg-cream p-4 shadow-soft sm:block">
            <p className="font-serif text-2xl font-bold text-gold-dark">500+</p>
            <p className="text-xs font-medium text-charcoal/60">Certified graduates</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
