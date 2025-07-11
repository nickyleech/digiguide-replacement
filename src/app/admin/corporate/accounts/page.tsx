'use client'

import { useState } from 'react'
import { 
  Building2, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Mail,
  Phone
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CorporateAccount } from '@/types'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'

const mockCorporateAccounts: CorporateAccount[] = [
  {
    id: '1',
    companyName: 'Tech Corp Limited',
    accountType: 'corporate',
    maxUsers: 25,
    currentUsers: 18,
    adminUserId: 'admin-1',
    billingContact: 'billing@techcorp.com',
    subscriptionTier: 'corporate_premium',
    features: ['premium_channels', 'advanced_analytics', 'bulk_management'],
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-07-08T14:22:00Z'
  },
  {
    id: '2',
    companyName: 'Media Solutions Inc',
    accountType: 'corporate',
    maxUsers: 50,
    currentUsers: 47,
    adminUserId: 'admin-2',
    billingContact: 'accounts@mediasolutions.com',
    subscriptionTier: 'enterprise',
    features: ['premium_channels', 'advanced_analytics', 'bulk_management', 'api_access', 'custom_branding'],
    status: 'active',
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-07-09T11:45:00Z'
  },
  {
    id: '3',
    companyName: 'StartUp Media',
    accountType: 'corporate',
    maxUsers: 10,
    currentUsers: 8,
    adminUserId: 'admin-3',
    billingContact: 'finance@startupmedia.com',
    subscriptionTier: 'corporate_basic',
    features: ['basic_channels', 'standard_analytics'],
    status: 'active',
    createdAt: '2024-03-10T16:20:00Z',
    updatedAt: '2024-07-05T08:30:00Z'
  },
  {
    id: '4',
    companyName: 'Legacy Broadcasting',
    accountType: 'corporate',
    maxUsers: 100,
    currentUsers: 12,
    adminUserId: 'admin-4',
    billingContact: 'billing@legacybroadcasting.com',
    subscriptionTier: 'enterprise',
    features: ['premium_channels', 'advanced_analytics', 'bulk_management', 'api_access', 'custom_branding'],
    status: 'suspended',
    createdAt: '2023-11-08T12:00:00Z',
    updatedAt: '2024-06-15T10:15:00Z'
  }
]

export default function CorporateAccountsPage() {
  const [accounts, setAccounts] = useState<CorporateAccount[]>(mockCorporateAccounts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'cancelled'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<CorporateAccount | null>(null)

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.billingContact.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'suspended':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'corporate_basic':
        return 'bg-blue-100 text-blue-800'
      case 'corporate_premium':
        return 'bg-purple-100 text-purple-800'
      case 'enterprise':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUserUtilization = (current: number, max: number) => {
    const percentage = (current / max) * 100
    const color = percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
    return { percentage, color }
  }

  return (
    <ProtectedAdminRoute>
      <div className="flex h-screen bg-gray-50">
      <AdminSidebar currentPage="corporate-accounts" />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Corporate Accounts</h1>
            <p className="text-gray-600">Manage corporate accounts and user limits</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                  <p className="text-2xl font-bold text-green-600">
                    {accounts.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {accounts.reduce((sum, account) => sum + account.currentUsers, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Max Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {accounts.reduce((sum, account) => sum + account.maxUsers, 0)}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Account
              </button>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account) => {
                    const utilization = getUserUtilization(account.currentUsers, account.maxUsers)
                    return (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <Building2 className="w-8 h-8 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{account.companyName}</div>
                              <div className="text-sm text-gray-500">ID: {account.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierBadgeColor(account.subscriptionTier)}`}>
                            {account.subscriptionTier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="flex-1 mr-3">
                              <div className="text-sm font-medium text-gray-900">
                                {account.currentUsers} / {account.maxUsers}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className={`h-2 rounded-full ${utilization.color}`}
                                  style={{ width: `${utilization.percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round(utilization.percentage)}%
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                            {getStatusIcon(account.status)}
                            <span className="ml-1">{account.status.charAt(0).toUpperCase() + account.status.slice(1)}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {account.billingContact}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedAccount(account)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Edit Account"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No corporate accounts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by creating your first corporate account.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Corporate Account
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedAdminRoute>
  )
}