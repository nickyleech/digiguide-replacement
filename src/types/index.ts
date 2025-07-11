export interface Programme {
  id: string
  title: string
  description: string
  genre: string
  startTime: string
  endTime: string
  channelId: string
  channel: string
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
  subscriptionTier: 'free' | 'premium' | 'corporate'
  platformPreference: string
  corporateAccountId?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  channels: {
    order: string[]
    hidden: string[]
    favourites: string[]
  }
  viewing: {
    timeFormat: '12' | '24'
    theme: 'light' | 'dark' | 'auto'
    gridLayout: 'compact' | 'comfortable' | 'spacious'
    autoRefresh: boolean
    showNowPlaying: boolean
  }
  notifications: {
    email: boolean
    push: boolean
    advanceTime: number
    suggestions: boolean
  }
  parental: {
    enabled: boolean
    pin: string
    allowedRatings: string[]
    restrictedGenres: string[]
  }
  locale: {
    language: string
    region: string
    timezone: string
  }
  privacy: {
    dataCollection: boolean
    personalisation: boolean
    thirdPartySharing: boolean
    marketingEmails: boolean
  }
  quickActions: {
    showWatchlist: boolean
    showReminders: boolean
    showSearch: boolean
    showChannelGuide: boolean
  }
}

export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: Permission[]
  createdAt: string
  lastLoginAt: string
  isActive: boolean
}

export interface CorporateAccount {
  id: string
  companyName: string
  accountType: 'corporate'
  maxUsers: number
  currentUsers: number
  adminUserId: string
  billingContact: string
  subscriptionTier: 'corporate_basic' | 'corporate_premium' | 'enterprise'
  features: string[]
  status: 'active' | 'suspended' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CorporateUser {
  id: string
  email: string
  corporateAccountId: string
  role: 'corp_admin' | 'corp_user' | 'corp_manager'
  permissions: string[]
  isActive: boolean
  createdAt: string
  lastLoginAt: string
}

export interface Permission {
  id: string
  name: string
  description: string
  category: 'users' | 'channels' | 'platforms' | 'billing' | 'system' | 'corporate'
}

export interface Subscription {
  id: string
  userId: string
  corporateAccountId?: string
  planType: 'free' | 'premium' | 'corporate_basic' | 'corporate_premium' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired' | 'suspended'
  startDate: string
  endDate: string
  billingCycle: 'monthly' | 'yearly'
  amount: number
  currency: string
  paymentMethod: string
  autoRenew: boolean
}

export interface Payment {
  id: string
  subscriptionId: string
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentDate: string
  paymentMethod: string
  transactionId: string
  refundAmount?: number
  refundDate?: string
}

export interface AdminAuditLog {
  id: string
  adminUserId: string
  action: string
  targetType: 'user' | 'channel' | 'platform' | 'subscription' | 'payment'
  targetId: string
  changes: Record<string, any>
  timestamp: string
  ipAddress: string
}

export interface ChannelApiMapping {
  id: string
  channelId: string
  externalApiId: string
  apiProvider: string
  mappingType: 'epg' | 'logos' | 'metadata'
  isActive: boolean
  lastSyncDate: string
}

export interface OfferCode {
  id: string
  code: string
  name: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minAmount?: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
  usageLimit?: number
  usedCount: number
  applicablePlans: ('basic' | 'premium')[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface OfferCodeUsage {
  id: string
  offerCodeId: string
  userId: string
  subscriptionId: string
  discountAmount: number
  usedAt: string
}