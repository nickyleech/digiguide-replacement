'use client'

import { Channel } from '@/types'
import { Star, Settings } from 'lucide-react'
import { useState } from 'react'

interface ChannelHeaderProps {
  channel: Channel
  platform: string
}

export function ChannelHeader({ channel, platform }: ChannelHeaderProps) {
  const [isFavourite, setIsFavourite] = useState(false)
  
  const getEPGNumber = () => {
    const platformData = channel.platforms.find(p => p.platformId === platform)
    return platformData?.epgNumber || 0
  }

  const getChannelLogo = () => {
    // Mock channel logos - in real app these would be proper images
    const logos = {
      'bbc-one': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'itv': '📺',
      'channel-4': '4️⃣',
      'bbc-two': '2️⃣',
      'five': '5️⃣'
    }
    return logos[channel.id as keyof typeof logos] || '📺'
  }

  return (
    <div className="sticky top-0 bg-white border-b border-secondary-200 p-4 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary-100 text-lg">
            {getChannelLogo()}
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900 text-sm">{channel.name}</h3>
            <div className="flex items-center space-x-2 text-xs text-secondary-600">
              <span>#{getEPGNumber()}</span>
              <span>•</span>
              <span className="capitalize">{platform}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsFavourite(!isFavourite)}
            className="p-1 rounded-full hover:bg-secondary-100 transition-colors"
          >
            <Star className={`w-4 h-4 ${isFavourite ? 'text-yellow-500 fill-current' : 'text-secondary-400'}`} />
          </button>
          <button className="p-1 rounded-full hover:bg-secondary-100 transition-colors">
            <Settings className="w-4 h-4 text-secondary-400" />
          </button>
        </div>
      </div>
    </div>
  )
}