'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import UserPreferences from '@/components/UserPreferences'
import ChannelManager from '@/components/ChannelManager'

const mockChannels = [
  { id: '1', name: 'BBC One', logoUrl: '', category: 'General', epgNumber: 1, platform: 'Freeview', isHidden: false, isFavourite: true, displayOrder: 1 },
  { id: '2', name: 'BBC Two', logoUrl: '', category: 'General', epgNumber: 2, platform: 'Freeview', isHidden: false, isFavourite: false, displayOrder: 2 },
  { id: '3', name: 'ITV', logoUrl: '', category: 'General', epgNumber: 3, platform: 'Freeview', isHidden: false, isFavourite: true, displayOrder: 3 },
  { id: '4', name: 'Channel 4', logoUrl: '', category: 'General', epgNumber: 4, platform: 'Freeview', isHidden: false, isFavourite: true, displayOrder: 4 },
  { id: '5', name: 'Channel 5', logoUrl: '', category: 'General', epgNumber: 5, platform: 'Freeview', isHidden: false, isFavourite: false, displayOrder: 5 },
  { id: '6', name: 'BBC News', logoUrl: '', category: 'News', epgNumber: 231, platform: 'Freeview', isHidden: false, isFavourite: false, displayOrder: 6 },
  { id: '7', name: 'Sky News', logoUrl: '', category: 'News', epgNumber: 233, platform: 'Freeview', isHidden: false, isFavourite: false, displayOrder: 7 },
  { id: '8', name: 'BBC Parliament', logoUrl: '', category: 'Politics', epgNumber: 131, platform: 'Freeview', isHidden: true, isFavourite: false, displayOrder: 8 },
  { id: '9', name: 'Quest', logoUrl: '', category: 'Entertainment', epgNumber: 37, platform: 'Freeview', isHidden: false, isFavourite: false, displayOrder: 9 },
  { id: '10', name: 'Dave', logoUrl: '', category: 'Comedy', epgNumber: 19, platform: 'Freeview', isHidden: false, isFavourite: false, displayOrder: 10 },
]

export default function PreferencesPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'channels'>('general')
  const [channels, setChannels] = useState(mockChannels)

  const handleChannelsUpdate = (updatedChannels: any[]) => {
    setChannels(updatedChannels)
  }

  const handleChannelsSave = (channelOrder: string[], hiddenChannels: string[], favourites: string[]) => {
    console.log('Saving channel preferences:', { channelOrder, hiddenChannels, favourites })
  }

  const handlePreferencesSave = (preferences: any) => {
    console.log('Saving user preferences:', preferences)
  }

  const handlePreferencesReset = () => {
    console.log('Resetting preferences to defaults')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-12 py-32">
        <div className="text-center mb-32">
          <h1 className="text-7xl font-light text-black mb-16">
            Preferences
          </h1>
          
          <div className="flex justify-center space-x-16">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-8 py-4 text-xl font-light transition-colors ${
                activeTab === 'general' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border border-black'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`px-8 py-4 text-xl font-light transition-colors ${
                activeTab === 'channels' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border border-black'
              }`}
            >
              Channels
            </button>
          </div>
        </div>

        <div className="mt-32">
          {activeTab === 'general' && (
            <UserPreferences 
              onSave={handlePreferencesSave}
              onReset={handlePreferencesReset}
            />
          )}

          {activeTab === 'channels' && (
            <ChannelManager 
              channels={channels}
              onChannelsUpdate={handleChannelsUpdate}
              onSave={handleChannelsSave}
            />
          )}
        </div>
      </div>
    </div>
  )
}