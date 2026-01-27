export interface Course {
  id: number
  title: string
  slug: string
  description: string
  thumbnailUrl: string | null
  isFreePreview: boolean
  createdAt: string
}

export interface ResearchReport {
  id: number
  title: string
  slug: string
  summary: string
  requiredTier: 'free' | 'member'
  publishedAt: string | null
}

export interface Cohort {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  price: number
  maxParticipants: number
  enrolledCount: number
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  imageUrl: string
}
