'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Dynamic import to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface VideoPlayerProps {
  videoUrl: string  // Expected format: "/videos/123" or just "123"
  title?: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

/**
 * Extract video ID from videoUrl string
 * Supports formats: "/videos/123", "videos/123", "123"
 * Returns null if format is invalid
 */
function extractVideoId(videoUrl: string): number | null {
  if (!videoUrl || typeof videoUrl !== 'string') return null

  // Try to extract ID from path format (/videos/123 or videos/123)
  const pathMatch = videoUrl.match(/(?:\/)?videos\/(\d+)/)
  if (pathMatch) return parseInt(pathMatch[1], 10)

  // Try direct number string
  const numMatch = videoUrl.match(/^(\d+)$/)
  if (numMatch) return parseInt(numMatch[1], 10)

  return null
}

export function VideoPlayer({ videoUrl, title, onProgress, onComplete }: VideoPlayerProps) {
  const videoId = extractVideoId(videoUrl)

  // Validate videoUrl format
  if (!videoId) {
    return (
      <div className="aspect-video bg-muted flex flex-col items-center justify-center rounded-lg gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Format video tidak valid</p>
      </div>
    )
  }
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const fetchPlaybackUrl = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/videos/${videoId}/playback`, {
        credentials: 'include',
      })

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Anda tidak memiliki akses ke video ini')
        }
        throw new Error('Gagal memuat video')
      }

      const data = await res.json()
      setPlaybackUrl(data.playbackUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat video')
    } finally {
      setLoading(false)
    }
  }, [videoId])

  useEffect(() => {
    setIsClient(true)
    fetchPlaybackUrl()

    // Refresh URL every 50 minutes (before 1-hour expiry)
    const refreshInterval = setInterval(fetchPlaybackUrl, 50 * 60 * 1000)
    return () => clearInterval(refreshInterval)
  }, [fetchPlaybackUrl])

  if (!isClient || loading) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-video bg-muted flex flex-col items-center justify-center rounded-lg gap-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchPlaybackUrl}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  if (!playbackUrl) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
        <p className="text-sm text-muted-foreground">Video tidak tersedia</p>
      </div>
    )
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        url={playbackUrl}
        controls
        width="100%"
        height="100%"
        onProgress={(state: any) => onProgress?.(Math.round(state.played * 100))}
        onEnded={() => onComplete?.()}
      />
      {title && (
        <p className="sr-only">{title}</p>
      )}
    </div>
  )
}
