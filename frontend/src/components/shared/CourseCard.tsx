import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl font-bold text-slate-300">
              {course.title.charAt(0)}
            </span>
          </div>
        )}
        {course.isFreePreview && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-green-600 text-white">
              Free Preview
            </Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-slate-600">
          {course.description}
        </p>
      </CardContent>
      <CardContent className="pt-0">
        <Button variant="ghost" className="w-full group-hover:bg-accent" asChild>
          <Link href={`/courses/${course.slug}`}>
            Learn More
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
