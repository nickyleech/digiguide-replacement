'use client'

import { useState, useMemo } from 'react'
import { ProgrammeCard } from './ProgrammeCard'
import { ChannelHeader } from './ChannelHeader'
import { TimeSlots } from './TimeSlots'
import { Button } from '@/components/ui/Button'
import { Programme, Channel } from '@/types'
import { 
  Clock, 
  Filter,
  Grid,
  List,
  ChevronDown,
  Star,
  Tv
} from 'lucide-react'

interface ProgrammeGridProps {
  platform: string
  date: Date
  channels: string[]
  searchQuery: string
  showFilters: boolean
}

export function ProgrammeGrid({ 
  platform, 
  date, 
  channels, 
  searchQuery, 
  showFilters 
}: ProgrammeGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock data - in real app this would come from API
  const mockChannels: Channel[] = [
    {
      id: 'bbc-one',
      name: 'BBC One',
      logoUrl: '/logos/bbc-one.png',
      category: 'Entertainment',
      platforms: [{
        id: '1',
        channelId: 'bbc-one',
        platformId: 'freeview',
        epgNumber: 1,
        displayOrder: 1,
        active: true
      }]
    },
    {
      id: 'itv',
      name: 'ITV',
      logoUrl: '/logos/itv.png',
      category: 'Entertainment',
      platforms: [{
        id: '2',
        channelId: 'itv',
        platformId: 'freeview',
        epgNumber: 3,
        displayOrder: 2,
        active: true
      }]
    },
    {
      id: 'channel-4',
      name: 'Channel 4',
      logoUrl: '/logos/channel-4.png',
      category: 'Entertainment',
      platforms: [{
        id: '3',
        channelId: 'channel-4',
        platformId: 'freeview',
        epgNumber: 4,
        displayOrder: 3,
        active: true
      }]
    }
  ]

  const mockProgrammes: Programme[] = [
    {
      id: '1',
      title: 'BBC News at Six',
      description: 'The latest national and international news stories from the BBC newsroom, presented by expert journalists.',
      genre: 'News',
      startTime: new Date(date.getTime() + 18 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(date.getTime() + 18.5 * 60 * 60 * 1000).toISOString(),
      channelId: 'bbc-one',
      duration: 30,
      rating: 'U'
    },
    {
      id: '2',
      title: 'EastEnders',
      description: 'Drama series set in Albert Square in the East End of London. The residents of Walford face new challenges.',
      genre: 'Drama',
      startTime: new Date(date.getTime() + 19.5 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(date.getTime() + 20 * 60 * 60 * 1000).toISOString(),
      channelId: 'bbc-one',
      duration: 30,
      rating: '12'
    },
    {
      id: '3',
      title: 'The Chase',
      description: 'Quiz show where contestants answer questions to win money whilst being chased by one of the show\'s resident trivia experts.',
      genre: 'Game Show',
      startTime: new Date(date.getTime() + 17 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(date.getTime() + 18 * 60 * 60 * 1000).toISOString(),
      channelId: 'itv',
      duration: 60,
      rating: 'U'
    },
    {
      id: '4',
      title: 'Coronation Street',
      description: 'Long-running soap opera set on the cobbles of Coronation Street in Manchester. Drama unfolds in the Rovers Return.',
      genre: 'Drama',
      startTime: new Date(date.getTime() + 19.5 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(date.getTime() + 20 * 60 * 60 * 1000).toISOString(),
      channelId: 'itv',
      duration: 30,
      rating: '12'
    },
    {
      id: '5',
      title: 'The Great British Bake Off',
      description: 'Amateur bakers compete in a series of challenges to be crowned the best amateur baker in Britain.',
      genre: 'Reality',
      startTime: new Date(date.getTime() + 20 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(date.getTime() + 21 * 60 * 60 * 1000).toISOString(),
      channelId: 'channel-4',
      duration: 60,
      rating: 'U'
    }
  ]

  const genres = ['all', 'News', 'Drama', 'Comedy', 'Documentary', 'Sport', 'Reality', 'Game Show']

  const filteredProgrammes = useMemo(() => {
    return mockProgrammes.filter(programme => {
      const matchesSearch = programme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           programme.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre === 'all' || programme.genre === selectedGenre
      const matchesChannel = channels.includes(programme.channelId)
      
      return matchesSearch && matchesGenre && matchesChannel
    })
  }, [searchQuery, selectedGenre, channels, mockProgrammes])

  const timeSlots = useMemo(() => {
    const slots = []
    const startHour = 6 // 6 AM
    const endHour = 26 // 2 AM next day (26 = 2 AM)
    
    for (let hour = startHour; hour < endHour; hour++) {
      const displayHour = hour > 23 ? hour - 24 : hour
      slots.push({
        time: `${displayHour.toString().padStart(2, '0')}:00`,
        label: `${displayHour.toString().padStart(2, '0')}:00`
      })
    }
    return slots
  }, [])

  const getProgrammesForChannelAndHour = (channelId: string, hour: number) => {
    return filteredProgrammes.filter(programme => {
      const startTime = new Date(programme.startTime)
      const programmeHour = startTime.getHours()
      return programme.channelId === channelId && programmeHour === hour
    })
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-secondary-900">
            Programme Guide
          </h2>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-secondary-500" />
            <span className="text-sm text-secondary-600">
              {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 animate-slide-down">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-secondary-500" />
              <span className="text-sm font-medium text-secondary-700">Genre:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedGenre === genre
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  {genre === 'all' ? 'All Genres' : genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Programme Grid */}
      {viewMode === 'grid' ? (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
            {/* Time Column */}
            <div className="lg:col-span-1 border-r border-secondary-200">
              <div className="sticky top-0 bg-white border-b border-secondary-200 p-4">
                <h3 className="font-semibold text-secondary-900">Time</h3>
              </div>
              <TimeSlots slots={timeSlots} />
            </div>

            {/* Channels Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-secondary-200">
                {mockChannels.filter(channel => channels.includes(channel.id)).map(channel => (
                  <div key={channel.id} className="min-h-[600px]">
                    <ChannelHeader 
                      channel={channel}
                      platform={platform}
                    />
                    <div className="p-2 space-y-2">
                      {timeSlots.map((slot, index) => {
                        const programmes = getProgrammesForChannelAndHour(channel.id, index + 6)
                        return (
                          <div key={slot.time} className="min-h-[40px] flex items-center">
                            {programmes.map(programme => (
                              <ProgrammeCard
                                key={programme.id}
                                programme={programme}
                                variant="compact"
                              />
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredProgrammes.map(programme => (
            <ProgrammeCard
              key={programme.id}
              programme={programme}
              variant="detailed"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProgrammes.length === 0 && (
        <div className="card p-12 text-center">
          <Tv className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            No programmes found
          </h3>
          <p className="text-secondary-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => setSelectedGenre('all')}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}