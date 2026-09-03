import { useEffect } from 'react'
import { Heart, Target, Sparkles } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Reveal } from '../components/ui/Reveal'

const TEAM = [
  {
    name: 'Ada Nwosu',
    role: 'Founder & Master Trainer',
    bio: 'With over 10 years in nail artistry and a certification in advanced nail technology, Ada founded Self Pampering to raise the standard for hygienic, artistic nail care.',
    image: 'https://picsum.photos/seed/self-pampering-team-1/400/400',
  },
  {
    name: 'Zainab Bello',
    role: 'Lead Nail Artist',
    bio: 'Zainab specializes in bridal and 3D sculptural nail art, with a portfolio featured in regional beauty showcases.',
    image: 'https://picsum.photos/seed/self-pampering-team-2/400/400',
  },
  {
    name: 'Chidera Eze',
    role: 'Academy Program Director',
    bio: 'Chidera designs the academy curriculum and oversees student assessment, certification, and career mentorship.',
    image: 'https://picsum.photos/seed/self-pampering-team-3/400/400',
  },
]

export function About() {
  useEffect(() => {
    document.title = 'About Us | Self Pampering'
  }, [])

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="About Self Pampering"
        description="A studio and academy built on hygiene, artistry, and genuine care for every client and student."
      />

      <section className="container-app py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <img
              src="https://picsum.photos/seed/self-pampering-studio/700/560"
              alt="Interior of the Self Pampering nail art studio"
              className="rounded-2xl object-cover shadow-soft"
              loading="lazy"
              width={700}
              height={560}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
              Where craftsmanship meets self-care
            </h2>
            <p className="mt-4 text-charcoal/70">
              Self Pampering began in 2017 as a single-chair studio with one mission: to
              make every client feel cared for, from the moment they sit down to the last
              coat of polish. Today, we're a full studio and training academy, having
              certified over 500 nail artists across the region.
            </p>
            <p className="mt-4 text-charcoal/70">
              We believe great nail art starts with great hygiene and ends with genuine
              artistry — and we hold every service and every student to that standard.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: Heart, title: 'Our Care', text: 'Every client and student is treated with warmth, patience, and respect.' },
            { icon: Target, title: 'Our Mission', text: 'Raise the standard for hygienic, artistic nail care and education.' },
            { icon: Sparkles, title: 'Our Craft', text: 'Blending technical precision with genuine artistic expression.' },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="rounded-2xl bg-white p-6 text-center shadow-soft">
                <item.icon className="mx-auto text-gold-dark" size={28} />
                <h3 className="mt-3 font-serif text-lg font-semibold text-charcoal">{item.title}</h3>
                <p className="mt-2 text-sm text-charcoal/65">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-center font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
            Meet the Team
          </h2>
          <div className="gold-divider mx-auto mt-4" />
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mx-auto h-32 w-32 rounded-full object-cover shadow-soft"
                    loading="lazy"
                    width={128}
                    height={128}
                  />
                  <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-gold-dark">{member.role}</p>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-charcoal/65">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
