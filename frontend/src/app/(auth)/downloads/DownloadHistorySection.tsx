'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDownloadHistory, type DownloadRecord } from '@/lib/download-history'
import { History, FileText } from 'lucide-react'

export function DownloadHistorySection() {
  const [history, setHistory] = useState<DownloadRecord[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHistory(getDownloadHistory())
  }, [])

  // Don't render on server or if no history
  if (!mounted || history.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <History className="h-5 w-5" />
        Riwayat Download
      </h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {history.slice(0, 10).map((record, index) => (
              <div
                key={`${record.templateId}-${record.downloadedAt}-${index}`}
                className="flex items-center gap-3 text-sm"
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{record.templateTitle}</p>
                  <p className="text-xs text-muted-foreground">{record.filename}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(record.downloadedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
