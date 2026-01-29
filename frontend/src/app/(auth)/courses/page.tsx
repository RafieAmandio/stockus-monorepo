import { Metadata } from 'next'
import { getUser } from '@/lib/auth/dal'
import { fetchAPI } from '@/lib/api-client'
import { redirect } from 'next/navigation'
import { CourseCard } from '@/components/member/CourseCard'
import { EmptyState } from '@/components/member/EmptyState'
import { SITE_NAME } from '@/lib/constants'
import type { Course } from '@/types'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: `Kursus - ${SITE_NAME}`,
  description: 'Akses semua kursus investasi dan materi pembelajaran.',
}

export default async function CoursesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  let courses: Course[] = []

  try {
    const data = await fetchAPI<{ courses: Course[] }>('/courses', {
      revalidate: 300,
    })
    courses = data.courses || []
  } catch {
    courses = []
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kursus</h1>
          <p className="text-muted-foreground">Materi pembelajaran investasi</p>
        </div>
        <EmptyState
          icon={<BookOpen className="h-12 w-12 text-muted-foreground" />}
          title="Belum Ada Kursus"
          description="Kursus akan segera tersedia. Pantau terus untuk update terbaru."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kursus</h1>
        <p className="text-muted-foreground">
          {user.tier === 'member'
            ? 'Akses semua kursus dan materi pembelajaran'
            : 'Upgrade ke member untuk akses penuh'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} userTier={user.tier} />
        ))}
      </div>
    </div>
  )
}
