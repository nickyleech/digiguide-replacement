'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ElegantTVGuide } from '@/components/ElegantTVGuide'
import { 
  Tv, 
  Settings, 
  User, 
  Search,
  Filter,
  Bell,
  Star,
  Grid,
  List,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function GuidePage() {
  const [selectedPlatform, setSelectedPlatform] = useState('freeview')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [viewMode, setViewMode] = useState<'grid' | 'channel'>('grid')
  const [selectedChannel, setSelectedChannel] = useState('bbc-one')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const platforms = [
    { id: 'freeview', name: 'Freeview', color: 'bg-blue-500' },
    { id: 'sky', name: 'Sky', color: 'bg-sky-500' },
    { id: 'virgin', name: 'Virgin Media', color: 'bg-red-500' },
    { id: 'freesat', name: 'Freesat', color: 'bg-green-500' },
  ]

  const getDates = () => {
    const dates = []
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const formatDateHeader = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-GB', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="gradient-bg p-1.5 rounded-lg">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">digiguide.tv</span>
            </div>

            {/* Platform and Date Controls */}
            <div className="flex items-center space-x-6">
              {/* Platform Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Platform:</span>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Time */}
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search programmes..."
                  className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'channel' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('channel')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Date Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-14 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const prevDate = new Date(selectedDate)
                  prevDate.setDate(prevDate.getDate() - 1)
                  if (prevDate >= new Date()) {
                    setSelectedDate(prevDate)
                  }
                }}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                disabled={selectedDate <= new Date()}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-1 overflow-x-auto">
                {getDates().slice(0, 7).map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                      date.toDateString() === selectedDate.toDateString()
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formatDateHeader(date)}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  const nextDate = new Date(selectedDate)
                  nextDate.setDate(nextDate.getDate() + 1)
                  const maxDate = new Date()
                  maxDate.setDate(maxDate.getDate() + 13)
                  if (nextDate <= maxDate) {
                    setSelectedDate(nextDate)
                  }
                }}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              {selectedDate.toLocaleDateString('en-GB', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-full mx-auto">
        <ElegantTVGuide
          platform={selectedPlatform}
          date={selectedDate}
          currentTime={currentTime}
          viewMode={viewMode}
          selectedChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  )
}