import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users, MapPin, Lock } from 'lucide-react'
import type { CohortWithSessions } from '@/types'

interface CohortCardProps {
  cohort: CohortWithSessions
  userTier: 'free' | 'member'
}

const statusConfig = {
  upcoming: { label: 'Segera Dibuka', variant: 'secondary' as const },
  open: { label: 'Pendaftaran Dibuka', variant: 'default' as const },
  closed: { label: 'Pendaftaran Ditutup', variant: 'outline' as const },
  completed: { label: 'Selesai', variant: 'outline' as const },
}

export function CohortCard({ cohort, userTier }: CohortCardProps) {
  const status = statusConfig[cohort.status] || statusConfig.upcoming
  const isPaid = cohort.price && cohort.price > 0
  const canEnroll = cohort.status === 'open' && userTier === 'member'
  const spotsLeft = cohort.maxParticipants
    ? cohort.maxParticipants - cohort.enrolledCount
    : null

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg">{cohort.name}</CardTitle>
            {cohort.course && (
              <CardDescription>{cohort.course.title}</CardDescription>
            )}
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Schedule Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
            </span>
          </div>

          {spotsLeft !== null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {spotsLeft > 0
                  ? `${spotsLeft} tempat tersisa`
                  : 'Kuota penuh'}
              </span>
            </div>
          )}

          {isPaid && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground">
                Rp {cohort.price?.toLocaleString('id-ID')}
              </span>
            </div>
          )}
        </div>

        {/* Sessions Preview */}
        {cohort.sessions && cohort.sessions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {cohort.sessions.length} Sesi:
            </p>
            <div className="space-y-1">
              {cohort.sessions
                .slice(0, 3)
                .sort((a, b) => a.sessionOrder - b.sessionOrder)
                .map((session) => (
                  <div
                    key={session.id}
                    className="text-xs text-muted-foreground flex items-center gap-2"
                  >
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDate(session.scheduledAt)} {formatTime(session.scheduledAt)}
                    </span>
                    <span className="truncate">- {session.title}</span>
                  </div>
                ))}
              {cohort.sessions.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{cohort.sessions.length - 3} sesi lainnya
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {canEnroll ? (
          <Button className="w-full" asChild>
            <Link href={`/pricing`}>
              {isPaid ? 'Daftar & Bayar' : 'Daftar Sekarang'}
            </Link>
          </Button>
        ) : userTier === 'free' ? (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/pricing">
              <Lock className="h-4 w-4 mr-2" />
              Upgrade untuk Daftar
            </Link>
          </Button>
        ) : cohort.status === 'upcoming' ? (
          <Button variant="outline" className="w-full" disabled>
            <Clock className="h-4 w-4 mr-2" />
            Segera Dibuka
          </Button>
        ) : cohort.status === 'closed' || spotsLeft === 0 ? (
          <Button variant="outline" className="w-full" disabled>
            Pendaftaran Ditutup
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Selesai
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
