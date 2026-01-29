import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, Download, Calendar, ArrowRight } from 'lucide-react'

interface QuickActionsProps {
  tier: 'free' | 'member'
}

export function QuickActions({ tier }: QuickActionsProps) {
  const actions = [
    {
      title: 'Mulai Belajar',
      description: 'Akses kursus dan materi pembelajaran',
      href: '/courses',
      icon: BookOpen,
    },
    {
      title: 'Baca Riset',
      description: 'Laporan analisis saham terbaru',
      href: '/research',
      icon: FileText,
    },
    {
      title: 'Download Template',
      description: 'Template investasi dan checklist',
      href: '/downloads',
      icon: Download,
    },
    {
      title: 'Lihat Jadwal',
      description: 'Jadwal kohort dan sesi live',
      href: '/cohorts',
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Aksi Cepat</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <Card key={action.title} className="hover:bg-muted/50 transition-colors">
            <Link href={action.href}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription className="text-xs">{action.description}</CardDescription>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>

      {tier === 'free' && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Upgrade ke Member</CardTitle>
            <CardDescription>
              Dapatkan akses penuh ke semua kursus, riset, template, dan komunitas premium.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/pricing">Lihat Harga</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
