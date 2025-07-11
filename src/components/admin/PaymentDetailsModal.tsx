'use client'

import { X, CreditCard, User, Calendar, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react'

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

interface PaymentDetailsModalProps {
  payment: Payment
  onClose: () => void
  onRefund: () => void
}

export default function PaymentDetailsModal({ payment, onClose, onRefund }: PaymentDetailsModalProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'refunded':
        return <RotateCcw className="w-6 h-6 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'refunded':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            <p className="text-gray-600 mt-1">{payment.transactionId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getStatusIcon(payment.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                £{payment.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{payment.currency}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Transaction Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                  <p className="text-gray-900 font-mono">{payment.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <p className="text-gray-900">{payment.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Date</label>
                  <p className="text-gray-900">{new Date(payment.paymentDate).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subscription ID</label>
                  <p className="text-gray-900 font-mono">{payment.subscriptionId}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{payment.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-gray-900 font-mono">{payment.userId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Failure Information */}
          {payment.status === 'failed' && payment.failureReason && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Failure Details
              </h3>
              <p className="text-red-700">{payment.failureReason}</p>
            </div>
          )}

          {/* Refund Information */}
          {payment.status === 'refunded' && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <RotateCcw className="w-5 h-5 mr-2" />
                Refund Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-blue-700">Refund Amount</label>
                  <p className="text-blue-900 font-semibold">£{payment.refundAmount?.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-700">Refund Date</label>
                  <p className="text-blue-900">
                    {payment.refundDate ? new Date(payment.refundDate).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Payment Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment initiated</p>
                  <p className="text-xs text-gray-500">
                    {new Date(payment.paymentDate).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {payment.status === 'completed' && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment completed</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.paymentDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              
              {payment.status === 'failed' && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment failed</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.paymentDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              
              {payment.status === 'refunded' && payment.refundDate && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment refunded</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.refundDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
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
            {payment.status === 'completed' && (
              <button
                onClick={onRefund}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Process Refund</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}