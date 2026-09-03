import { useState, type FormEvent } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'

export function NewsletterCta() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    // TODO(backend): POST to /api/newsletter -> Supabase table `newsletter_subscribers`
    setSubmitted(true)
  }

  return (
    <section className="bg-blush py-16">
      <div className="container-app flex flex-col items-center gap-6 text-center">
        <Mail className="text-charcoal" size={32} aria-hidden="true" />
        <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
          Join Our Nail Art Circle
        </h2>
        <p className="max-w-md text-charcoal/70">
          Get first access to seasonal designs, academy enrollment dates, and exclusive
          studio offers.
        </p>

        {submitted ? (
          <p className="flex items-center gap-2 font-semibold text-charcoal">
            <CheckCircle2 className="text-green-700" size={20} /> Thanks — you're on the list!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring w-full rounded-full border border-charcoal/20 bg-white px-5 py-3 text-charcoal placeholder:text-charcoal/40"
            />
            <Button type="submit" className="shrink-0">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
