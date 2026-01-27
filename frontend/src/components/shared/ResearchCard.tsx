import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ResearchReport } from '@/types'

interface ResearchCardProps {
  report: ResearchReport
}

export function ResearchCard({ report }: ResearchCardProps) {
  const isFree = report.requiredTier === 'free'
  const publishedDate = report.publishedAt
    ? new Date(report.publishedAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Draft'

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant={isFree ? 'outline' : 'default'}>
            {isFree ? 'Free Preview' : 'Member Only'}
          </Badge>
          {!isFree && <Lock className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>
        <CardTitle className="line-clamp-2">{report.title}</CardTitle>
        <CardDescription>{publishedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">{report.summary}</p>
      </CardContent>
      <CardFooter>
        {isFree ? (
          <Button asChild className="w-full">
            <Link href={`/research/${report.slug}`}>Read Report</Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="w-full">
            <Link href="/pricing">
              <Lock className="h-4 w-4 mr-2" />
              Unlock with Membership
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
