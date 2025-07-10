export interface Programme {
  id: string
  title: string
  description: string
  genre: string
  startTime: string
  endTime: string
  channelId: string
  episodeTitle?: string
  seasonNumber?: number
  episodeNumber?: number
  rating?: string
  duration: number
}

export interface Channel {
  id: string
  name: string
  logoUrl: string
  category: string
  description?: string
  platforms: ChannelPlatform[]
}

export interface Platform {
  id: string
  name: string
  type: 'sky' | 'freeview' | 'freesat' | 'virgin'
  description: string
  active: boolean
}

export interface ChannelPlatform {
  id: string
  channelId: string
  platformId: string
  epgNumber: number
  displayOrder: number
  active: boolean
}

export interface User {
  id: string
  email: string
  subscriptionTier: 'free' | 'premium'
  platformPreference: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  favouriteChannels: string[]
  favouriteGenres: string[]
  reminderSettings: {
    email: boolean
    push: boolean
    advanceTime: number
  }
}