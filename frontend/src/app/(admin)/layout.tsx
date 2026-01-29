import { requireAdmin } from '@/lib/auth/admin'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
