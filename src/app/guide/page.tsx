'use client'

import { useState, useEffect } from 'react'
import { ElegantTVGuide } from '@/components/ElegantTVGuide'
import Navigation from '@/components/Navigation'
import { 
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar
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
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const platforms = [
    { id: 'freeview', name: 'Freeview' },
    { id: 'sky', name: 'Sky' },
    { id: 'virgin', name: 'Virgin Media' },
    { id: 'freesat', name: 'Freesat' },
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Controls Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-12 py-12">
          <div className="space-y-12">
            
            {/* Platform and Search */}
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-light text-gray-600">Platform</p>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-3xl 
                           font-light text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200
                           transition-all duration-300"
                >
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-light text-gray-600">Search programmes</p>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Find your programme..."
                    className="pl-16 pr-8 py-3 bg-white border border-gray-200 rounded-3xl 
                             font-light text-gray-900 placeholder-gray-500 w-96
                             focus:outline-none focus:ring-4 focus:ring-gray-200
                             transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-light text-gray-600">Programme date</p>
                <div className="text-sm font-light text-gray-500">
                  {currentTime.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => {
                    const prevDate = new Date(selectedDate)
                    prevDate.setDate(prevDate.getDate() - 1)
                    if (prevDate >= new Date()) {
                      setSelectedDate(prevDate)
                    }
                  }}
                  className="p-3 rounded-3xl hover:bg-gray-100 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedDate <= new Date()}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                
                <div className="flex items-center space-x-4 overflow-x-auto">
                  {getDates().slice(0, 7).map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`px-8 py-4 rounded-3xl font-light transition-all duration-300 whitespace-nowrap ${
                        date.toDateString() === selectedDate.toDateString()
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
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
                  className="p-3 rounded-3xl hover:bg-gray-100 transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-light text-gray-800">
                  {selectedDate.toLocaleDateString('en-GB', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TV Guide Content */}
      <main className="max-w-7xl mx-auto px-12 py-16">
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