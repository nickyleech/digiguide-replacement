'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit,
  Trash2,
  Eye,
  Upload,
  Tv,
  Radio,
  Globe,
  Settings,
  Image,
  Link,
  MoreHorizontal
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import ChannelDetailsModal from '@/components/admin/ChannelDetailsModal'
import EditChannelModal from '@/components/admin/EditChannelModal'
import AddChannelModal from '@/components/admin/AddChannelModal'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'

interface Channel {
  id: string
  name: string
  logoUrl: string
  category: string
  description?: string
  platforms: ChannelPlatform[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  apiMappings: ChannelApiMapping[]
}

interface ChannelPlatform {
  id: string
  channelId: string
  platformId: string
  platformName: string
  epgNumber: number
  displayOrder: number
  active: boolean
}

interface ChannelApiMapping {
  id: string
  channelId: string
  externalApiId: string
  apiProvider: string
  mappingType: 'epg' | 'logos' | 'metadata'
  isActive: boolean
  lastSyncDate: string
}

export default function ChannelsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [showChannelDetails, setShowChannelDetails] = useState(false)
  const [showEditChannel, setShowEditChannel] = useState(false)
  const [showAddChannel, setShowAddChannel] = useState(false)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  const mockChannels: Channel[] = [
    {
      id: '1',
      name: 'BBC One HD',
      logoUrl: '/logos/bbc-one.png',
      category: 'Entertainment',
      description: 'BBC One is the flagship television channel of the British Broadcasting Corporation in the United Kingdom.',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-07-01',
      platforms: [
        {
          id: '1',
          channelId: '1',
          platformId: 'sky',
          platformName: 'Sky',
          epgNumber: 101,
          displayOrder: 1,
          active: true
        },
        {
          id: '2',
          channelId: '1',
          platformId: 'freeview',
          platformName: 'Freeview',
          epgNumber: 1,
          displayOrder: 1,
          active: true
        }
      ],
      apiMappings: [
        {
          id: '1',
          channelId: '1',
          externalApiId: 'bbc_one_hd',
          apiProvider: 'BBC iPlayer',
          mappingType: 'epg',
          isActive: true,
          lastSyncDate: '2024-07-10'
        }
      ]
    },
    {
      id: '2',
      name: 'ITV1 HD',
      logoUrl: '/logos/itv1.png',
      category: 'Entertainment',
      description: 'ITV1 is a British free-to-air television channel owned and operated by the British media company ITV plc.',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-06-15',
      platforms: [
        {
          id: '3',
          channelId: '2',
          platformId: 'sky',
          platformName: 'Sky',
          epgNumber: 103,
          displayOrder: 3,
          active: true
        },
        {
          id: '4',
          channelId: '2',
          platformId: 'freeview',
          platformName: 'Freeview',
          epgNumber: 3,
          displayOrder: 3,
          active: true
        }
      ],
      apiMappings: [
        {
          id: '2',
          channelId: '2',
          externalApiId: 'itv1_hd',
          apiProvider: 'ITV Hub',
          mappingType: 'epg',
          isActive: true,
          lastSyncDate: '2024-07-09'
        }
      ]
    },
    {
      id: '3',
      name: 'Channel 4 HD',
      logoUrl: '/logos/channel4.png',
      category: 'Entertainment',
      description: 'Channel 4 is a British free-to-air public-service television broadcaster.',
      isActive: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-05-20',
      platforms: [
        {
          id: '5',
          channelId: '3',
          platformId: 'sky',
          platformName: 'Sky',
          epgNumber: 104,
          displayOrder: 4,
          active: false
        }
      ],
      apiMappings: []
    }
  ]

  const [channels, setChannels] = useState<Channel[]>(mockChannels)

