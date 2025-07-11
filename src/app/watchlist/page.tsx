'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWatchlist } from '@/hooks/useWatchlist'
import Navigation from '@/components/Navigation'
import WatchlistButton from '@/components/WatchlistButton'
import AuthModal from '@/components/auth/AuthModal'
import { formatTime } from '@/lib/utils'
import { 
  Bookmark, 
  Clock, 
  Calendar, 
  CheckCircle,
  Eye,
  Star,
  Heart,
  Trash2,
  Filter,
  Search
} from 'lucide-react'

export default function WatchlistPage() {
  const { isAuthenticated, user } = useAuth()
  const { 
    watchlist, 
    favoriteChannels, 
    favoriteGenres, 
    updateWatchlistItem, 
    removeFromWatchlist,
    loading 
  } = useWatchlist()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'watched'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [isAuthenticated])

  const filteredWatchlist = watchlist.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false
    
    const now = new Date()
    const itemDate = new Date(item.startTime)
    
    switch (filter) {
      case 'upcoming':
        return itemDate > now && !item.watched
      case 'watched':
        return item.watched
      default:
        return true
    }
  })

  const handleMarkAsWatched = async (programmeId: string, watched: boolean) => {
    await updateWatchlistItem(programmeId, { watched })
  }

  const handleToggleReminder = async (programmeId: string, reminderSet: boolean) => {
    await updateWatchlistItem(programmeId, { reminderSet })
  }

  const handleRemove = async (programmeId: string) => {
    await removeFromWatchlist(programmeId)
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="text-center">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-light text-gray-900 mb-2">Sign in to view your watchlist</h1>
              <p className="text-gray-600 mb-8">
                Keep track of your favorite programmes and never miss a show
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Sign in to continue
              </button>
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Your Watchlist</h1>
          <p className="text-gray-600">
            Manage your saved programmes and favorites
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Programmes</p>
                <p className="text-2xl font-light text-gray-900">{watchlist.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Favorite Channels</p>
                <p className="text-2xl font-light text-gray-900">{favoriteChannels.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Favorite Genres</p>
                <p className="text-2xl font-light text-gray-900">{favoriteGenres.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your watchlist..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'upcoming'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('watched')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'watched'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Watched
              </button>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your watchlist...</p>
          </div>
        ) : filteredWatchlist.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No programmes found' : 'Your watchlist is empty'}
            </h3>
            <p className="text-gray-600 mb-8">
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'Start adding programmes to your watchlist from the TV guide'
              }
            </p>
            <button
              onClick={() => window.location.href = '/guide'}
              className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Browse TV Guide
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWatchlist.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900 mr-3">
                        {item.title}
                      </h3>
                      {item.watched && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Watched
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(item.startTime)}
                      </div>
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {item.channelName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {item.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleMarkAsWatched(item.programmeId, !item.watched)}
                      className={`p-2 rounded-full transition-colors ${
                        item.watched
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={item.watched ? 'Mark as unwatched' : 'Mark as watched'}
                    >
                      {item.watched ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleRemove(item.programmeId)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}