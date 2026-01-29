import { Metadata } from 'next'
import Link from 'next/link'
import { getUser } from '@/lib/auth/dal'
import { fetchAPI } from '@/lib/api-client-server'
import { redirect } from 'next/navigation'
import { EmptyState } from '@/components/member/EmptyState'
import { CohortCard } from '@/components/member/CohortCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SITE_NAME } from '@/lib/constants'
import type { CohortWithSessions } from '@/types'
import { Calendar, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: `Jadwal Kohort - ${SITE_NAME}`,
  description: 'Lihat jadwal dan daftar kohort kursus.',
}

export default async function CohortsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  let cohorts: CohortWithSessions[] = []

  try {
    const data = await fetchAPI<{ cohorts: CohortWithSessions[] }>('/cohorts', {
      revalidate: 300,
    })
    cohorts = data.cohorts || []
  } catch {
    cohorts = []
  }

  // Group cohorts by status
  const openCohorts = cohorts.filter(c => c.status === 'open')
  const upcomingCohorts = cohorts.filter(c => c.status === 'upcoming')
  const pastCohorts = cohorts.filter(c => c.status === 'closed' || c.status === 'completed')

  if (cohorts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jadwal Kohort</h1>
          <p className="text-muted-foreground">Jadwal kelas dan sesi live</p>
        </div>
        <EmptyState
          icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
          title="Belum Ada Jadwal Kohort"
          description="Kohort baru akan segera dibuka. Pantau terus untuk update terbaru."
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jadwal Kohort</h1>
        <p className="text-muted-foreground">
          {user.tier === 'member'
            ? 'Daftar dan ikuti kelas live bersama instruktur'
            : 'Upgrade ke member untuk ikuti kelas live'}
        </p>
      </div>

      {/* Open Cohorts */}
      {openCohorts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pendaftaran Dibuka</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {openCohorts.map((cohort) => (
              <CohortCard key={cohort.id} cohort={cohort} userTier={user.tier} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Cohorts */}
      {upcomingCohorts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Segera Dibuka</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingCohorts.map((cohort) => (
              <CohortCard key={cohort.id} cohort={cohort} userTier={user.tier} />
            ))}
          </div>
        </section>
      )}

      {/* Past Cohorts */}
      {pastCohorts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-muted-foreground">Kohort Sebelumnya</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastCohorts.slice(0, 6).map((cohort) => (
              <CohortCard key={cohort.id} cohort={cohort} userTier={user.tier} />
            ))}
          </div>
        </section>
      )}

      {/* Upgrade CTA for Free Users */}
      {user.tier === 'free' && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Ikuti Kelas Live</CardTitle>
            <CardDescription>
              Upgrade ke member untuk mendaftar kohort dan belajar langsung bersama instruktur.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/pricing">
                Lihat Harga Membership
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
