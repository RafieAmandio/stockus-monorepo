import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Calendar, Download, FileText } from 'lucide-react'

interface DashboardStatsProps {
  tier: 'free' | 'member'
}

export function DashboardStats({ tier }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Kursus Tersedia',
      value: tier === 'member' ? 'Akses Penuh' : 'Preview',
      description: tier === 'member' ? 'Semua materi kursus' : 'Konten terbatas',
      icon: BookOpen,
    },
    {
      title: 'Laporan Riset',
      value: tier === 'member' ? 'Akses Penuh' : '3 Laporan',
      description: tier === 'member' ? 'Semua laporan riset' : 'Laporan gratis saja',
      icon: FileText,
    },
    {
      title: 'Template',
      value: tier === 'member' ? 'Akses Penuh' : 'Terbatas',
      description: tier === 'member' ? 'Semua template investasi' : 'Template dasar',
      icon: Download,
    },
    {
      title: 'Jadwal Kohort',
      value: tier === 'member' ? 'Bisa Daftar' : 'Lihat Saja',
      description: tier === 'member' ? 'Daftar kelas live' : 'Perlu jadi member',
      icon: Calendar,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
