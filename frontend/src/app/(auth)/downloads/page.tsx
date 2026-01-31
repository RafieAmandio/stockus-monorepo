import { Metadata } from 'next'
import Link from 'next/link'
import { getUser } from '@/lib/auth/dal'
import { fetchAPI } from '@/lib/api-client-server'
import { redirect } from 'next/navigation'
import { EmptyState } from '@/components/member/EmptyState'
import { DownloadButton } from '@/components/member/DownloadButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SITE_NAME } from '@/lib/constants'
import type { Template } from '@/types'
import { Download, Lock, FileSpreadsheet, FileText, ArrowRight, History } from 'lucide-react'
import { DownloadHistorySection } from './DownloadHistorySection'

export const metadata: Metadata = {
  title: `Download - ${SITE_NAME}`,
  description: 'Download template investasi dan tools analisis.',
}

function getFileIcon(filename: string | null | undefined) {
  if (!filename) return FileText
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
    return FileSpreadsheet
  }
  return FileText
}

function getFileExtension(url: string | null | undefined): string {
  if (!url) return 'FILE'
  try {
    const urlPath = new URL(url, 'http://localhost').pathname
    const filename = urlPath.split('/').pop() || ''
    const ext = filename.split('.').pop()
    return ext ? ext.toUpperCase() : 'FILE'
  } catch {
    const filename = url.split('/').pop() || ''
    const ext = filename.split('.').pop()
    return ext ? ext.toUpperCase() : 'FILE'
  }
}

export default async function DownloadsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  let templates: Template[] = []

  try {
    const data = await fetchAPI<{ templates: Template[] }>('/templates', {
      revalidate: 300,
    })
    templates = data.templates || []
  } catch {
    templates = []
  }

  // Filter templates based on user tier
  const accessibleTemplates = templates.filter(
    t => user.tier === 'member' || t.isFreePreview
  )
  const lockedTemplates = templates.filter(
    t => user.tier === 'free' && !t.isFreePreview
  )

  if (templates.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Download</h1>
          <p className="text-muted-foreground">Template dan tools investasi</p>
        </div>
        <EmptyState
          icon={<Download className="h-12 w-12 text-muted-foreground" />}
          title="Belum Ada Template"
          description="Template investasi akan segera tersedia. Pantau terus untuk update terbaru."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Download</h1>
        <p className="text-muted-foreground">
          {user.tier === 'member'
            ? 'Download semua template dan tools investasi'
            : 'Upgrade untuk akses ke semua template'}
        </p>
      </div>

      {/* Accessible Templates */}
      {accessibleTemplates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {user.tier === 'member' ? 'Semua Template' : 'Template Gratis'}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {accessibleTemplates.map((template) => {
              const FileIcon = getFileIcon(template.fileUrl)
              const fileExt = getFileExtension(template.fileUrl)

              return (
                <Card key={template.id}>
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="p-2 rounded-md bg-muted">
                      <FileIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{template.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {fileExt}
                        </Badge>
                      </div>
                      {template.description && (
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DownloadButton
                      templateId={template.id}
                      templateTitle={template.title}
                      fileUrl={template.fileUrl}
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Locked Templates for Free Users */}
      {user.tier === 'free' && lockedTemplates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Template Member</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {lockedTemplates.map((template) => {
              const FileIcon = getFileIcon(template.fileUrl)
              const fileExt = getFileExtension(template.fileUrl)

              return (
                <Card key={template.id} className="opacity-75">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="p-2 rounded-md bg-muted">
                      <FileIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{template.title}</CardTitle>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {template.description && (
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <Lock className="h-4 w-4 mr-2" />
                      Member Only
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Upgrade CTA */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Akses Semua Template</CardTitle>
              <CardDescription>
                Upgrade ke member untuk download {lockedTemplates.length} template premium.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/pricing">
                  Lihat Harga
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Download History Section */}
      <DownloadHistorySection />
    </div>
  )
}
