'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Download,
  Users,
  Settings,
  Receipt,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import type { User as UserType } from '@/types/auth'

interface SidebarProps {
  user: UserType
}

const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', href: '/courses', icon: BookOpen },
  { name: 'Templates', href: '/downloads', icon: Download },
  { name: 'Research Library', href: '/research', icon: FileText },
  { name: 'Community', href: '/community', icon: Users },
]

const secondaryNavigation = [
  { name: 'Profile Settings', href: '/profile', icon: Settings },
  { name: 'Billings & Invoices', href: '/billing', icon: Receipt },
  { name: 'Help & Support', href: '/support', icon: HelpCircle },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  // Mock progress - in production this would come from user data
  const courseProgress = 60

  return (
    <aside className="w-72 bg-white rounded-2xl m-4 flex flex-col h-[calc(100vh-2rem)] shadow-sm">
      {/* User Profile */}
      <div className="p-6 flex flex-col items-center text-center">
        <div className="relative h-20 w-20 mb-3">
          <Image
            src="/avatar.png"
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-gray-900">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-1">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "text-[#E07A3A] font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-[#E07A3A]")} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Separator */}
        <div className="my-4 border-t border-gray-200" />

        {/* Secondary Navigation */}
        <ul className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "text-[#E07A3A] font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-[#E07A3A]")} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Progress Section */}
      <div className="p-4 mt-auto">
        <p className="text-sm font-medium text-gray-700 mb-3">Your Progress</p>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white">Course Progress</span>
            <span className="text-sm font-semibold text-white">{courseProgress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E07A3A] rounded-full transition-all"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
