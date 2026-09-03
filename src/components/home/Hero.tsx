import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { ArtTile } from '../ui/ArtTile'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush-light via-cream to-cream">
      <div className="container-app grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            <BadgeCheck size={16} /> Certified Nail Artistry
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Nail art that feels like <span className="italic text-gold-dark">self‑care.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-charcoal/70">
            Self Pampering is a boutique nail art studio and training academy — where
            hygienic craftsmanship meets bespoke design, for clients and future
            nail artists alike.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/booking">
              <Button size="lg">Book an Appointment</Button>
            </Link>
            <Link to="/verify-certificate">
              <Button size="lg" variant="outline">
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
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <ArtTile
              seed="hero"
              icon="flower"
              label="Close-up of an elegant hand-painted nail art design by Self Pampering"
              className="h-[420px] w-full animate-shimmer sm:h-[520px]"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-soft sm:block">
            <p className="font-serif text-2xl font-bold text-gold-dark">500+</p>
            <p className="text-xs font-medium text-charcoal/60">Certified graduates</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
