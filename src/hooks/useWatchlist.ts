'use client'

import { useState, useEffect } from 'react'
import { Programme } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { 
  watchlistService, 
  WatchlistItem, 
  FavoriteChannel, 
  FavoriteGenre 
} from '@/lib/watchlist'

export function useWatchlist() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [favoriteChannels, setFavoriteChannels] = useState<FavoriteChannel[]>([])
  const [favoriteGenres, setFavoriteGenres] = useState<FavoriteGenre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      setWatchlist([])
      setFavoriteChannels([])
      setFavoriteGenres([])
      setLoading(false)
    }
  }, [user])

  const loadData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const [watchlistData, channelsData, genresData] = await Promise.all([
        watchlistService.getWatchlist(user.id),
        watchlistService.getFavoriteChannels(user.id),
        watchlistService.getFavoriteGenres(user.id)
      ])
      
      setWatchlist(watchlistData)
      setFavoriteChannels(channelsData)
      setFavoriteGenres(genresData)
    } catch (error) {
      console.error('Error loading watchlist data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWatchlist = async (programme: Programme, channelName: string): Promise<boolean> => {
    if (!user) return false
    
    const success = await watchlistService.addToWatchlist(user.id, programme, channelName)
    if (success) {
      await loadData()
    }
    return success
  }

  const removeFromWatchlist = async (programmeId: string): Promise<boolean> => {
    if (!user) return false
    
    const success = await watchlistService.removeFromWatchlist(user.id, programmeId)
    if (success) {
      await loadData()
    }
    return success
  }

  const updateWatchlistItem = async (
    programmeId: string, 
    updates: Partial<WatchlistItem>
  ): Promise<boolean> => {
    if (!user) return false
    
    const success = await watchlistService.updateWatchlistItem(user.id, programmeId, updates)
    if (success) {
      await loadData()
    }
    return success
  }

  const isInWatchlist = (programmeId: string): boolean => {
    if (!user) return false
    return watchlistService.isInWatchlist(user.id, programmeId)
  }

  const addFavoriteChannel = async (channelId: string, channelName: string): Promise<boolean> => {
    if (!user) return false
    
    const success = await watchlistService.addFavoriteChannel(user.id, channelId, channelName)
    if (success) {
      await loadData()
    }
    return success
  }

  const removeFavoriteChannel = async (channelId: string): Promise<boolean> => {
    if (!user) return false
    
    const success = await watchlistService.removeFavoriteChannel(user.id, channelId)
    if (success) {
      await loadData()
    }
    return success
  }

  const isFavoriteChannel = (channelId: string): boolean => {
    if (!user) return false
    return watchlistService.isFavoriteChannel(user.id, channelId)
  }

  const addFavoriteGenre = async (genre: string): Promise<boolean> => {
    if (!user) return false
    
    const success = await watchlistService.addFavoriteGenre(user.id, genre)
    if (success) {
      await loadData()
    }
    return success
  }

  const removeFavoriteGenre = async (genre: string): Promise<boolean> => {
    if (!user) return false
    
    const success = await watchlistService.removeFavoriteGenre(user.id, genre)
    if (success) {
      await loadData()
    }
    return success
  }

  const isFavoriteGenre = (genre: string): boolean => {
    if (!user) return false
    return watchlistService.isFavoriteGenre(user.id, genre)
  }

  const getRecommendedProgrammes = async (allProgrammes: Programme[]): Promise<Programme[]> => {
    if (!user) return []
    return await watchlistService.getRecommendedProgrammes(user.id, allProgrammes)
  }

  const clearAllData = async (): Promise<void> => {
    if (!user) return
    await watchlistService.clearUserData(user.id)
    await loadData()
  }

  return {
    watchlist,
    favoriteChannels,
    favoriteGenres,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    isInWatchlist,
    addFavoriteChannel,
    removeFavoriteChannel,
    isFavoriteChannel,
    addFavoriteGenre,
    removeFavoriteGenre,
    isFavoriteGenre,
    getRecommendedProgrammes,
    clearAllData,
    refresh: loadData
  }
}