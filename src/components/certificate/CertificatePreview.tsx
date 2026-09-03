import { forwardRef } from 'react'
import { Sparkles } from 'lucide-react'
import type { Certificate } from '../../lib/types'
import { formatDate } from '../../lib/utils'

interface CertificatePreviewProps {
  certificate: Certificate
}

export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ certificate }, ref) => {
    return (
      <div
        ref={ref}
        className="relative mx-auto aspect-[1.414/1] w-full max-w-3xl overflow-hidden rounded-2xl border-[3px] border-gold bg-cream p-3 shadow-soft"
      >
        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gold/60 px-6 py-8 text-center sm:px-12">
          <div className="absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-gold sm:h-14 sm:w-14" />
          <div className="absolute right-4 top-4 h-10 w-10 border-r-2 border-t-2 border-gold sm:h-14 sm:w-14" />
          <div className="absolute bottom-4 left-4 h-10 w-10 border-b-2 border-l-2 border-gold sm:h-14 sm:w-14" />
          <div className="absolute bottom-4 right-4 h-10 w-10 border-b-2 border-r-2 border-gold sm:h-14 sm:w-14" />

          <div className="flex items-center gap-2 text-gold-dark">
            <Sparkles size={20} />
            <span className="font-serif text-sm font-semibold uppercase tracking-[0.3em]">
              {certificate.academyName}
            </span>
            <Sparkles size={20} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-charcoal/50">
            Certificate of Completion
          </p>

          <p className="mt-6 text-sm text-charcoal/60">This certifies that</p>
          <h1 className="mt-2 font-serif text-3xl font-bold italic text-charcoal sm:text-5xl">
            {certificate.studentName}
          </h1>

          <p className="mt-6 max-w-md text-sm text-charcoal/70 sm:text-base">
            has successfully completed all requirements for
          </p>
          <p className="mt-1 font-serif text-xl font-semibold text-gold-dark sm:text-2xl">
            {certificate.courseTitle}
          </p>

          <div className="mt-10 grid w-full max-w-lg grid-cols-2 gap-8 border-t border-gold/40 pt-6 text-left sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/50">
                Reference No.
              </p>
              <p className="font-serif text-sm font-semibold text-charcoal">
                {certificate.referenceNumber}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/50">
                Date Issued
              </p>
              <p className="font-serif text-sm font-semibold text-charcoal">
                {formatDate(certificate.issueDate)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-charcoal/50">
                Authorized Signature
              </p>
              <p className="font-serif text-lg italic text-charcoal">S. Pampering</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
)
CertificatePreview.displayName = 'CertificatePreview'
