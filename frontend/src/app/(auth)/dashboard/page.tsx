import { Metadata } from 'next'
import { getUser } from '@/lib/auth/dal'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/member/DashboardStats'
import { QuickActions } from '@/components/member/QuickActions'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Dashboard - ${SITE_NAME}`,
  description: 'Kelola akun dan akses materi pembelajaran Anda.',
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Get time-based greeting
  const hour = new Date().getHours()
  let greeting = 'Selamat datang'
  if (hour < 12) {
    greeting = 'Selamat pagi'
  } else if (hour < 18) {
    greeting = 'Selamat siang'
  } else {
    greeting = 'Selamat malam'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          {user.tier === 'member'
            ? 'Selamat datang kembali. Lanjutkan perjalanan investasi Anda.'
            : 'Anda sedang menggunakan akun gratis. Upgrade untuk akses penuh.'}
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats tier={user.tier} />

      {/* Quick Actions */}
      <QuickActions tier={user.tier} />
    </div>
  )
}
