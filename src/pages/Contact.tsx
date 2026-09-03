import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MapPin, Clock3, MessageCircle, CheckCircle2 } from 'lucide-react'
import { submitContactMessage } from '../lib/api/bookings'
import { PageHeader } from '../components/ui/PageHeader'
import { Input, Textarea } from '../components/ui/Field'
import { Button } from '../components/ui/Button'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Please enter at least 10 characters'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function Contact() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  useEffect(() => {
    document.title = 'Contact | Self Pampering'
  }, [])

  async function onSubmit(data: ContactFormValues) {
    await submitContactMessage(data)
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Questions about services, courses, or your booking? We'd love to hear from you."
      />

      <section className="container-app grid grid-cols-1 gap-12 py-16 lg:grid-cols-2">
        <div>
          {sent ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center shadow-soft">
              <CheckCircle2 className="text-green-600" size={40} />
              <h2 className="font-serif text-xl font-semibold text-charcoal">Message Sent</h2>
              <p className="text-charcoal/70">Thanks for reaching out — we'll reply within one business day.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-soft"
              noValidate
            >
              <Input id="c-name" label="Name" {...register('name')} error={errors.name?.message} />
              <Input id="c-email" label="Email" type="email" {...register('email')} error={errors.email?.message} />
              <Textarea id="c-message" label="Message" {...register('message')} error={errors.message?.message} />
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-2xl border border-blush-light shadow-soft">
            <div
              role="img"
              aria-label="Map placeholder showing the Self Pampering studio location"
              className="flex h-56 w-full items-center justify-center bg-blush-light text-charcoal/50"
            >
              <MapPin size={32} />
              <span className="ml-2 text-sm">Map placeholder — embed Google Maps here</span>
            </div>
          </div>

          <ul className="space-y-4 text-charcoal/80">
            <li className="flex items-center gap-3">
              <MapPin className="text-gold-dark" size={20} /> 123 Rosewood Avenue, Suite 4, Lagos, Nigeria
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-gold-dark" size={20} />
              <a className="hover:text-gold-dark" href="tel:+10000000000">+1 (000) 000-0000</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-gold-dark" size={20} />
              <a className="hover:text-gold-dark" href="mailto:hello@selfpampering.example">hello@selfpampering.example</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="text-gold-dark" size={20} />
              <a className="hover:text-gold-dark" href="https://wa.me/10000000000" target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock3 className="text-gold-dark" size={20} /> Tue – Sun, 9:00 AM – 7:00 PM
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
