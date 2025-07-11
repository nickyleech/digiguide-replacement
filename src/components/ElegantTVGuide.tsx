'use client'

import { useState, useMemo, useEffect } from 'react'
import { Programme, Channel } from '@/types'
import { formatTime } from '@/lib/utils'
import { epgService } from '@/lib/epgService'
import ChannelLogo from './ChannelLogo'
import WatchlistButton from './WatchlistButton'
import FavoriteChannelButton from './FavoriteChannelButton'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play,
  Clock,
  Tv as TvIcon
} from 'lucide-react'

interface ElegantTVGuideProps {
  platform: string
  date: Date
  currentTime: Date
  viewMode: 'grid' | 'channel'
  selectedChannel: string
  onChannelSelect: (channelId: string) => void
  searchQuery: string
}

export function ElegantTVGuide({ 
  platform, 
  date, 
  currentTime,
  viewMode,
  selectedChannel,
  onChannelSelect,
  searchQuery 
}: ElegantTVGuideProps) {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0)
  const [channels, setChannels] = useState<Channel[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)

  // Load real data from EPG service
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const channelData = await epgService.getChannels(platform)
        setChannels(channelData)

        // Load programmes for all channels
        const allProgrammes: Programme[] = []
        for (const channel of channelData) {
          const channelProgrammes = await epgService.getProgrammes(channel.id, date)
          allProgrammes.push(...channelProgrammes)
        }
        setProgrammes(allProgrammes)
      } catch (error) {
        console.error('Error loading EPG data:', error)
        // Fallback to mock data
        setChannels(mockChannels)
        setProgrammes(generateMockProgrammes())
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [platform, date])

  // Fallback mock data for when service fails
  const mockChannels: Channel[] = [
    {
      id: 'bbc-one',
      name: 'BBC ONE',
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
      id: 'bbc-two',
      name: 'BBC TWO',
      logoUrl: '/logos/bbc-two.png',
      category: 'Entertainment',
      platforms: [{
        id: '2',
        channelId: 'bbc-two',
        platformId: 'freeview',
        epgNumber: 2,
        displayOrder: 2,
        active: true
      }]
    },
    {
      id: 'itv1',
      name: 'ITV1',
      logoUrl: '/logos/itv1.png',
      category: 'Entertainment',
      platforms: [{
        id: '3',
        channelId: 'itv1',
        platformId: 'freeview',
        epgNumber: 3,
        displayOrder: 3,
        active: true
      }]
    },
    {
      id: 'channel-4',
      name: 'Channel 4',
      logoUrl: '/logos/channel-4.png',
      category: 'Entertainment',
      platforms: [{
        id: '4',
        channelId: 'channel-4',
        platformId: 'freeview',
        epgNumber: 4,
        displayOrder: 4,
        active: true
      }]
    },
    {
      id: 'channel-5',
      name: 'Channel 5',
      logoUrl: '/logos/channel-5.png',
      category: 'Entertainment',
      platforms: [{
        id: '5',
        channelId: 'channel-5',
        platformId: 'freeview',
        epgNumber: 5,
        displayOrder: 5,
        active: true
      }]
    },
    {
      id: 'itv2',
      name: 'ITV2',
      logoUrl: '/logos/itv2.png',
      category: 'Entertainment',
      platforms: [{
        id: '6',
        channelId: 'itv2',
        platformId: 'freeview',
        epgNumber: 6,
        displayOrder: 6,
        active: true
      }]
    }
  ]

  const generateMockProgrammes = (): Programme[] => {
    const programmes: Programme[] = []
    const startDate = new Date(date)
    startDate.setHours(6, 0, 0, 0) // Start at 6 AM

    const programmeTemplates = [
      { title: "Women's Euro 2025", duration: 120, genre: "Sport" },
      { title: "BBC News at Ten", duration: 30, genre: "News" },
      { title: "EastEnders", duration: 30, genre: "Drama" },
      { title: "The Chase", duration: 60, genre: "Game Show" },
      { title: "Coronation Street", duration: 30, genre: "Drama" },
      { title: "Channel 4 News", duration: 30, genre: "News" },
      { title: "The Great British Bake Off", duration: 60, genre: "Reality" },
      { title: "Emmerdale", duration: 30, genre: "Drama" },
      { title: "This Morning", duration: 150, genre: "Magazine" },
      { title: "Good Morning Britain", duration: 180, genre: "News" },
      { title: "Loose Women", duration: 60, genre: "Talk Show" },
      { title: "Come Dine With Me", duration: 60, genre: "Reality" },
      { title: "A Place in the Sun", duration: 60, genre: "Property" },
      { title: "Neighbours", duration: 30, genre: "Drama" },
      { title: "Pointless", duration: 45, genre: "Game Show" },
      { title: "The Simpsons", duration: 30, genre: "Animation" },
      { title: "Friends", duration: 30, genre: "Comedy" },
      { title: "Hollyoaks", duration: 30, genre: "Drama" },
      { title: "The Gadget Show", duration: 60, genre: "Technology" },
      { title: "Location, Location, Location", duration: 60, genre: "Property" }
    ]

    mockChannels.forEach(channel => {
      let currentTime = new Date(startDate)
      const endOfDay = new Date(startDate)
      endOfDay.setHours(26, 0, 0, 0) // Until 2 AM next day

      let programmeIndex = 0
      while (currentTime < endOfDay) {
        const template = programmeTemplates[programmeIndex % programmeTemplates.length]
        const startTime = new Date(currentTime)
        const endTime = new Date(currentTime.getTime() + template.duration * 60000)

        programmes.push({
          id: `${channel.id}-${programmeIndex}`,
          title: template.title,
          description: `${template.title} - Programme description goes here with interesting details about the show.`,
          genre: template.genre,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          channelId: channel.id,
          duration: template.duration,
          rating: Math.random() > 0.7 ? ['U', 'PG', '12', '15'][Math.floor(Math.random() * 4)] : undefined
        })

        currentTime = endTime
        programmeIndex++
      }
    })

    return programmes
  }

  const mockProgrammes = useMemo(() => generateMockProgrammes(), [date])

  const getEPGNumber = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId)
    const platformData = channel?.platforms.find(p => p.platformId === platform)
    return platformData?.epgNumber || 0
  }

  const isLive = (programme: Programme) => {
    const now = currentTime
    const startTime = new Date(programme.startTime)
    const endTime = new Date(programme.endTime)
    return now >= startTime && now <= endTime
  }

  const getCurrentProgramme = (channelId: string) => {
    return programmes.find(p => p.channelId === channelId && isLive(p))
  }

  const getUpcomingProgrammes = (channelId: string, limit = 5) => {
    const now = currentTime
    return programmes
      .filter(p => p.channelId === channelId && new Date(p.startTime) > now)
      .slice(0, limit)
  }

  const getProgrammesForTimeSlot = (startHour: number, endHour: number) => {
    const startTime = new Date(date)
    startTime.setHours(startHour, 0, 0, 0)
    const endTime = new Date(date)
    endTime.setHours(endHour, 0, 0, 0)

    return programmes.filter(p => {
      const progStart = new Date(p.startTime)
      return progStart >= startTime && progStart < endTime
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TV guide...</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'channel') {
    // Single channel detailed view (like image 3)
    const channel = channels.find(c => c.id === selectedChannel) || channels[0]
    const currentProg = getCurrentProgramme(channel.id)
    const upcomingProgs = getUpcomingProgrammes(channel.id)

    return (
      <div className="min-h-screen bg-white">
        {/* Channel Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 py-4">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center space-x-8">
            <button
              onClick={() => {
                const prevIndex = currentChannelIndex > 0 ? currentChannelIndex - 1 : channels.length - 1
                setCurrentChannelIndex(prevIndex)
                onChannelSelect(channels[prevIndex].id)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-12">
              {[-1, 0, 1].map(offset => {
                const index = (currentChannelIndex + offset + channels.length) % channels.length
                const ch = channels[index]
                const isActive = offset === 0

                return (
                  <div key={ch.id} className={`text-center ${isActive ? 'scale-110' : 'opacity-50'}`}>
                    <div className="mb-1 relative">
                      <ChannelLogo channelId={ch.id} size="lg" />
                      {isActive && (
                        <div className="absolute -top-2 -right-2">
                          <FavoriteChannelButton
                            channelId={ch.id}
                            channelName={ch.name}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                    <div className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {getEPGNumber(ch.id)}: {ch.name}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => {
                const nextIndex = (currentChannelIndex + 1) % channels.length
                setCurrentChannelIndex(nextIndex)
                onChannelSelect(channels[nextIndex].id)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Current Programme - Large Display */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {currentProg ? (
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Play className="w-4 h-4" />
                <span>ON NOW</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentProg.title}</h1>
              <div className="flex items-center justify-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(currentProg.startTime)}</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="uppercase text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                  {currentProg.genre}
                </span>
              </div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                {currentProg.description}
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <TvIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No programme currently showing</p>
            </div>
          )}

          {/* Upcoming Programmes */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Coming Up</h2>
            <div className="space-y-4">
              {upcomingProgs.map((prog, index) => (
                <div key={prog.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{prog.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{prog.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <WatchlistButton
                      programme={prog}
                      channelName={channel.name}
                      size="sm"
                      variant="icon"
                    />
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatTime(prog.startTime)}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {prog.genre}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (like images 1 & 2)
  const timeSlots = [
    { start: 6, end: 9, label: 'Morning' },
    { start: 9, end: 12, label: 'Late Morning' },
    { start: 12, end: 15, label: 'Afternoon' },
    { start: 15, end: 18, label: 'Early Evening' },
    { start: 18, end: 21, label: 'Evening' },
    { start: 21, end: 24, label: 'Late Night' }
  ]

  return (
    <div className="bg-white">
      {/* Channels Header */}
      <div className="sticky top-26 z-30 bg-white border-b border-gray-200">
        <div className="flex">
          <div className="w-32 flex-shrink-0"></div>
          <div className="grid grid-cols-6 flex-1">
            {channels.slice(0, 6).map(channel => (
              <div key={channel.id} className="text-center py-3 border-r border-gray-200 last:border-r-0">
                <div className="mb-1 flex justify-center">
                  <ChannelLogo channelId={channel.id} size="md" />
                </div>
                <div className="text-xs font-bold text-gray-900">{getEPGNumber(channel.id)}: {channel.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programme Grid */}
      <div className="divide-y divide-gray-200">
        {timeSlots.map(slot => {
          const slotProgrammes = getProgrammesForTimeSlot(slot.start, slot.end)
          
          return (
            <div key={`${slot.start}-${slot.end}`} className="flex min-h-[120px]">
              {/* Time Label */}
              <div className="w-32 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-4 text-center">
                <div className="text-sm font-medium text-gray-900">
                  {slot.start.toString().padStart(2, '0')}:00
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {slot.label}
                </div>
              </div>

              {/* Programmes for each channel */}
              <div className="grid grid-cols-6 flex-1">
                {channels.slice(0, 6).map(channel => {
                  const channelProgs = slotProgrammes.filter(p => p.channelId === channel.id)
                  const currentProg = getCurrentProgramme(channel.id)
                  
                  return (
                    <div key={channel.id} className="border-r border-gray-200 last:border-r-0 p-2 min-h-[120px]">
                      {channelProgs.slice(0, 2).map(prog => {
                        const live = isLive(prog)
                        
                        return (
                          <div
                            key={prog.id}
                            className={`p-2 rounded mb-2 cursor-pointer transition-all hover:shadow-md relative ${
                              live 
                                ? 'bg-red-50 border border-red-200' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              onChannelSelect(channel.id)
                            }}
                          >
                            <div className="absolute top-1 right-1">
                              <WatchlistButton
                                programme={prog}
                                channelName={channel.name}
                                size="sm"
                                variant="icon"
                              />
                            </div>
                            {live && (
                              <div className="flex items-center space-x-1 text-red-600 text-xs font-medium mb-1">
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                <span>ON NOW</span>
                              </div>
                            )}
                            <h4 className="font-medium text-sm text-gray-900 leading-tight mb-1 pr-8">
                              {prog.title}
                            </h4>
                            <div className="text-xs text-gray-600">
                              {formatTime(prog.startTime)}
                            </div>
                            <div className="text-xs text-gray-500 uppercase">
                              {prog.genre}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}