'use client'

import { useState } from 'react'
import { Programme } from '@/types'
import { formatTime, formatDuration } from '@/lib/utils'
import { 
  Clock, 
  Star, 
  Bell, 
  Info,
  Play,
  Heart,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ProgrammeCardProps {
  programme: Programme
  variant: 'compact' | 'detailed'
}

export function ProgrammeCard({ programme, variant }: ProgrammeCardProps) {
  const [isFavourite, setIsFavourite] = useState(false)
  const [hasReminder, setHasReminder] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const isLive = () => {
    const now = new Date()
    const startTime = new Date(programme.startTime)
    const endTime = new Date(programme.endTime)
    return now >= startTime && now <= endTime
  }

  const getGenreColor = (genre: string) => {
    const colors = {
      'News': 'bg-red-100 text-red-800',
      'Drama': 'bg-purple-100 text-purple-800',
      'Comedy': 'bg-yellow-100 text-yellow-800',
      'Documentary': 'bg-blue-100 text-blue-800',
      'Sport': 'bg-green-100 text-green-800',
      'Reality': 'bg-pink-100 text-pink-800',
      'Game Show': 'bg-orange-100 text-orange-800',
      'Film': 'bg-indigo-100 text-indigo-800',
    }
    return colors[genre as keyof typeof colors] || 'bg-secondary-100 text-secondary-800'
  }

  const getRatingColor = (rating: string) => {
    const colors = {
      'U': 'bg-green-100 text-green-800',
      'PG': 'bg-yellow-100 text-yellow-800',
      '12': 'bg-orange-100 text-orange-800',
      '15': 'bg-red-100 text-red-800',
      '18': 'bg-red-200 text-red-900',
    }
    return colors[rating as keyof typeof colors] || 'bg-secondary-100 text-secondary-800'
  }

  if (variant === 'compact') {
    return (
      <div className="group relative">
        <div className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
          isLive() 
            ? 'border-primary-500 bg-primary-50 shadow-md' 
            : 'border-secondary-200 bg-white hover:border-secondary-300 hover:shadow-sm'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-secondary-900 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">
              {programme.title}
            </h4>
            {isLive() && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-red-600">LIVE</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-secondary-600 mb-2">
            <Clock className="w-3 h-3" />
            <span>{formatTime(programme.startTime)}</span>
            <span>•</span>
            <span>{formatDuration(programme.duration)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenreColor(programme.genre)}`}>
                {programme.genre}
              </span>
              {programme.rating && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(programme.rating)}`}>
                  {programme.rating}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFavourite(!isFavourite)
                }}
                className="p-1 rounded-full hover:bg-secondary-100 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavourite ? 'text-red-500 fill-current' : 'text-secondary-400'}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setHasReminder(!hasReminder)
                }}
                className="p-1 rounded-full hover:bg-secondary-100 transition-colors"
              >
                <Bell className={`w-4 h-4 ${hasReminder ? 'text-primary-500 fill-current' : 'text-secondary-400'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-bold text-secondary-900">{programme.title}</h3>
            {isLive() && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">LIVE</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(programme.startTime)} - {formatTime(programme.endTime)}</span>
            </div>
            <span>•</span>
            <span>{formatDuration(programme.duration)}</span>
          </div>
          
          <p className="text-secondary-700 mb-4">{programme.description}</p>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGenreColor(programme.genre)}`}>
              {programme.genre}
            </span>
            {programme.rating && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(programme.rating)}`}>
                {programme.rating}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant={isFavourite ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsFavourite(!isFavourite)}
            >
              <Heart className={`w-4 h-4 mr-1 ${isFavourite ? 'fill-current' : ''}`} />
              {isFavourite ? 'Added' : 'Add to Favourites'}
            </Button>
            <Button
              variant={hasReminder ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setHasReminder(!hasReminder)}
            >
              <Bell className={`w-4 h-4 mr-1 ${hasReminder ? 'fill-current' : ''}`} />
              {hasReminder ? 'Reminder Set' : 'Set Reminder'}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
              <Info className="w-4 h-4 mr-1" />
              Details
            </Button>
          </div>
        </div>
      </div>
      
      {showDetails && (
        <div className="border-t border-secondary-200 pt-4 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">Programme Details</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Genre:</span>
                  <span className="text-secondary-900">{programme.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Duration:</span>
                  <span className="text-secondary-900">{formatDuration(programme.duration)}</span>
                </div>
                {programme.rating && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Rating:</span>
                    <span className="text-secondary-900">{programme.rating}</span>
                  </div>
                )}
                {programme.seasonNumber && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Season:</span>
                    <span className="text-secondary-900">{programme.seasonNumber}</span>
                  </div>
                )}
                {programme.episodeNumber && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Episode:</span>
                    <span className="text-secondary-900">{programme.episodeNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">Broadcast Information</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Start Time:</span>
                  <span className="text-secondary-900">{formatTime(programme.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">End Time:</span>
                  <span className="text-secondary-900">{formatTime(programme.endTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Status:</span>
                  <span className={`${isLive() ? 'text-red-600' : 'text-secondary-900'}`}>
                    {isLive() ? 'Live Now' : 'Scheduled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}