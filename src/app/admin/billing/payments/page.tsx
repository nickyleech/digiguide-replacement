'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RotateCcw
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import PaymentDetailsModal from '@/components/admin/PaymentDetailsModal'
import RefundModal from '@/components/admin/RefundModal'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'

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

export default function PaymentsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)

  const mockPayments: Payment[] = [
    {
      id: '1',
      subscriptionId: 'sub_123',
      userId: 'user_1',
      userEmail: 'john.doe@example.com',
      amount: 4.99,
      currency: 'GBP',
      status: 'completed',
      paymentDate: '2024-07-10T10:30:00Z',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_abc123'
    },
    {
      id: '2',
      subscriptionId: 'sub_124',
      userId: 'user_2',
      userEmail: 'sarah.smith@example.com',
      amount: 4.99,
      currency: 'GBP',
      status: 'failed',
      paymentDate: '2024-07-09T14:15:00Z',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_def456',
      failureReason: 'Insufficient funds'
    },
    {
      id: '3',
      subscriptionId: 'sub_125',
      userId: 'user_3',
      userEmail: 'mike.wilson@example.com',
      amount: 4.99,
      currency: 'GBP',
      status: 'refunded',
      paymentDate: '2024-07-08T09:20:00Z',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_ghi789',
      refundAmount: 4.99,
      refundDate: '2024-07-09T16:45:00Z'
    },
    {
      id: '4',
      subscriptionId: 'sub_126',
      userId: 'user_4',
      userEmail: 'emma.brown@example.com',
      amount: 4.99,
      currency: 'GBP',
      status: 'pending',
      paymentDate: '2024-07-10T15:00:00Z',
      paymentMethod: 'PayPal',
      transactionId: 'txn_jkl012'
    }
  ]

  const [payments, setPayments] = useState<Payment[]>(mockPayments)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    const matchesMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod
    return matchesSearch && matchesStatus && matchesMethod
  })

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowPaymentDetails(true)
  }

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowRefundModal(true)
  }

  const processRefund = (paymentId: string, refundAmount: number, reason: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: 'refunded' as const, 
            refundAmount,
            refundDate: new Date().toISOString()
          }
        : payment
    ))
    setShowRefundModal(false)
    setSelectedPayment(null)
  }

  const retryPayment = (paymentId: string) => {
    // In a real app, this would trigger a payment retry
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'pending' as const }
        : payment
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'refunded':
        return <RotateCcw className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full"
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'refunded':
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0)

  const totalRefunds = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, payment) => sum + (payment.refundAmount || 0), 0)

  const failedPayments = payments.filter(p => p.status === 'failed').length
  const pendingPayments = payments.filter(p => p.status === 'pending').length

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentPage="payments" />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-2">Monitor and manage subscription payments</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Payments</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Sync Payments</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">£{totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Refunds</p>
                  <p className="text-2xl font-bold text-gray-900">£{totalRefunds.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Failed Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{failedPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
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
                    placeholder="Search by email, transaction ID..."
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
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Methods</option>
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Payments ({filteredPayments.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.transactionId}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            {payment.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{payment.userEmail}</div>
                        <div className="text-sm text-gray-500">{payment.userId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          £{payment.amount.toFixed(2)}
                        </div>
                        {payment.refundAmount && (
                          <div className="text-sm text-red-600">
                            -£{payment.refundAmount.toFixed(2)} refunded
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{payment.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <span className={getStatusBadge(payment.status)}>
                            {payment.status}
                          </span>
                        </div>
                        {payment.failureReason && (
                          <div className="text-xs text-red-600 mt-1">
                            {payment.failureReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(payment.paymentDate).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewPayment(payment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => handleRefund(payment)}
                              className="text-red-600 hover:text-red-900"
                              title="Process Refund"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                          {payment.status === 'failed' && (
                            <button
                              onClick={() => retryPayment(payment.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Retry Payment"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
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
      {showPaymentDetails && selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setShowPaymentDetails(false)}
          onRefund={() => {
            setShowPaymentDetails(false)
            setShowRefundModal(true)
          }}
        />
      )}

      {showRefundModal && selectedPayment && (
        <RefundModal
          payment={selectedPayment}
          onClose={() => setShowRefundModal(false)}
          onRefund={processRefund}
        />
      )}
    </div>
    </ProtectedAdminRoute>
  )
}