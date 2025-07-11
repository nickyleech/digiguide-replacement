'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Platform {
  id: string
  name: string
  logo: string
  color: string
}

interface PlatformSelectorProps {
  selected: string
  onSelect: (platform: string) => void
}

export function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const platforms: Platform[] = [
    { id: 'freeview', name: 'Freeview', logo: '📺', color: 'bg-blue-500' },
    { id: 'sky', name: 'Sky', logo: '🛰️', color: 'bg-sky-500' },
    { id: 'virgin', name: 'Virgin Media', logo: '📡', color: 'bg-red-500' },
    { id: 'freesat', name: 'Freesat', logo: '🎯', color: 'bg-green-500' },
  ]

  const selectedPlatform = platforms.find(p => p.id === selected) || platforms[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-secondary-300 rounded-lg px-4 py-2 hover:bg-secondary-50 transition-colors duration-200"
      >
        <div className={`w-3 h-3 rounded-full ${selectedPlatform.color}`}></div>
        <span className="font-medium text-secondary-900">{selectedPlatform.name}</span>
        <ChevronDown className={`w-4 h-4 text-secondary-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-lg z-50 animate-slide-down">
          <div className="py-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  onSelect(platform.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-secondary-50 transition-colors duration-200 ${
                  selected === platform.id ? 'bg-primary-50 text-primary-700' : 'text-secondary-700'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                <span className="font-medium">{platform.name}</span>
                <span className="text-lg">{platform.logo}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}