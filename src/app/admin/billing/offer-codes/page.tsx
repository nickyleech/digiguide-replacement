'use client'

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Percent,
  PoundSterling,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import CreateOfferCodeModal from '@/components/admin/CreateOfferCodeModal'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'
import { OfferCode } from '@/types'

export default function OfferCodesManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedOfferCode, setSelectedOfferCode] = useState<OfferCode | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const mockOfferCodes: OfferCode[] = [
    {
      id: '1',
      code: 'WELCOME25',
      name: 'Welcome Offer',
      description: '25% off first month for new subscribers',
      discountType: 'percentage',
      discountValue: 25,
      validFrom: '2024-07-01T00:00:00Z',
      validUntil: '2024-12-31T23:59:59Z',
      isActive: true,
      usageLimit: 1000,
      usedCount: 247,
      applicablePlans: ['basic', 'premium'],
      createdAt: '2024-07-01T10:00:00Z',
      updatedAt: '2024-07-01T10:00:00Z',
      createdBy: 'admin@example.com'
    },
    {
      id: '2',
      code: 'SUMMER50',
      name: 'Summer Sale',
      description: '£5 off any plan',
      discountType: 'fixed',
      discountValue: 5,
      minAmount: 10,
      validFrom: '2024-06-01T00:00:00Z',
      validUntil: '2024-08-31T23:59:59Z',
      isActive: true,
      usageLimit: 500,
      usedCount: 123,
      applicablePlans: ['basic', 'premium'],
      createdAt: '2024-06-01T10:00:00Z',
      updatedAt: '2024-06-01T10:00:00Z',
      createdBy: 'admin@example.com'
    },
    {
      id: '3',
      code: 'EXPIRED10',
      name: 'Expired Offer',
      description: '10% off premium plans',
      discountType: 'percentage',
      discountValue: 10,
      validFrom: '2024-01-01T00:00:00Z',
      validUntil: '2024-06-30T23:59:59Z',
      isActive: false,
      usageLimit: 100,
      usedCount: 89,
      applicablePlans: ['premium'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-06-30T10:00:00Z',
      createdBy: 'admin@example.com'
    }
  ]

  const [offerCodes, setOfferCodes] = useState<OfferCode[]>(mockOfferCodes)

  const filteredOfferCodes = offerCodes.filter(code => {
    const matchesSearch = 
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && code.isActive) ||
      (filterStatus === 'inactive' && !code.isActive) ||
      (filterStatus === 'expired' && new Date(code.validUntil) < new Date())
    
    const matchesType = filterType === 'all' || code.discountType === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const toggleOfferCodeStatus = (id: string) => {
    setOfferCodes(prev => prev.map(code => 
      code.id === id ? { ...code, isActive: !code.isActive } : code
    ))
  }

  const deleteOfferCode = (id: string) => {
    setOfferCodes(prev => prev.filter(code => code.id !== id))
    setShowDeleteModal(false)
    setSelectedOfferCode(null)
  }

  const createOfferCode = (newOfferCode: Omit<OfferCode, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>) => {
    const offerCode: OfferCode = {
      ...newOfferCode,
      id: Date.now().toString(),
      usedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setOfferCodes(prev => [offerCode, ...prev])
  }

  const getStatusBadge = (code: OfferCode) => {
    const now = new Date()
    const validUntil = new Date(code.validUntil)
    const validFrom = new Date(code.validFrom)
    
    if (!code.isActive) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>
    }
    
    if (validUntil < now) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Expired</span>
    }
    
    if (validFrom > now) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Scheduled</span>
    }
    
    return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
  }

  const getUsagePercentage = (used: number, limit?: number) => {
    if (!limit) return 0
    return Math.round((used / limit) * 100)
  }

  const totalActiveOffers = offerCodes.filter(code => code.isActive).length
  const totalUsages = offerCodes.reduce((sum, code) => sum + code.usedCount, 0)
  const expiredOffers = offerCodes.filter(code => new Date(code.validUntil) < new Date()).length

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentPage="offer-codes" />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Offer Codes</h1>
              <p className="text-gray-600 mt-2">Manage promotional codes and discounts</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Offer Code</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Offers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalActiveOffers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Usages</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">{expiredOffers}</p>
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
                    placeholder="Search offer codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>

          {/* Offer Codes Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Offer Codes ({filteredOfferCodes.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name & Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valid Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
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
                  {filteredOfferCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {code.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(code.code)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{code.name}</div>
                          <div className="text-sm text-gray-500">{code.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          {code.discountType === 'percentage' ? (
                            <Percent className="w-4 h-4 text-green-600" />
                          ) : (
                            <PoundSterling className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {code.discountType === 'percentage' ? `${code.discountValue}%` : `£${code.discountValue}`}
                          </span>
                        </div>
                        {code.minAmount && (
                          <div className="text-xs text-gray-500 mt-1">
                            Min: £{code.minAmount}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(code.validFrom).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {new Date(code.validUntil).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {code.usedCount} / {code.usageLimit || '∞'}
                        </div>
                        {code.usageLimit && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${getUsagePercentage(code.usedCount, code.usageLimit)}%` }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(code)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOfferCode(code)
                              setShowEditModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleOfferCodeStatus(code.id)}
                            className={`${code.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                            title={code.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {code.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOfferCode(code)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOfferCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Offer Code</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the offer code "{selectedOfferCode.code}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOfferCode(selectedOfferCode.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateOfferCodeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={createOfferCode}
      />
    </div>
    </ProtectedAdminRoute>
  )
}