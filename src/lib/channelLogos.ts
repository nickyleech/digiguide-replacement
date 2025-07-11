// Channel Logo Service - Maps channel IDs to logo URLs
export interface ChannelLogo {
  id: string
  name: string
  logoUrl: string
  fallbackEmoji: string
}

export const channelLogos: Record<string, ChannelLogo> = {
  'bbc-one': {
    id: 'bbc-one',
    name: 'BBC One',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/BBC_One_logo_%282021%29.svg/120px-BBC_One_logo_%282021%29.svg.png',
    fallbackEmoji: '1️⃣'
  },
  'bbc-two': {
    id: 'bbc-two',
    name: 'BBC Two',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/BBC_Two_logo_%282021%29.svg/120px-BBC_Two_logo_%282021%29.svg.png',
    fallbackEmoji: '2️⃣'
  },
  'itv1': {
    id: 'itv1',
    name: 'ITV1',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/ITV1_logo.svg/120px-ITV1_logo.svg.png',
    fallbackEmoji: '📺'
  },
  'channel-4': {
    id: 'channel-4',
    name: 'Channel 4',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Channel_4_logo_2015.svg/120px-Channel_4_logo_2015.svg.png',
    fallbackEmoji: '4️⃣'
  },
  'channel-5': {
    id: 'channel-5',
    name: 'Channel 5',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Channel_5_logo_2016.svg/120px-Channel_5_logo_2016.svg.png',
    fallbackEmoji: '5️⃣'
  },
  'itv2': {
    id: 'itv2',
    name: 'ITV2',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/ITV2_logo.svg/120px-ITV2_logo.svg.png',
    fallbackEmoji: '📻'
  },
  'e4': {
    id: 'e4',
    name: 'E4',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/E4_logo.svg/120px-E4_logo.svg.png',
    fallbackEmoji: '🎬'
  },
  'more4': {
    id: 'more4',
    name: 'More4',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/More4_logo.svg/120px-More4_logo.svg.png',
    fallbackEmoji: '➕'
  },
  'film4': {
    id: 'film4',
    name: 'Film4',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Film4_logo.svg/120px-Film4_logo.svg.png',
    fallbackEmoji: '🎭'
  },
  'dave': {
    id: 'dave',
    name: 'Dave',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Dave_logo.svg/120px-Dave_logo.svg.png',
    fallbackEmoji: '😄'
  },
  'really': {
    id: 'really',
    name: 'Really',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Really_logo.svg/120px-Really_logo.svg.png',
    fallbackEmoji: '❓'
  },
  'yesterday': {
    id: 'yesterday',
    name: 'Yesterday',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Yesterday_logo.svg/120px-Yesterday_logo.svg.png',
    fallbackEmoji: '🕰️'
  },
  'sky-one': {
    id: 'sky-one',
    name: 'Sky One',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Sky_One_logo.svg/120px-Sky_One_logo.svg.png',
    fallbackEmoji: '🌌'
  },
  'sky-two': {
    id: 'sky-two',
    name: 'Sky Two',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sky_Two_logo.svg/120px-Sky_Two_logo.svg.png',
    fallbackEmoji: '🌠'
  },
  'sky-atlantic': {
    id: 'sky-atlantic',
    name: 'Sky Atlantic',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Sky_Atlantic_logo.svg/120px-Sky_Atlantic_logo.svg.png',
    fallbackEmoji: '🌊'
  },
  'sky-sports-main-event': {
    id: 'sky-sports-main-event',
    name: 'Sky Sports Main Event',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sky_Sports_Main_Event_logo.svg/120px-Sky_Sports_Main_Event_logo.svg.png',
    fallbackEmoji: '⚽'
  },
  'sky-sports-premier-league': {
    id: 'sky-sports-premier-league',
    name: 'Sky Sports Premier League',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Sky_Sports_Premier_League_logo.svg/120px-Sky_Sports_Premier_League_logo.svg.png',
    fallbackEmoji: '⚽'
  },
  'discovery': {
    id: 'discovery',
    name: 'Discovery Channel',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Discovery_Channel_logo.svg/120px-Discovery_Channel_logo.svg.png',
    fallbackEmoji: '🔬'
  },
  'national-geographic': {
    id: 'national-geographic',
    name: 'National Geographic',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeologo.svg/120px-Natgeologo.svg.png',
    fallbackEmoji: '🌍'
  },
  'history': {
    id: 'history',
    name: 'History Channel',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/History_Logo.svg/120px-History_Logo.svg.png',
    fallbackEmoji: '📚'
  }
}

export function getChannelLogo(channelId: string): ChannelLogo | null {
  return channelLogos[channelId] || null
}

export function getChannelLogoUrl(channelId: string): string | null {
  const logo = getChannelLogo(channelId)
  return logo ? logo.logoUrl : null
}

export function getChannelFallbackEmoji(channelId: string): string {
  const logo = getChannelLogo(channelId)
  return logo ? logo.fallbackEmoji : '📺'
}

export function getAllChannelLogos(): ChannelLogo[] {
  return Object.values(channelLogos)
}

// Channel Logo Component Helper
export interface ChannelLogoProps {
  channelId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showFallback?: boolean
}

export function getChannelLogoClasses(size: 'sm' | 'md' | 'lg' = 'md'): string {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return `${sizeClasses[size]} object-contain rounded-sm`
}