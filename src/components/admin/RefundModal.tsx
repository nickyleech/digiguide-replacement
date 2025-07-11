'use client'

import { useState } from 'react'
import { X, RotateCcw, AlertTriangle } from 'lucide-react'

interface Payment {
  id: string
  subscriptionId: string
  userId: string
  userEmail: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentDate: string
  paymentMethod: string
  transactionId: string
  refundAmount?: number
  refundDate?: string
  failureReason?: string
}

interface RefundModalProps {
  payment: Payment
  onClose: () => void
  onRefund: (paymentId: string, refundAmount: number, reason: string) => void
}

export default function RefundModal({ payment, onClose, onRefund }: RefundModalProps) {
  const [refundAmount, setRefundAmount] = useState(payment.amount)
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const refundReasons = [
    'Customer request',
    'Service issue',
    'Billing error',
    'Duplicate charge',
    'Technical problem',
    'Customer dissatisfaction',
    'Other'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (refundAmount <= 0) {
      newErrors.refundAmount = 'Refund amount must be greater than 0'
    }

    if (refundAmount > payment.amount) {
      newErrors.refundAmount = 'Refund amount cannot exceed original payment amount'
    }

    if (!reason) {
      newErrors.reason = 'Please select a reason for the refund'
    }

    if (reason === 'Other' && !customReason.trim()) {
      newErrors.customReason = 'Please provide a custom reason'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const finalReason = reason === 'Other' ? customReason : reason
      onRefund(payment.id, refundAmount, finalReason)
    } catch (error) {
      console.error('Refund failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field === 'refundAmount') {
      setRefundAmount(value)
    } else if (field === 'reason') {
      setReason(value)
    } else if (field === 'customReason') {
      setCustomReason(value)
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Process Refund</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isProcessing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Payment Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Transaction:</span> {payment.transactionId}</p>
              <p><span className="text-gray-600">Customer:</span> {payment.userEmail}</p>
              <p><span className="text-gray-600">Original Amount:</span> £{payment.amount.toFixed(2)}</p>
              <p><span className="text-gray-600">Date:</span> {new Date(payment.paymentDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-800">Important</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  This action will process a refund to the customer's original payment method. 
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Refund Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Amount (£) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={payment.amount}
                value={refundAmount}
                onChange={(e) => handleInputChange('refundAmount', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.refundAmount ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isProcessing}
              />
              {errors.refundAmount && (
                <p className="text-red-600 text-xs mt-1">{errors.refundAmount}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Maximum refund amount: £{payment.amount.toFixed(2)}
              </p>
            </div>

            {/* Refund Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Refund *
              </label>
              <select
                value={reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.reason ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isProcessing}
              >
                <option value="">Select a reason...</option>
                {refundReasons.map(refundReason => (
                  <option key={refundReason} value={refundReason}>
                    {refundReason}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p className="text-red-600 text-xs mt-1">{errors.reason}</p>
              )}
            </div>

            {/* Custom Reason */}
            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Reason *
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => handleInputChange('customReason', e.target.value)}
                  placeholder="Please provide details about the refund reason..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customReason ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isProcessing}
                />
                {errors.customReason && (
                  <p className="text-red-600 text-xs mt-1">{errors.customReason}</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Process Refund</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}