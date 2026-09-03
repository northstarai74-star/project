import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2 } from 'lucide-react'
import { getServices } from '../lib/api/services'
import { submitBooking } from '../lib/api/bookings'
import type { Service } from '../lib/types'
import { PageHeader } from '../components/ui/PageHeader'
import { Input, Select, Textarea } from '../components/ui/Field'
import { Button } from '../components/ui/Button'

const bookingSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  serviceId: z.string().min(1, 'Please select a service'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingSchema>

export function Booking() {
  const [searchParams] = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [confirmationId, setConfirmationId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { serviceId: searchParams.get('service') ?? '' },
  })

  useEffect(() => {
    document.title = 'Book an Appointment | Self Pampering'
    getServices().then(setServices)
  }, [])

  async function onSubmit(data: BookingFormValues) {
    const result = await submitBooking(data)
    setConfirmationId(result.confirmationId)
  }

  if (confirmationId) {
    return (
      <section className="container-app flex flex-col items-center gap-4 py-24 text-center">
        <CheckCircle2 className="text-green-600" size={48} />
        <h1 className="font-serif text-3xl font-semibold text-charcoal">Booking Requested!</h1>
        <p className="max-w-md text-charcoal/70">
          Thank you — we've received your request. Your confirmation reference is{' '}
          <span className="font-mono font-semibold text-gold-dark">{confirmationId}</span>. Our
          team will reach out shortly to confirm your appointment.
        </p>
      </section>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Reserve Your Spot"
        title="Book an Appointment"
        description="Tell us a little about what you're looking for and we'll confirm your appointment."
      />

      <section className="container-app py-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex max-w-xl flex-col gap-5 rounded-2xl bg-white p-8 shadow-soft"
          noValidate
        >
          <Input id="name" label="Full Name" {...register('name')} error={errors.name?.message} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input id="phone" label="Phone Number" type="tel" {...register('phone')} error={errors.phone?.message} />
            <Input id="email" label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
          </div>
          <Select id="serviceId" label="Service" {...register('serviceId')} error={errors.serviceId?.message}>
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — ${service.price}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input id="date" label="Preferred Date" type="date" {...register('date')} error={errors.date?.message} />
            <Input id="time" label="Preferred Time" type="time" {...register('time')} error={errors.time?.message} />
          </div>
          <Textarea id="notes" label="Notes (optional)" placeholder="Any special requests or design ideas?" {...register('notes')} error={errors.notes?.message} />

          <Button type="submit" disabled={isSubmitting} size="lg" className="mt-2">
            {isSubmitting ? 'Submitting…' : 'Request Appointment'}
          </Button>
        </form>
      </section>
    </>
  )
}