  const categories = ['All Categories', 'Entertainment', 'News', 'Sports', 'Documentary', 'Children', 'Music']
  const platforms = ['All Platforms', 'Sky', 'Freeview', 'Virgin Media', 'Freesat']

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || filterCategory === 'All Categories' || channel.category === filterCategory
    const matchesPlatform = filterPlatform === 'all' || filterPlatform === 'All Platforms' || 
      channel.platforms.some(p => p.platformName === filterPlatform)
    return matchesSearch && matchesCategory && matchesPlatform
  })

  const handleViewChannel = (channel: Channel) => {
    setSelectedChannel(channel)
    setShowChannelDetails(true)
  }

  const handleEditChannel = (channel: Channel) => {
    setSelectedChannel(channel)
    setShowEditChannel(true)
  }

  const handleDeleteChannel = (channelId: string) => {
    if (confirm('Are you sure you want to delete this channel? This action cannot be undone.')) {
      setChannels(prev => prev.filter(channel => channel.id !== channelId))
    }
  }

  const handleToggleChannelStatus = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId ? { ...channel, isActive: !channel.isActive } : channel
    ))
  }

  const toggleChannelSelection = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    )
  }

  const selectAllChannels = () => {
    if (selectedChannels.length === filteredChannels.length) {
      setSelectedChannels([])
    } else {
      setSelectedChannels(filteredChannels.map(channel => channel.id))
    }
  }

  const activeChannels = channels.filter(c => c.isActive).length
  const totalMappings = channels.reduce((sum, c) => sum + c.apiMappings.length, 0)
  const syncedToday = channels.filter(c => 
    c.apiMappings.some(m => m.lastSyncDate === '2024-07-10')
  ).length

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentPage="channels" />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Channel Management</h1>
              <p className="text-gray-600 mt-2">Manage TV channels, EPG mappings, and platform assignments</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Channels</span>
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Bulk Import</span>
              </button>
              <button 
                onClick={() => setShowAddChannel(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Channel</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tv className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Channels</p>
                  <p className="text-2xl font-bold text-gray-900">{channels.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Radio className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Channels</p>
                  <p className="text-2xl font-bold text-gray-900">{activeChannels}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Link className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">API Mappings</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMappings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Globe className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Synced Today</p>
                  <p className="text-2xl font-bold text-gray-900">{syncedToday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All Categories' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform === 'All Platforms' ? 'all' : platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Channels Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Channels ({filteredChannels.length})
                </h2>
                {selectedChannels.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedChannels.length} selected
                    </span>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Bulk Actions
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedChannels.length === filteredChannels.length && filteredChannels.length > 0}
                        onChange={selectAllChannels}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platforms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API Mappings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredChannels.map((channel) => (
                    <tr key={channel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedChannels.includes(channel.id)}
                          onChange={() => toggleChannelSelection(channel.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {channel.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {channel.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {channel.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {channel.platforms.map((platform) => (
                            <span
                              key={platform.id}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                platform.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {platform.platformName} ({platform.epgNumber})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {channel.apiMappings.length} mapping{channel.apiMappings.length !== 1 ? 's' : ''}
                        </div>
                        {channel.apiMappings.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Last sync: {new Date(channel.apiMappings[0].lastSyncDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleChannelStatus(channel.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            channel.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {channel.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewChannel(channel)}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditChannel(channel)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Channel"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChannel(channel.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Channel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showChannelDetails && selectedChannel && (
        <ChannelDetailsModal
          isOpen={showChannelDetails}
          channel={selectedChannel}
          onClose={() => setShowChannelDetails(false)}
          onEdit={() => {
            setShowChannelDetails(false)
            setShowEditChannel(true)
          }}
        />
      )}

      {showEditChannel && selectedChannel && (
        <EditChannelModal
          isOpen={showEditChannel}
          channel={selectedChannel}
          onClose={() => setShowEditChannel(false)}
          onSave={(updatedChannel) => {
            setChannels(prev => prev.map(channel => 
              channel.id === updatedChannel.id ? updatedChannel : channel
            ))
            setShowEditChannel(false)
          }}
        />
      )}

      {showAddChannel && (
        <AddChannelModal
          isOpen={showAddChannel}
          onClose={() => setShowAddChannel(false)}
          onSave={(newChannel) => {
            setChannels(prev => [...prev, newChannel])
            setShowAddChannel(false)
          }}
        />
      )}
    </div>
    </ProtectedAdminRoute>
  )
}