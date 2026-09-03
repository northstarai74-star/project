import { ShieldCheck, Award, Gem, Clock3 } from 'lucide-react'
import { Reveal } from '../ui/Reveal'

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Hygienic Tools',
    description: 'Hospital-grade sterilization and single-use tools for every client, every time.',
  },
  {
    icon: Award,
    title: 'Certified Trainers',
    description: 'Every trainer is a certified professional with years of studio and teaching experience.',
  },
  {
    icon: Gem,
    title: 'Premium Products',
    description: 'We use only professional-grade polishes, gels, and nail-safe embellishments.',
  },
  {
    icon: Clock3,
    title: '8+ Years Experience',
    description: 'Trusted by clients and students since 2017, with hundreds of certified graduates.',
  },
]

export function Highlights() {
  return (
    <section className="container-app py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-blush-light bg-white p-6 text-center shadow-soft">
              <item.icon className="mx-auto text-gold-dark" size={32} aria-hidden="true" />
              <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm text-charcoal/65">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
