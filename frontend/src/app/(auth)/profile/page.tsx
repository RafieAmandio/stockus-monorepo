import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getUser } from '@/lib/auth/dal'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/member/LogoutButton'
import { Button } from '@/components/ui/button'
import { SITE_NAME } from '@/lib/constants'
import {
  User,
  Mail,
  Calendar,
  Crown,
  Shield,
  KeyRound,
  Bell,
  CreditCard,
  LogOut,
  ChevronRight,
  Check,
  Camera,
} from 'lucide-react'

export const metadata: Metadata = {
  title: `Profile Settings - ${SITE_NAME}`,
  description: 'Manage your profile and account settings.',
}

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            {/* Avatar */}
            <div className="relative inline-block">
              <div className="relative h-24 w-24 mx-auto">
                <Image
                  src="/avatar.png"
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#E07A3A] rounded-full flex items-center justify-center text-white hover:bg-[#c96a2f] transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <h3 className="mt-4 font-semibold text-gray-900 text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>

            {/* Membership Badge */}
            <div className="mt-4">
              {user.tier === 'member' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E07A3A]/10 text-[#E07A3A] text-sm font-medium">
                  <Crown className="h-4 w-4" />
                  Premium Member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                  Free Account
                </span>
              )}
            </div>

            {/* Member Since */}
            <p className="mt-4 text-xs text-gray-400">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Upgrade Card (for free users) */}
          {user.tier === 'free' && (
            <div className="bg-gradient-to-br from-[#E07A3A] to-[#c96a2f] rounded-2xl p-6 shadow-sm mt-4 text-white">
              <Crown className="h-8 w-8 mb-3" />
              <h3 className="font-semibold text-lg">Upgrade to Premium</h3>
              <p className="text-sm text-white/80 mt-1 mb-4">
                Get full access to all courses, research reports, and templates
              </p>
              <Button asChild className="w-full bg-white text-[#E07A3A] hover:bg-gray-100">
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Settings */}
        <div className="col-span-2 space-y-4">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Full Name</p>
                    <p className="text-sm text-gray-500">{user.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-[#E07A3A] hover:text-[#c96a2f] hover:bg-[#E07A3A]/10">
                  Edit
                </Button>
              </div>

              <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Address</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <Check className="h-3 w-3" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">Manage your account security</p>
            </div>

            <div className="divide-y divide-gray-100">
              <Link href="/forgot-password" className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <KeyRound className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your password regularly</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Subscription</h2>
              <p className="text-sm text-gray-500">Manage your membership plan</p>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Crown className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Plan</p>
                    <p className="text-sm text-gray-500">
                      {user.tier === 'member' ? 'Premium Membership' : 'Free Plan'}
                    </p>
                  </div>
                </div>
                {user.tier === 'member' ? (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                ) : (
                  <Button size="sm" className="bg-[#E07A3A] hover:bg-[#c96a2f] text-white" asChild>
                    <Link href="/pricing">Upgrade</Link>
                  </Button>
                )}
              </div>

              <Link href="/billing" className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Billing History</p>
                    <p className="text-sm text-gray-500">View your invoices and payments</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Manage your notification preferences</p>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Bell className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates about new content</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E07A3A]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-red-600">Danger Zone</h2>
              <p className="text-sm text-gray-500">Irreversible account actions</p>
            </div>

            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sign Out</p>
                  <p className="text-sm text-gray-500">Sign out from your current session</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
