'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ProgrammeGrid } from '@/components/ProgrammeGrid'
import { PlatformSelector } from '@/components/PlatformSelector'
import { DateNavigation } from '@/components/DateNavigation'
import { 
  Tv, 
  Settings, 
  User, 
  Search,
  Filter,
  Bell,
  Star
} from 'lucide-react'

export default function GuidePage() {
  const [selectedPlatform, setSelectedPlatform] = useState('freeview')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedChannels, setSelectedChannels] = useState(['bbc-one', 'itv', 'channel-4'])
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="gradient-bg p-2 rounded-xl">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">digiguide.tv</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search programmes, channels, or genres..."
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4 mr-1" />
                Reminders
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-1" />
                Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Platform Selector */}
            <PlatformSelector 
              selected={selectedPlatform} 
              onSelect={setSelectedPlatform} 
            />

            {/* Date Navigation */}
            <DateNavigation 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate} 
            />

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-1" />
                Favourites
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProgrammeGrid
          platform={selectedPlatform}
          date={selectedDate}
          channels={selectedChannels}
          searchQuery={searchQuery}
          showFilters={showFilters}
        />
      </main>
    </div>
  )
}