import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function CertificateTeaser() {
  return (
    <section className="container-app py-20">
      <Reveal>
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-gold/40 bg-gradient-to-br from-blush-light to-cream p-10 text-center shadow-soft lg:flex-row lg:text-left">
          <ShieldCheck className="text-gold-dark" size={56} aria-hidden="true" />
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
              Verify a Nail Art Certificate
            </h2>
            <p className="mt-2 max-w-xl text-charcoal/70">
              Academy graduates receive a verifiable digital certificate. Employers and
              partners can confirm authenticity in seconds and download an official copy.
            </p>
          </div>
          <Link to="/verify-certificate">
            <Button size="lg">Verify Certificate</Button>
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
