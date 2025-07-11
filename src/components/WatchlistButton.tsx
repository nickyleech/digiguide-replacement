'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck, Plus, Loader2 } from 'lucide-react'
import { Programme } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { useWatchlist } from '@/hooks/useWatchlist'
import { cn } from '@/lib/utils'

interface WatchlistButtonProps {
  programme: Programme
  channelName: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button'
  className?: string
  onAuthRequired?: () => void
}

export default function WatchlistButton({
  programme,
  channelName,
  size = 'md',
  variant = 'icon',
  className = '',
  onAuthRequired
}: WatchlistButtonProps) {
  const { isAuthenticated } = useAuth()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [isLoading, setIsLoading] = useState(false)
  
  const inWatchlist = isInWatchlist(programme.id)
  
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      onAuthRequired?.()
      return
    }
    
    setIsLoading(true)
    try {
      if (inWatchlist) {
        await removeFromWatchlist(programme.id)
      } else {
        await addToWatchlist(programme, channelName)
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSizeClasses = () => {
    if (variant === 'icon') {
      switch (size) {
        case 'sm': return 'w-6 h-6 p-1'
        case 'md': return 'w-8 h-8 p-1.5'
        case 'lg': return 'w-10 h-10 p-2'
        default: return 'w-8 h-8 p-1.5'
      }
    } else {
      switch (size) {
        case 'sm': return 'px-2 py-1 text-xs'
        case 'md': return 'px-3 py-1.5 text-sm'
        case 'lg': return 'px-4 py-2 text-base'
        default: return 'px-3 py-1.5 text-sm'
      }
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

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'rounded-full transition-all duration-200 flex items-center justify-center',
          getSizeClasses(),
          inWatchlist
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {isLoading ? (
          <Loader2 className={cn(getIconSize(), 'animate-spin')} />
        ) : inWatchlist ? (
          <BookmarkCheck className={getIconSize()} />
        ) : (
          <Bookmark className={getIconSize()} />
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'rounded-md transition-all duration-200 flex items-center justify-center font-medium',
        getSizeClasses(),
        inWatchlist
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className={cn(getIconSize(), 'animate-spin mr-2')} />
      ) : inWatchlist ? (
        <BookmarkCheck className={cn(getIconSize(), 'mr-2')} />
      ) : (
        <Plus className={cn(getIconSize(), 'mr-2')} />
      )}
      {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </button>
  )
}