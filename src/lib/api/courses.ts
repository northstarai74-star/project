// TODO(backend): Replace mock data with a call to the Node.js API,
// e.g. GET /api/courses
// which will query Supabase table `courses`
// (columns: id, title, level, duration_weeks, fee, curriculum (jsonb),
// certificate_title, image_url).
import type { Course } from '../types'

const MOCK_COURSES: Course[] = [
  {
    id: 'course-beginner',
    title: 'Beginner Nail Art Foundations',
    level: 'Beginner',
    durationWeeks: 2,
    fee: 180,
    curriculum: [
      'Nail anatomy, hygiene, and sanitation',
      'Manicure & pedicure fundamentals',
      'Basic polish application and nail shaping',
      'Intro to simple hand-painted nail art',
    ],
    certificateTitle: 'Certified Nail Art Fundamentals',
    image: 'self-pampering-course-1',
  },
  {
    id: 'course-advanced',
    title: 'Advanced Gel & 3D Nail Art',
    level: 'Advanced',
    durationWeeks: 4,
    fee: 350,
    curriculum: [
      'Gel extensions and structural builds',
      '3D sculptural art & embellishment techniques',
      'Chrome, ombre, and mixed-media finishes',
      'Client consultation and portfolio building',
    ],
    certificateTitle: 'Certified Advanced Nail Artist',
    image: 'self-pampering-course-2',
  },
  {
    id: 'course-diploma',
    title: 'Diploma in Professional Nail Art',
    level: 'Diploma',
    durationWeeks: 10,
    fee: 850,
    curriculum: [
      'Full foundations through advanced technique mastery',
      'Bridal and editorial nail art specialization',
      'Salon hygiene, business setup, and client management',
      'Supervised live-client practicum',
      'Final assessment and portfolio review',
    ],
    certificateTitle: 'Certified Professional Nail Artist',
    image: 'self-pampering-course-3',
  },
]

export async function getCourses(): Promise<Course[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return MOCK_COURSES
}

export async function getCourseById(id: string): Promise<Course | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return MOCK_COURSES.find((course) => course.id === id) ?? null
}
