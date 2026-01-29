import Link from 'next/link'
import { getAdminMetrics } from '@/lib/api/admin-server'
import { MetricCard } from '@/components/admin/MetricCard'
import { Card } from '@/components/ui/card'

export default async function AdminDashboardPage() {
  const metrics = await getAdminMetrics()

  // Format revenue as IDR
  const formattedRevenue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(metrics.totalRevenue)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of key metrics
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Members"
          value={metrics.totalMembers}
          description="Users with member tier"
        />
        <MetricCard
          title="Total Revenue"
          value={formattedRevenue}
          description="Successful payments"
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics.activeSubscriptions}
          description="Currently active"
        />
        <MetricCard
          title="Recent Orders"
          value={metrics.recentOrders}
          description="Last 30 days"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/admin/courses/new" className="block text-sm text-primary hover:underline">
              + Create Course
            </Link>
            <Link href="/admin/research/new" className="block text-sm text-primary hover:underline">
              + Create Research Report
            </Link>
            <Link href="/admin/templates/new" className="block text-sm text-primary hover:underline">
              + Upload Template
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
