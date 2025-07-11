'use client'

import { useState } from 'react'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Building2,
  Shield,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CorporateUser, CorporateAccount } from '@/types'

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
  }
]

const mockCorporateUsers: CorporateUser[] = [
  {
    id: '1',
    email: 'admin@techcorp.com',
    corporateAccountId: '1',
    role: 'corp_admin',
    permissions: ['manage_users', 'view_analytics', 'billing_access'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-07-10T09:15:00Z'
  },
  {
    id: '2',
    email: 'manager@techcorp.com',
    corporateAccountId: '1',
    role: 'corp_manager',
    permissions: ['manage_users', 'view_analytics'],
    isActive: true,
    createdAt: '2024-01-20T14:22:00Z',
    lastLoginAt: '2024-07-09T16:30:00Z'
  },
  {
    id: '3',
    email: 'user1@techcorp.com',
    corporateAccountId: '1',
    role: 'corp_user',
    permissions: ['view_content'],
    isActive: true,
    createdAt: '2024-02-01T11:15:00Z',
    lastLoginAt: '2024-07-10T08:45:00Z'
  },
  {
    id: '4',
    email: 'user2@techcorp.com',
    corporateAccountId: '1',
    role: 'corp_user',
    permissions: ['view_content'],
    isActive: false,
    createdAt: '2024-02-05T13:30:00Z',
    lastLoginAt: '2024-06-15T10:20:00Z'
  },
  {
    id: '5',
    email: 'admin@mediasolutions.com',
    corporateAccountId: '2',
    role: 'corp_admin',
    permissions: ['manage_users', 'view_analytics', 'billing_access', 'api_access'],
    isActive: true,
    createdAt: '2024-02-20T09:15:00Z',
    lastLoginAt: '2024-07-10T10:00:00Z'
  },
  {
    id: '6',
    email: 'lead@mediasolutions.com',
    corporateAccountId: '2',
    role: 'corp_manager',
    permissions: ['manage_users', 'view_analytics', 'api_access'],
    isActive: true,
    createdAt: '2024-02-25T16:45:00Z',
    lastLoginAt: '2024-07-09T14:20:00Z'
  }
]

export default function CorporateUsersPage() {
  const [users, setUsers] = useState<CorporateUser[]>(mockCorporateUsers)
  const [accounts] = useState<CorporateAccount[]>(mockCorporateAccounts)
  const [searchTerm, setSearchTerm] = useState('')
  const [accountFilter, setAccountFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<CorporateUser | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAccount = accountFilter === 'all' || user.corporateAccountId === accountFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesAccount && matchesRole && matchesStatus
  })

  const getAccount = (accountId: string) => {
    return accounts.find(account => account.id === accountId)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'corp_admin':
        return 'bg-red-100 text-red-800'
      case 'corp_manager':
        return 'bg-blue-100 text-blue-800'
      case 'corp_user':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'corp_admin':
        return <Shield className="w-4 h-4" />
      case 'corp_manager':
        return <UserCheck className="w-4 h-4" />
      case 'corp_user':
        return <Users className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getLastLoginColor = (lastLogin: string) => {
    const daysSinceLogin = Math.floor((Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceLogin > 30) return 'text-red-600'
    if (daysSinceLogin > 7) return 'text-yellow-600'
    return 'text-green-600'
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar currentPage="corporate-users" />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Corporate Users</h1>
            <p className="text-gray-600">Manage users across all corporate accounts</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.role === 'corp_admin').length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Managers</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.filter(u => u.role === 'corp_manager').length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={accountFilter}
                    onChange={(e) => setAccountFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Accounts</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="corp_admin">Admin</option>
                  <option value="corp_manager">Manager</option>
                  <option value="corp_user">User</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const account = getAccount(user.corporateAccountId)
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-gray-600">
                                {user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.email}</div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">{account?.companyName}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1">
                              {user.role.replace('corp_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {user.isActive ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mr-2" />
                            )}
                            <span className={`text-sm font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className={`text-sm ${getLastLoginColor(user.lastLoginAt)}`}>
                              {formatDate(user.lastLoginAt)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`p-2 transition-colors ${
                                user.isActive 
                                  ? 'text-gray-400 hover:text-red-600' 
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                              title={user.isActive ? 'Deactivate User' : 'Activate User'}
                            >
                              {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete User"
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || accountFilter !== 'all' || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by adding corporate users.'}
              </p>
              {!searchTerm && accountFilter === 'all' && roleFilter === 'all' && statusFilter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add First User
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}