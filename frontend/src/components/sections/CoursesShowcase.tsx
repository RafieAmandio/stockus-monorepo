import { CourseCard } from '@/components/shared/CourseCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CoursesShowcaseProps {
  courses: Course[]
}

export function CoursesShowcase({ courses }: CoursesShowcaseProps) {
  if (courses.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured Courses
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Learn from structured, cohort-based courses designed for serious
              investors.
            </p>
          </div>
          <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-16 px-4">
            <BookOpen className="h-12 w-12 text-slate-400" />
            <p className="mt-4 text-lg font-medium text-slate-700">
              New courses coming soon
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Check back later for exciting learning opportunities
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Featured Courses
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Learn from structured, cohort-based courses designed for serious
            investors.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {courses.length > 6 && (
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/courses">
                View All Courses
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
