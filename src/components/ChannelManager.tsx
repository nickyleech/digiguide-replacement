'use client'

import { useState } from 'react'

interface Channel {
  id: string
  name: string
  logoUrl: string
  category: string
  epgNumber: number
  platform: string
  isHidden: boolean
  isFavourite: boolean
  displayOrder: number
}

interface ChannelManagerProps {
  channels: Channel[]
  onChannelsUpdate: (channels: Channel[]) => void
  onSave: (channelOrder: string[], hiddenChannels: string[], favourites: string[]) => void
}

export default function ChannelManager({ channels: initialChannels, onChannelsUpdate, onSave }: ChannelManagerProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels)
  const [searchTerm, setSearchTerm] = useState('')
  const [showHidden, setShowHidden] = useState(false)

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVisibility = showHidden || !channel.isHidden
    return matchesSearch && matchesVisibility
  })

  const handleChannelToggle = (channelId: string, field: 'isHidden' | 'isFavourite') => {
    const updatedChannels = channels.map(channel =>
      channel.id === channelId ? { ...channel, [field]: !channel[field] } : channel
    )
    setChannels(updatedChannels)
    onChannelsUpdate(updatedChannels)
  }

  const handleMoveChannel = (channelId: string, direction: 'up' | 'down') => {
    const currentIndex = channels.findIndex(c => c.id === channelId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= channels.length) return

    const newChannels = [...channels]
    const [movedChannel] = newChannels.splice(currentIndex, 1)
    newChannels.splice(newIndex, 0, movedChannel)

    const updatedChannels = newChannels.map((channel, index) => ({
      ...channel,
      displayOrder: index + 1
    }))

    setChannels(updatedChannels)
    onChannelsUpdate(updatedChannels)
  }

  const handleSave = () => {
    const channelOrder = channels.map(c => c.id)
    const hiddenChannels = channels.filter(c => c.isHidden).map(c => c.id)
    const favourites = channels.filter(c => c.isFavourite).map(c => c.id)
    onSave(channelOrder, hiddenChannels, favourites)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="py-32">
        <h1 className="text-7xl font-light text-black mb-32 text-center">
          Channels
        </h1>
        
        <div className="space-y-16">
          {/* Search */}
          <div className="space-y-8">
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-6 border border-black bg-white text-black text-xl font-light"
            />
            
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
                className="w-5 h-5 border-black"
              />
              <span className="text-lg font-light text-black">Show Hidden</span>
            </div>
          </div>

          {/* Channel List */}
          <div className="space-y-8">
            {filteredChannels.map((channel, index) => (
              <div key={channel.id} className="flex items-center justify-between p-8 border border-black">
                <div className="flex items-center space-x-8">
                  <span className="text-lg font-light text-black w-8">{channel.epgNumber}</span>
                  <span className="text-xl font-light text-black">{channel.name}</span>
                  <span className="text-lg font-light text-gray-500">{channel.platform}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleChannelToggle(channel.id, 'isFavourite')}
                    className={`w-12 h-12 border transition-colors ${
                      channel.isFavourite ? 'bg-black text-white' : 'bg-white text-black border-black'
                    }`}
                  >
                    ★
                  </button>
                  
                  <button
                    onClick={() => handleChannelToggle(channel.id, 'isHidden')}
                    className={`w-12 h-12 border transition-colors ${
                      channel.isHidden ? 'bg-black text-white' : 'bg-white text-black border-black'
                    }`}
                  >
                    {channel.isHidden ? '◉' : '○'}
                  </button>
                  
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleMoveChannel(channel.id, 'up')}
                      className="w-8 h-8 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors"
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveChannel(channel.id, 'down')}
                      className="w-8 h-8 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors"
                      disabled={index === filteredChannels.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-light text-black mb-2">
                {channels.filter(c => c.isFavourite).length}
              </div>
              <div className="text-lg font-light text-gray-500">Favourites</div>
            </div>
            <div>
              <div className="text-3xl font-light text-black mb-2">
                {channels.filter(c => c.isHidden).length}
              </div>
              <div className="text-lg font-light text-gray-500">Hidden</div>
            </div>
            <div>
              <div className="text-3xl font-light text-black mb-2">
                {channels.filter(c => !c.isHidden).length}
              </div>
              <div className="text-lg font-light text-gray-500">Visible</div>
            </div>
            <div>
              <div className="text-3xl font-light text-black mb-2">
                {channels.length}
              </div>
              <div className="text-lg font-light text-gray-500">Total</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-32">
          <button
            onClick={handleSave}
            className="px-12 py-4 bg-black text-white text-lg font-light transition-colors hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}