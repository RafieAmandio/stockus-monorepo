import { Metadata } from 'next'
import { getUser } from '@/lib/auth/dal'
import { redirect } from 'next/navigation'
import { SITE_NAME } from '@/lib/constants'
import { Receipt } from 'lucide-react'

export const metadata: Metadata = {
  title: `Billings & Invoices - ${SITE_NAME}`,
  description: 'View your billing history and invoices.',
}

export default async function BillingPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Billings & Invoices</h1>
        <p className="text-gray-500 mt-1">View your payment history and download invoices</p>
      </div>

      <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Receipt className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No billing history</h3>
        <p className="text-gray-500 mt-1">Your invoices and payment history will appear here</p>
      </div>
    </div>
  )
}
