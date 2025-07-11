'use client'

import { useState } from 'react'
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Settings, 
  CreditCard,
  Edit,
  Plus,
  Clock,
  Shield,
  Activity
} from 'lucide-react'

interface User {
  id: string
  email: string
  subscriptionTier: 'free' | 'premium'
  platformPreference: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'suspended' | 'cancelled'
  lastLoginAt: string
  subscriptionEndDate?: string
  billingAmount?: number
}

interface UserDetailsModalProps {
  user: User
  onClose: () => void
  onEdit: () => void
  onExtendSubscription: (months: number) => void
}

export default function UserDetailsModal({ user, onClose, onEdit, onExtendSubscription }: UserDetailsModalProps) {
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [extensionMonths, setExtensionMonths] = useState(1)

  const handleExtend = () => {
    onExtendSubscription(extensionMonths)
    setShowExtendModal(false)
  }

  const mockPaymentHistory = [
    {
      id: '1',
      date: '2024-06-15',
      amount: 4.99,
      status: 'completed',
      method: 'Credit Card'
    },
    {
      id: '2',
      date: '2024-05-15',
      amount: 4.99,
      status: 'completed',
      method: 'Credit Card'
    },
    {
      id: '3',
      date: '2024-04-15',
      amount: 4.99,
      status: 'completed',
      method: 'Credit Card'
    }
  ]

  const mockActivityLog = [
    {
      id: '1',
      action: 'Login',
      timestamp: '2024-07-10 14:30:22',
      details: 'Logged in from Chrome on Windows'
    },
    {
      id: '2',
      action: 'Subscription renewed',
      timestamp: '2024-06-15 09:15:33',
      details: 'Premium subscription renewed for 1 month'
    },
    {
      id: '3',
      action: 'Platform preference changed',
      timestamp: '2024-06-10 16:45:12',
      details: 'Changed from Sky to Freeview'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-gray-900 font-mono">{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <p className="text-gray-900">{new Date(user.lastLoginAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Platform Preference</label>
                    <p className="text-gray-900">{user.platformPreference}</p>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Subscription Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Plan</label>
                    <div className="flex items-center space-x-2">
                      {user.subscriptionTier === 'premium' ? (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Shield className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        user.subscriptionTier === 'premium' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {user.subscriptionTier === 'premium' ? 'Premium' : 'Free'}
                      </span>
                    </div>
                  </div>
                  {user.subscriptionEndDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subscription End Date</label>
                      <p className="text-gray-900">{new Date(user.subscriptionEndDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {user.billingAmount && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Monthly Amount</label>
                      <p className="text-gray-900">£{user.billingAmount}</p>
                    </div>
                  )}
                </div>
                
                {user.subscriptionTier === 'premium' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowExtendModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Extend Subscription</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Payment History & Activity */}
            <div className="space-y-6">
              {/* Payment History */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment History
                </h3>
                <div className="space-y-3">
                  {mockPaymentHistory.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          £{payment.amount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.date).toLocaleDateString()} • {payment.method}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {mockActivityLog.map((activity) => (
                    <div key={activity.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Extend Subscription Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Extend Subscription
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extension Period
                </label>
                <select
                  value={extensionMonths}
                  onChange={(e) => setExtensionMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowExtendModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtend}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Extend Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}