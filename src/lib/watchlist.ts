import { Programme } from '@/types'

export interface WatchlistItem {
  id: string
  userId: string
  programmeId: string
  title: string
  description: string
  channelId: string
  channelName: string
  startTime: string
  endTime: string
  genre: string
  addedAt: string
  reminderSet: boolean
  watched: boolean
}

export interface FavoriteChannel {
  id: string
  userId: string
  channelId: string
  channelName: string
  addedAt: string
}

export interface FavoriteGenre {
  id: string
  userId: string
  genre: string
  addedAt: string
}

// Mock watchlist service - in production this would connect to a real backend
export class WatchlistService {
  private static instance: WatchlistService
  private watchlist: WatchlistItem[] = []
  private favoriteChannels: FavoriteChannel[] = []
  private favoriteGenres: FavoriteGenre[] = []

  static getInstance(): WatchlistService {
    if (!WatchlistService.instance) {
      WatchlistService.instance = new WatchlistService()
    }
    return WatchlistService.instance
  }

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const storedWatchlist = localStorage.getItem('digiguide_watchlist')
      const storedChannels = localStorage.getItem('digiguide_favorite_channels')
      const storedGenres = localStorage.getItem('digiguide_favorite_genres')
      
      if (storedWatchlist) {
        this.watchlist = JSON.parse(storedWatchlist)
      }
      if (storedChannels) {
        this.favoriteChannels = JSON.parse(storedChannels)
      }
      if (storedGenres) {
        this.favoriteGenres = JSON.parse(storedGenres)
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('digiguide_watchlist', JSON.stringify(this.watchlist))
      localStorage.setItem('digiguide_favorite_channels', JSON.stringify(this.favoriteChannels))
      localStorage.setItem('digiguide_favorite_genres', JSON.stringify(this.favoriteGenres))
    }
  }

  // Watchlist methods
  async addToWatchlist(userId: string, programme: Programme, channelName: string): Promise<boolean> {
    try {
      const existingItem = this.watchlist.find(
        item => item.userId === userId && item.programmeId === programme.id
      )
      
      if (existingItem) {
        return false // Already in watchlist
      }

      const watchlistItem: WatchlistItem = {
        id: `watchlist-${Date.now()}`,
        userId,
        programmeId: programme.id,
        title: programme.title,
        description: programme.description,
        channelId: programme.channelId,
        channelName,
        startTime: programme.startTime,
        endTime: programme.endTime,
        genre: programme.genre,
        addedAt: new Date().toISOString(),
        reminderSet: false,
        watched: false
      }

      this.watchlist.push(watchlistItem)
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      return false
    }
  }

  async removeFromWatchlist(userId: string, programmeId: string): Promise<boolean> {
    try {
      const index = this.watchlist.findIndex(
        item => item.userId === userId && item.programmeId === programmeId
      )
      
      if (index === -1) {
        return false
      }

      this.watchlist.splice(index, 1)
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      return false
    }
  }

  async getWatchlist(userId: string): Promise<WatchlistItem[]> {
    return this.watchlist.filter(item => item.userId === userId)
  }

  async updateWatchlistItem(userId: string, programmeId: string, updates: Partial<WatchlistItem>): Promise<boolean> {
    try {
      const index = this.watchlist.findIndex(
        item => item.userId === userId && item.programmeId === programmeId
      )
      
      if (index === -1) {
        return false
      }

      this.watchlist[index] = { ...this.watchlist[index], ...updates }
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error updating watchlist item:', error)
      return false
    }
  }

  isInWatchlist(userId: string, programmeId: string): boolean {
    return this.watchlist.some(
      item => item.userId === userId && item.programmeId === programmeId
    )
  }

  // Favorite channels methods
  async addFavoriteChannel(userId: string, channelId: string, channelName: string): Promise<boolean> {
    try {
      const existingChannel = this.favoriteChannels.find(
        channel => channel.userId === userId && channel.channelId === channelId
      )
      
      if (existingChannel) {
        return false // Already in favorites
      }

      const favoriteChannel: FavoriteChannel = {
        id: `favorite-channel-${Date.now()}`,
        userId,
        channelId,
        channelName,
        addedAt: new Date().toISOString()
      }

      this.favoriteChannels.push(favoriteChannel)
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error adding favorite channel:', error)
      return false
    }
  }

  async removeFavoriteChannel(userId: string, channelId: string): Promise<boolean> {
    try {
      const index = this.favoriteChannels.findIndex(
        channel => channel.userId === userId && channel.channelId === channelId
      )
      
      if (index === -1) {
        return false
      }

      this.favoriteChannels.splice(index, 1)
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error removing favorite channel:', error)
      return false
    }
  }

  async getFavoriteChannels(userId: string): Promise<FavoriteChannel[]> {
    return this.favoriteChannels.filter(channel => channel.userId === userId)
  }

  isFavoriteChannel(userId: string, channelId: string): boolean {
    return this.favoriteChannels.some(
      channel => channel.userId === userId && channel.channelId === channelId
    )
  }

  // Favorite genres methods
  async addFavoriteGenre(userId: string, genre: string): Promise<boolean> {
    try {
      const existingGenre = this.favoriteGenres.find(
        g => g.userId === userId && g.genre === genre
      )
      
      if (existingGenre) {
        return false // Already in favorites
      }

      const favoriteGenre: FavoriteGenre = {
        id: `favorite-genre-${Date.now()}`,
        userId,
        genre,
        addedAt: new Date().toISOString()
      }

      this.favoriteGenres.push(favoriteGenre)
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error adding favorite genre:', error)
      return false
    }
  }

  async removeFavoriteGenre(userId: string, genre: string): Promise<boolean> {
    try {
      const index = this.favoriteGenres.findIndex(
        g => g.userId === userId && g.genre === genre
      )
      
      if (index === -1) {
        return false
      }

      this.favoriteGenres.splice(index, 1)
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error removing favorite genre:', error)
      return false
    }
  }

  async getFavoriteGenres(userId: string): Promise<FavoriteGenre[]> {
    return this.favoriteGenres.filter(genre => genre.userId === userId)
  }

  isFavoriteGenre(userId: string, genre: string): boolean {
    return this.favoriteGenres.some(
      g => g.userId === userId && g.genre === genre
    )
  }

  // Utility methods
  async clearUserData(userId: string): Promise<void> {
    this.watchlist = this.watchlist.filter(item => item.userId !== userId)
    this.favoriteChannels = this.favoriteChannels.filter(channel => channel.userId !== userId)
    this.favoriteGenres = this.favoriteGenres.filter(genre => genre.userId !== userId)
    this.saveToStorage()
  }

  async getRecommendedProgrammes(userId: string, allProgrammes: Programme[]): Promise<Programme[]> {
    const favoriteGenres = await this.getFavoriteGenres(userId)
    const favoriteChannels = await this.getFavoriteChannels(userId)
    
    if (favoriteGenres.length === 0 && favoriteChannels.length === 0) {
      return []
    }

    const favoriteGenreList = favoriteGenres.map(g => g.genre)
    const favoriteChannelList = favoriteChannels.map(c => c.channelId)
    
    return allProgrammes.filter(programme => {
      const matchesGenre = favoriteGenreList.includes(programme.genre)
      const matchesChannel = favoriteChannelList.includes(programme.channelId)
      return matchesGenre || matchesChannel
    }).slice(0, 10) // Limit to 10 recommendations
  }
}

export const watchlistService = WatchlistService.getInstance()