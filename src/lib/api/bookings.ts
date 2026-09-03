// TODO(backend): Replace mock submission with a call to the Node.js API,
// e.g. POST /api/bookings and POST /api/enrollments
// which will insert into the Supabase tables `bookings` and `enrollments`.
// See docs/backend-handoff-notes.md for the suggested schema.
import type { BookingInput, ContactInput, EnrollmentInput } from '../types'

export async function submitBooking(
  _data: BookingInput,
): Promise<{ success: true; confirmationId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, confirmationId: `BK-${Date.now().toString(36).toUpperCase()}` }
}

export async function submitEnrollment(
  _data: EnrollmentInput,
): Promise<{ success: true; confirmationId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, confirmationId: `EN-${Date.now().toString(36).toUpperCase()}` }
}

export async function submitContactMessage(
  _data: ContactInput,
): Promise<{ success: true }> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { success: true }
}
