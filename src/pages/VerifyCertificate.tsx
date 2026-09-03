import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Search, XCircle, Download, Loader2 } from 'lucide-react'
import { getCertificateByReference } from '../lib/api/certificates'
import type { Certificate } from '../lib/types'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { CertificatePreview } from '../components/certificate/CertificatePreview'
import { downloadElementAsPdf } from '../lib/pdf'

type Status = 'idle' | 'loading' | 'found' | 'not-found'

export function VerifyCertificate() {
  const [reference, setReference] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [downloading, setDownloading] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Verify Certificate | Self Pampering'
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!reference.trim()) return
    setStatus('loading')
    try {
      const result = await getCertificateByReference(reference)
      if (result) {
        setCertificate(result)
        setStatus('found')
      } else {
        setCertificate(null)
        setStatus('not-found')
      }
    } catch {
      setCertificate(null)
      setStatus('not-found')
    }
  }

  async function handleDownload() {
    if (!certRef.current) return
    setDownloading(true)
    try {
      await downloadElementAsPdf(
        certRef.current,
        `${certificate?.referenceNumber ?? 'certificate'}.pdf`,
      )
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Certificate Verification"
        title="Verify a Certificate"
        description="Enter a Self Pampering certificate reference number to confirm authenticity and download an official copy."
      />

      <section className="container-app py-16">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row"
          aria-label="Certificate verification form"
        >
          <label htmlFor="ref-number" className="sr-only">
            Certificate reference number
          </label>
          <input
            id="ref-number"
            type="text"
            required
            placeholder="e.g. SP-2026-00123"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="focus-ring w-full rounded-full border border-blush-light bg-white px-5 py-3 font-mono text-charcoal placeholder:text-charcoal/40"
          />
          <Button type="submit" disabled={status === 'loading'} className="shrink-0">
            {status === 'loading' ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Search size={18} />
            )}
            Verify
          </Button>
        </form>
        <p className="mx-auto mt-3 max-w-xl text-center text-xs text-charcoal/50">
          Try a sample reference: SP-2026-00123, SP-2025-00987, SP-2025-00456, or SP-2024-00078
        </p>

        <div className="mt-12">
          {status === 'loading' && (
            <div className="mx-auto aspect-[1.414/1] w-full max-w-3xl animate-pulse rounded-2xl bg-blush-light/70" />
          )}

          {status === 'not-found' && (
            <div
              role="alert"
              className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
            >
              <XCircle className="text-red-500" size={40} />
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Certificate not found
              </h2>
              <p className="text-charcoal/70">
                Please check the reference number and try again.
              </p>
            </div>
          )}

          {status === 'found' && certificate && (
            <div className="flex flex-col items-center gap-8">
              <CertificatePreview ref={certRef} certificate={certificate} />
              <Button onClick={handleDownload} disabled={downloading} size="lg">
                {downloading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Download size={18} />
                )}
                Download as PDF
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
