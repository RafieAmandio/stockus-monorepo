import { Metadata } from 'next'
import Link from 'next/link'
import { getUser } from '@/lib/auth/dal'
import { redirect } from 'next/navigation'
import { SITE_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { HelpCircle, MessageCircle, Mail, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: `Help & Support - ${SITE_NAME}`,
  description: 'Get help and support for your account.',
}

export default async function SupportPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 mt-1">Get assistance and find answers to your questions</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Documentation</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Browse our guides and tutorials</p>
          <Button variant="outline" className="w-full">View Docs</Button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <MessageCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Community</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Ask questions in our community</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/community">Join Community</Link>
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Email Support</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Contact our support team</p>
          <Button variant="outline" className="w-full" asChild>
            <a href="mailto:support@stockus.id">Send Email</a>
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <HelpCircle className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900">FAQ</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Find answers to common questions</p>
          <Button variant="outline" className="w-full">View FAQ</Button>
        </div>
      </div>
    </div>
  )
}
