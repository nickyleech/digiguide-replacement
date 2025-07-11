'use client'

import { useState } from 'react'
import { getChannelLogo, getChannelLogoClasses, ChannelLogoProps } from '@/lib/channelLogos'
import { cn } from '@/lib/utils'

export default function ChannelLogo({ 
  channelId, 
  size = 'md', 
  className = '', 
  showFallback = true 
}: ChannelLogoProps) {
  const [imageError, setImageError] = useState(false)
  const logo = getChannelLogo(channelId)
  
  if (!logo) {
    return showFallback ? (
      <div className={cn(getChannelLogoClasses(size), 'flex items-center justify-center bg-gray-100 text-gray-400', className)}>
        📺
      </div>
    ) : null
  }

  if (imageError || !logo.logoUrl) {
    return (
      <div className={cn(getChannelLogoClasses(size), 'flex items-center justify-center bg-gray-100 text-gray-600', className)}>
        <span className="text-sm">{logo.fallbackEmoji}</span>
      </div>
    )
  }

  return (
    <img
      src={logo.logoUrl}
      alt={`${logo.name} logo`}
      className={cn(getChannelLogoClasses(size), 'bg-white', className)}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  )
}