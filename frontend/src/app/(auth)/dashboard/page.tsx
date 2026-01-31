import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getUser } from '@/lib/auth/dal'
import { redirect } from 'next/navigation'
import { SITE_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  BarChart3,
  Users,
  FileSpreadsheet,
  Rocket,
  Calendar,
} from 'lucide-react'

export const metadata: Metadata = {
  title: `Dashboard - ${SITE_NAME}`,
  description: 'Kelola akun dan akses materi pembelajaran Anda.',
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const firstName = user.name.split(' ')[0]

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 italic">
            Welcome back, {firstName}! <span className="not-italic">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your next live session starts on January 15, 2025 at 7:00 PM WIB
          </p>
        </div>
        <Button className="bg-[#E07A3A] hover:bg-[#c96a2f] text-white px-6">
          Join Upcoming Session
        </Button>
      </div>

      {/* Quick Action */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Action</h2>
        <div className="grid grid-cols-4 gap-4">
          <Link href="/courses" className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-shadow shadow-sm">
            <div className="flex justify-center mb-3">
              <BookOpen className="h-10 w-10 text-gray-700" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Continue Learning</h3>
            <p className="text-xs text-gray-500 mt-1">Resume from Day 3</p>
          </Link>

          <Link href="/research" className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-shadow shadow-sm">
            <div className="flex justify-center mb-3">
              <BarChart3 className="h-10 w-10 text-gray-700" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Browse Research</h3>
            <p className="text-xs text-gray-500 mt-1">12 new reports</p>
          </Link>

          <Link href="/community" className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-shadow shadow-sm">
            <div className="flex justify-center mb-3">
              <Users className="h-10 w-10 text-gray-700" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Join Community</h3>
            <p className="text-xs text-gray-500 mt-1">Active discussions</p>
          </Link>

          <Link href="/downloads" className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-shadow shadow-sm">
            <div className="flex justify-center mb-3">
              <FileSpreadsheet className="h-10 w-10 text-gray-700" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Templates</h3>
            <p className="text-xs text-gray-500 mt-1">Download tools</p>
          </Link>
        </div>
      </div>

      {/* My Courses */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex gap-4">
            <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src="/community.webp"
                alt="Course thumbnail"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">5-Day Fundamentals of Global Stock Investing</h3>
              <p className="text-sm text-gray-500 mt-2">Course Progress: 60% Complete (Day 3 of 5)</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden max-w-md">
                <div className="h-full bg-[#E07A3A] rounded-full" style={{ width: '60%' }} />
              </div>
              <p className="text-sm text-gray-500 mt-2">Next Session: January 15, 2026 - 7:00 PM WIB</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button className="bg-[#E07A3A] hover:bg-[#c96a2f] text-white">
                Continue Course
              </Button>
              <Button variant="outline" className="border-gray-300">
                View Material
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Downloads */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Downloads</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">Investment Checklist Template.xlsx</h4>
              <p className="text-xs text-gray-500">Downloaded 2 days ago</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">Tech Sector Analysis.pdf</h4>
              <p className="text-xs text-gray-500">Downloaded 2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* What's New */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s New?</h2>
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Rocket className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">New Content Available!</h4>
              <p className="text-sm text-gray-500">12 items resources has been added to your library!</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Upcoming Event</h4>
              <p className="text-sm text-gray-500">Guest speakers session with Portfolio Manager from Global Fund - 20 January 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
