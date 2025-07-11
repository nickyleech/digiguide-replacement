'use client'

import { useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useWatchlist } from '@/hooks/useWatchlist'
import { cn } from '@/lib/utils'

interface FavoriteChannelButtonProps {
  channelId: string
  channelName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onAuthRequired?: () => void
}

export default function FavoriteChannelButton({
  channelId,
  channelName,
  size = 'md',
  className = '',
  onAuthRequired
}: FavoriteChannelButtonProps) {
  const { isAuthenticated } = useAuth()
  const { addFavoriteChannel, removeFavoriteChannel, isFavoriteChannel } = useWatchlist()
  const [isLoading, setIsLoading] = useState(false)
  
  const isFavorite = isFavoriteChannel(channelId)
  
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      onAuthRequired?.()
      return
    }
    
    setIsLoading(true)
    try {
      if (isFavorite) {
        await removeFavoriteChannel(channelId)
      } else {
        await addFavoriteChannel(channelId, channelName)
      }
    } catch (error) {
      console.error('Error toggling favorite channel:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6 p-1'
      case 'md': return 'w-8 h-8 p-1.5'
      case 'lg': return 'w-10 h-10 p-2'
      default: return 'w-8 h-8 p-1.5'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3'
      case 'md': return 'w-4 h-4'
      case 'lg': return 'w-5 h-5'
      default: return 'w-4 h-4'
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'rounded-full transition-all duration-200 flex items-center justify-center',
        getSizeClasses(),
        isFavorite
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <Loader2 className={cn(getIconSize(), 'animate-spin')} />
      ) : (
        <Star className={cn(getIconSize(), isFavorite ? 'fill-current' : '')} />
      )}
    </button>
  )
}