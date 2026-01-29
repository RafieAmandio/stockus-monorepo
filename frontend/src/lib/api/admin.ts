import { clientFetchAPI } from '../api-client'

// Course types
export interface Course {
  id: number
  title: string
  slug: string
  description: string
  content: string
  thumbnailUrl: string | null
  status: string
  isFreePreview: boolean
  createdAt: string
  updatedAt: string
  sessions?: CourseSession[]
}

export interface CourseSession {
  id: number
  courseId: number
  title: string
  description: string | null
  sessionOrder: number
  durationMinutes: number | null
  videoUrl: string | null
}

export interface CourseFormData {
  title: string
  description?: string
  content?: string
  thumbnailUrl?: string | null
  isFreePreview?: boolean
}

// Course API functions
export async function getAdminCourses() {
  // Note: Use the regular /courses endpoint which already returns all courses for authenticated users
  // Admin middleware is only needed for POST/PATCH/DELETE
  const data = await clientFetchAPI<{ courses: Course[] }>('/courses')
  return data.courses
}

export async function getAdminCourse(id: number) {
  const data = await clientFetchAPI<{ course: Course }>(`/courses/${id}`)
  return data.course
}

export async function createCourse(data: CourseFormData) {
  return clientFetchAPI('/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateCourse(id: number, data: Partial<CourseFormData>) {
  return clientFetchAPI(`/courses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteCourse(id: number) {
  return clientFetchAPI(`/courses/${id}`, {
    method: 'DELETE',
  })
}
