import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Lock, Play } from 'lucide-react'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
  userTier: 'free' | 'member'
}

export function CourseCard({ course, userTier }: CourseCardProps) {
  const canAccess = userTier === 'member' || course.isFreePreview

  return (
    <Link href={canAccess ? `/courses/${course.slug}` : '/pricing'}>
      <Card className="h-full hover:bg-muted/50 transition-colors">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="object-cover w-full h-full rounded-t-lg"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {!canAccess && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            {course.isFreePreview && (
              <Badge variant="secondary">Preview</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            {canAccess ? (
              <>
                <Play className="h-4 w-4 mr-1" />
                Mulai Belajar
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-1" />
                Member Only
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
