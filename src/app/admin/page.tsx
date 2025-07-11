'use client'

import { useState } from 'react'
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Tv, 
  CreditCard, 
  Search, 
  Plus,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  DollarSign
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+324 this month',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Premium Subscribers',
      value: '3,421',
      change: '+89 this month',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: '£17,105',
      change: '+12.3% vs last month',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Active Channels',
      value: '247',
      change: '+5 this week',
      icon: Tv,
      color: 'bg-purple-500'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'User subscription upgraded',
      user: 'user@example.com',
      timestamp: '2 minutes ago',
      type: 'subscription'
    },
    {
      id: 2,
      action: 'Channel added',
      details: 'BBC Three HD',
      timestamp: '15 minutes ago',
      type: 'channel'
    },
    {
      id: 3,
      action: 'Payment refunded',
      user: 'customer@email.com',
      amount: '£4.99',
      timestamp: '1 hour ago',
      type: 'payment'
    },
    {
      id: 4,
      action: 'EPG number updated',
      details: 'Channel 4 HD → 104',
      timestamp: '2 hours ago',
      type: 'platform'
    }
  ]

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High number of subscription cancellations today (23)',
      timestamp: '30 minutes ago'
    },
    {
      id: 2,
      type: 'error',
      message: 'EPG sync failed for Sky platform',
      timestamp: '1 hour ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'System maintenance scheduled for tomorrow 2AM',
      timestamp: '3 hours ago'
    }
  ]

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentPage="dashboard" />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your TV guide platform</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users, channels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'subscription' ? 'bg-green-500' :
                        activity.type === 'channel' ? 'bg-blue-500' :
                        activity.type === 'payment' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        {activity.user && (
                          <p className="text-sm text-gray-600">{activity.user}</p>
                        )}
                        {activity.details && (
                          <p className="text-sm text-gray-600">{activity.details}</p>
                        )}
                        {activity.amount && (
                          <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${
                      alert.type === 'error' ? 'bg-red-50 border-red-200' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                          alert.type === 'error' ? 'text-red-500' :
                          alert.type === 'warning' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">Add Channel</span>
                </div>
              </button>
              <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">Manage Users</span>
                </div>
              </button>
              <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">Process Refund</span>
                </div>
              </button>
              <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">System Settings</span>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedAdminRoute>
  )
}