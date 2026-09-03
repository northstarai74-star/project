export interface Service {
  id: string
  category: 'Classic' | 'Gel & Extensions' | '3D Nail Art' | 'Bridal'
  name: string
  description: string
  price: number
  durationMinutes: number
  image: string
}

export interface GalleryImage {
  id: string
  category: 'Bridal' | '3D Art' | 'Seasonal' | 'Minimal'
  src: string
  alt: string
}

export interface Testimonial {
  id: string
  name: string
  quote: string
  rating: number
  avatar: string
}

export interface Course {
  id: string
  title: string
  level: 'Beginner' | 'Advanced' | 'Diploma'
  durationWeeks: number
  fee: number
  curriculum: string[]
  certificateTitle: string
  image: string
}

export interface Certificate {
  referenceNumber: string
  studentName: string
  courseTitle: string
  issueDate: string
  academyName: string
}

export interface BookingInput {
  name: string
  phone: string
  email: string
  serviceId: string
  date: string
  time: string
  notes?: string
}

export interface EnrollmentInput {
  name: string
  phone: string
  email: string
  courseId: string
  notes?: string
}

export interface ContactInput {
  name: string
  email: string
  message: string
}
