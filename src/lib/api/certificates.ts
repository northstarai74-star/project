// TODO(backend): Replace mock lookup with a call to the Node.js API,
// e.g. GET /api/certificates/:referenceNumber
// which will query Supabase table `certificates`
// (columns: reference_number, student_name, course_title, issue_date, pdf_url).
// Certificates will be issued by an admin once a student completes their
// course — see docs/backend-handoff-notes.md for the full schema and flow.
import type { Certificate } from '../types'

const ACADEMY_NAME = 'Self Pampering Nail Art Academy'

const MOCK_CERTIFICATES: Certificate[] = [
  {
    referenceNumber: 'SP-2026-00123',
    studentName: 'Amara Okafor',
    courseTitle: 'Certified Professional Nail Artist',
    issueDate: '2026-02-14',
    academyName: ACADEMY_NAME,
  },
  {
    referenceNumber: 'SP-2025-00987',
    studentName: 'Priya Sharma',
    courseTitle: 'Certified Advanced Nail Artist',
    issueDate: '2025-11-02',
    academyName: ACADEMY_NAME,
  },
  {
    referenceNumber: 'SP-2025-00456',
    studentName: 'Lucia Moreno',
    courseTitle: 'Certified Nail Art Fundamentals',
    issueDate: '2025-06-20',
    academyName: ACADEMY_NAME,
  },
  {
    referenceNumber: 'SP-2024-00078',
    studentName: 'Grace Thompson',
    courseTitle: 'Certified Professional Nail Artist',
    issueDate: '2024-09-09',
    academyName: ACADEMY_NAME,
  },
]

export async function getCertificateByReference(
  referenceNumber: string,
): Promise<Certificate | null> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  const normalized = referenceNumber.trim().toUpperCase()
  return (
    MOCK_CERTIFICATES.find(
      (certificate) => certificate.referenceNumber.toUpperCase() === normalized,
    ) ?? null
  )
}
