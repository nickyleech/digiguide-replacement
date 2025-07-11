'use client'

import { useState } from 'react'
import { X, Save, RefreshCw, Key } from 'lucide-react'

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

interface EditUserModalProps {
  user: User
  onClose: () => void
  onSave: (user: User) => void
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    email: user.email,
    subscriptionTier: user.subscriptionTier,
    platformPreference: user.platformPreference,
    status: user.status,
    subscriptionEndDate: user.subscriptionEndDate || '',
    billingAmount: user.billingAmount || 0
  })
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const platforms = ['Freeview', 'Sky', 'Virgin Media', 'Freesat', 'BT TV', 'TalkTalk TV']

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (formData.subscriptionTier === 'premium') {
      if (!formData.subscriptionEndDate) {
        newErrors.subscriptionEndDate = 'End date is required for premium subscriptions'
      }
      if (formData.billingAmount <= 0) {
        newErrors.billingAmount = 'Billing amount must be greater than 0'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const updatedUser: User = {
      ...user,
      email: formData.email,
      subscriptionTier: formData.subscriptionTier,
      platformPreference: formData.platformPreference,
      status: formData.status,
      subscriptionEndDate: formData.subscriptionTier === 'premium' ? formData.subscriptionEndDate : undefined,
      billingAmount: formData.subscriptionTier === 'premium' ? formData.billingAmount : undefined,
      updatedAt: new Date().toISOString()
    }

    onSave(updatedUser)
  }

  const handlePasswordReset = () => {
    // In a real app, this would trigger a password reset email
    alert(`Password reset email sent to ${formData.email}`)
    setShowPasswordReset(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Preference
                  </label>
                  <select
                    value={formData.platformPreference}
                    onChange={(e) => handleInputChange('platformPreference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasswordReset(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Reset Password</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Tier
                  </label>
                  <select
                    value={formData.subscriptionTier}
                    onChange={(e) => handleInputChange('subscriptionTier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                {formData.subscriptionTier === 'premium' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subscription End Date *
                      </label>
                      <input
                        type="date"
                        value={formData.subscriptionEndDate}
                        onChange={(e) => handleInputChange('subscriptionEndDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.subscriptionEndDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.subscriptionEndDate && (
                        <p className="text-red-600 text-xs mt-1">{errors.subscriptionEndDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Billing Amount (£) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.billingAmount}
                        onChange={(e) => handleInputChange('billingAmount', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.billingAmount ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.billingAmount && (
                        <p className="text-red-600 text-xs mt-1">{errors.billingAmount}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* User ID (Read-only) */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={user.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={new Date(user.createdAt).toLocaleDateString()}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reset User Password
              </h3>
              <p className="text-gray-600 mb-6">
                This will send a password reset email to <strong>{formData.email}</strong>.
                The user will receive instructions on how to create a new password.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowPasswordReset(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Send Reset Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}