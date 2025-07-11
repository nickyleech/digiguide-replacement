import { Programme, Channel } from '@/types'

// EPG Data Service for UK TV Guide
export class EPGService {
  private static instance: EPGService
  private baseURL = 'https://api.xmltv.co.uk/tv'
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes
  private cache = new Map<string, { data: any, timestamp: number }>()

  static getInstance(): EPGService {
    if (!EPGService.instance) {
      EPGService.instance = new EPGService()
    }
    return EPGService.instance
  }

  private async fetchWithCache(url: string): Promise<any> {
    const cached = this.cache.get(url)
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      this.cache.set(url, { data, timestamp: now })
      return data
    } catch (error) {
      console.error('EPG Service fetch error:', error)
      // Return mock data as fallback
      return this.getMockData(url)
    }
  }

  private getMockData(url: string): any {
    if (url.includes('channels')) {
      return this.getMockChannels()
    }
    return this.getMockProgrammes()
  }

  private getMockChannels(): Channel[] {
    return [
      {
        id: 'bbc-one',
        name: 'BBC One',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/BBC_One_logo_%282021%29.svg/120px-BBC_One_logo_%282021%29.svg.png',
        category: 'terrestrial',
        description: 'BBC One is the flagship television channel of the BBC',
        platforms: [
          { id: 'freeview-1', channelId: 'bbc-one', platformId: 'freeview', epgNumber: 1, displayOrder: 1, active: true },
          { id: 'sky-101', channelId: 'bbc-one', platformId: 'sky', epgNumber: 101, displayOrder: 1, active: true },
          { id: 'virgin-101', channelId: 'bbc-one', platformId: 'virgin', epgNumber: 101, displayOrder: 1, active: true },
          { id: 'freesat-101', channelId: 'bbc-one', platformId: 'freesat', epgNumber: 101, displayOrder: 1, active: true }
        ]
      },
      {
        id: 'bbc-two',
        name: 'BBC Two',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/BBC_Two_logo_%282021%29.svg/120px-BBC_Two_logo_%282021%29.svg.png',
        category: 'terrestrial',
        description: 'BBC Two is the second flagship television channel of the BBC',
        platforms: [
          { id: 'freeview-2', channelId: 'bbc-two', platformId: 'freeview', epgNumber: 2, displayOrder: 2, active: true },
          { id: 'sky-102', channelId: 'bbc-two', platformId: 'sky', epgNumber: 102, displayOrder: 2, active: true },
          { id: 'virgin-102', channelId: 'bbc-two', platformId: 'virgin', epgNumber: 102, displayOrder: 2, active: true },
          { id: 'freesat-102', channelId: 'bbc-two', platformId: 'freesat', epgNumber: 102, displayOrder: 2, active: true }
        ]
      },
      {
        id: 'itv1',
        name: 'ITV1',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/ITV1_logo.svg/120px-ITV1_logo.svg.png',
        category: 'terrestrial',
        description: 'ITV1 is the flagship television channel of ITV',
        platforms: [
          { id: 'freeview-3', channelId: 'itv1', platformId: 'freeview', epgNumber: 3, displayOrder: 3, active: true },
          { id: 'sky-103', channelId: 'itv1', platformId: 'sky', epgNumber: 103, displayOrder: 3, active: true },
          { id: 'virgin-103', channelId: 'itv1', platformId: 'virgin', epgNumber: 103, displayOrder: 3, active: true },
          { id: 'freesat-103', channelId: 'itv1', platformId: 'freesat', epgNumber: 103, displayOrder: 3, active: true }
        ]
      },
      {
        id: 'channel-4',
        name: 'Channel 4',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Channel_4_logo_2015.svg/120px-Channel_4_logo_2015.svg.png',
        category: 'terrestrial',
        description: 'Channel 4 is a British free-to-air television channel',
        platforms: [
          { id: 'freeview-4', channelId: 'channel-4', platformId: 'freeview', epgNumber: 4, displayOrder: 4, active: true },
          { id: 'sky-104', channelId: 'channel-4', platformId: 'sky', epgNumber: 104, displayOrder: 4, active: true },
          { id: 'virgin-104', channelId: 'channel-4', platformId: 'virgin', epgNumber: 104, displayOrder: 4, active: true },
          { id: 'freesat-104', channelId: 'channel-4', platformId: 'freesat', epgNumber: 104, displayOrder: 4, active: true }
        ]
      },
      {
        id: 'channel-5',
        name: 'Channel 5',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Channel_5_logo_2016.svg/120px-Channel_5_logo_2016.svg.png',
        category: 'terrestrial',
        description: 'Channel 5 is a British free-to-air television channel',
        platforms: [
          { id: 'freeview-5', channelId: 'channel-5', platformId: 'freeview', epgNumber: 5, displayOrder: 5, active: true },
          { id: 'sky-105', channelId: 'channel-5', platformId: 'sky', epgNumber: 105, displayOrder: 5, active: true },
          { id: 'virgin-105', channelId: 'channel-5', platformId: 'virgin', epgNumber: 105, displayOrder: 5, active: true },
          { id: 'freesat-105', channelId: 'channel-5', platformId: 'freesat', epgNumber: 105, displayOrder: 5, active: true }
        ]
      }
    ]
  }

  private getMockProgrammes(): Programme[] {
    const now = new Date()
    const programmes: Programme[] = []
    const channels = [
      { id: 'bbc-one', name: 'BBC One' },
      { id: 'bbc-two', name: 'BBC Two' },
      { id: 'itv1', name: 'ITV1' },
      { id: 'channel-4', name: 'Channel 4' },
      { id: 'channel-5', name: 'Channel 5' }
    ]
    
    const programmeTemplates = [
      { title: 'BBC News', description: 'The latest national and international news', genre: 'News', duration: 30 },
      { title: 'EastEnders', description: 'Drama series set in Albert Square', genre: 'Drama', duration: 30 },
      { title: 'The Great British Bake Off', description: 'Amateur bakers compete in the famous tent', genre: 'Reality', duration: 60 },
      { title: 'Coronation Street', description: 'Long-running soap opera set in Manchester', genre: 'Drama', duration: 30 },
      { title: 'The Chase', description: 'Quiz show with the Chasers', genre: 'Game Show', duration: 45 },
      { title: 'Emmerdale', description: 'Soap opera set in the Yorkshire Dales', genre: 'Drama', duration: 30 },
      { title: 'University Challenge', description: 'Quiz show for university students', genre: 'Quiz', duration: 30 },
      { title: 'Hollyoaks', description: 'Soap opera following the lives of young people', genre: 'Drama', duration: 30 },
      { title: 'Question Time', description: 'Political debate programme', genre: 'Politics', duration: 60 },
      { title: 'MasterChef', description: 'Cookery competition', genre: 'Reality', duration: 60 }
    ]

    channels.forEach(channel => {
      for (let hour = 6; hour < 24; hour++) {
        const startTime = new Date(now)
        startTime.setHours(hour, 0, 0, 0)
        
        const template = programmeTemplates[Math.floor(Math.random() * programmeTemplates.length)]
        const endTime = new Date(startTime.getTime() + template.duration * 60000)
        
        programmes.push({
          id: `${channel.id}-${hour}`,
          title: template.title,
          description: template.description,
          genre: template.genre,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          channelId: channel.id,
          channel: channel.name,
          duration: template.duration,
          rating: Math.random() > 0.5 ? 'PG' : 'U'
        })
      }
    })

    return programmes
  }

  async getChannels(platform: string): Promise<Channel[]> {
    const channels = await this.fetchWithCache(`${this.baseURL}/channels/${platform}`)
    return channels.filter((channel: Channel) => 
      channel.platforms.some(p => p.platformId === platform && p.active)
    )
  }

  async getProgrammes(channelId: string, date: Date): Promise<Programme[]> {
    const dateStr = date.toISOString().split('T')[0]
    const programmes = await this.fetchWithCache(`${this.baseURL}/programmes/${channelId}/${dateStr}`)
    return programmes.filter((programme: Programme) => programme.channelId === channelId)
  }

  async searchProgrammes(query: string, date: Date): Promise<Programme[]> {
    const dateStr = date.toISOString().split('T')[0]
    const programmes = await this.fetchWithCache(`${this.baseURL}/search/${query}/${dateStr}`)
    return programmes.filter((programme: Programme) => 
      programme.title.toLowerCase().includes(query.toLowerCase()) ||
      programme.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  async getCurrentProgrammes(platform: string): Promise<Programme[]> {
    const now = new Date()
    const channels = await this.getChannels(platform)
    const allProgrammes: Programme[] = []
    
    for (const channel of channels) {
      const programmes = await this.getProgrammes(channel.id, now)
      const currentProgramme = programmes.find(p => {
        const start = new Date(p.startTime)
        const end = new Date(p.endTime)
        return start <= now && end > now
      })
      if (currentProgramme) {
        allProgrammes.push(currentProgramme)
      }
    }
    
    return allProgrammes
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const epgService = EPGService.getInstance()