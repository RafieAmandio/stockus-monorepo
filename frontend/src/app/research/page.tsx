import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ResearchCard } from '@/components/shared/ResearchCard'
import { fetchAPI } from '@/lib/api'
import { ResearchReport } from '@/types'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Research Reports',
  description: 'In-depth analysis and research reports on global equity markets. Access exclusive investment insights, stock recommendations, and market outlook.',
  openGraph: {
    title: 'Research Reports - StockUs',
    description: 'In-depth analysis and research reports on global equity markets. Access exclusive investment insights, stock recommendations, and market outlook.',
  },
}

interface ResearchResponse {
  reports: ResearchReport[]
}

async function getResearchReports(): Promise<ResearchReport[]> {
  try {
    const data = await fetchAPI<ResearchResponse>('/research', {
      revalidate: 300, // Cache for 5 minutes
    })
    return data.reports
  } catch (error) {
    console.error('Failed to fetch research reports:', error)
    return []
  }
}

export default async function ResearchPage() {
  const reports = await getResearchReports()
  const freeReports = reports.filter((r) => r.requiredTier === 'free')
  const memberReports = reports.filter((r) => r.requiredTier === 'member')

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Research Reports</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          In-depth analysis dari tim {SITE_NAME} untuk membantu keputusan investasi Anda
        </p>
      </div>

      {/* Reports Sections */}
      {reports.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Reports Available</CardTitle>
            <CardDescription>
              Research reports will appear here once published. Check back soon!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {/* Free Preview Reports */}
          {freeReports.length > 0 && (
            <div className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Free Preview Reports</h2>
                <p className="text-muted-foreground">
                  Sample research tersedia untuk semua pengguna
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeReports.map((report) => (
                  <ResearchCard key={report.id} report={report} />
                ))}
              </div>
            </div>
          )}

          {/* Member-Only Reports */}
          {memberReports.length > 0 && (
            <div className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Member-Only Reports</h2>
                <p className="text-muted-foreground">
                  Research eksklusif untuk StockUs members
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberReports.map((report) => (
                  <ResearchCard key={report.id} report={report} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Separator className="my-12" />

      {/* CTA Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Ingin Akses Semua Research Reports?
        </h2>
        <p className="text-muted-foreground mb-6">
          Bergabung sebagai member untuk mendapatkan akses penuh ke semua research reports,
          market analysis, dan stock recommendations kami
        </p>
        <Button asChild size="lg">
          <Link href="/pricing">Lihat Harga Membership</Link>
        </Button>
      </div>
    </div>
  )
}
