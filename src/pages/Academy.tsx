import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { getCourses } from '../lib/api/courses'
import type { Course } from '../lib/types'
import { PageHeader } from '../components/ui/PageHeader'
import { Skeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { Badge } from '../components/ui/Badge'
import { ArtTile } from '../components/ui/ArtTile'

export function Academy() {
  const [courses, setCourses] = useState<Course[] | null>(null)

  useEffect(() => {
    document.title = 'Academy | Self Pampering'
    getCourses().then(setCourses)
  }, [])

  return (
    <>
      <PageHeader
        eyebrow="Self Pampering Academy"
        title="Nail Art Training Courses"
        description="Learn from certified trainers and graduate with a verifiable digital certificate."
      />

      <section className="container-app py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {!courses &&
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[420px] w-full" />)}
          {courses?.map((course, i) => (
            <Reveal key={course.id} delay={i * 0.1}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft">
                <ArtTile
                  seed={course.image}
                  label={course.title}
                  icon="shield"
                  radius="none"
                  className="h-44 w-full"
                />
                <div className="flex flex-1 flex-col p-6">
                  <Badge className="w-fit">{course.level}</Badge>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-charcoal">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm text-charcoal/60">
                    {course.durationWeeks} weeks · ${course.fee}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {course.curriculum.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-charcoal/70">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-dark" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                    <ShieldCheck size={14} /> Certificate: {course.certificateTitle}
                  </p>
                  <Link to={`/booking?course=${course.id}`} className="mt-5">
                    <Button className="w-full">Enroll Now</Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 rounded-2xl border border-gold/40 bg-gradient-to-br from-blush-light to-cream p-10 text-center shadow-soft">
          <ShieldCheck className="mx-auto text-gold-dark" size={40} />
          <h2 className="mt-4 font-serif text-2xl font-semibold text-charcoal">
            Every Graduate Receives a Verifiable Certificate
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-charcoal/70">
            Upon completion, students receive a unique certificate reference number.
            Employers, clients, and partners can verify authenticity anytime.
          </p>
          <Link to="/verify-certificate" className="mt-6 inline-block">
            <Button variant="outline">Verify a Certificate</Button>
          </Link>
        </Reveal>
      </section>
    </>
  )
}
