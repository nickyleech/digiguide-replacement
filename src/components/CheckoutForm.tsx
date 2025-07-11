'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Percent, PoundSterling, Tag } from 'lucide-react'
import { OfferCode } from '@/types'
import { validateOfferCode } from '@/lib/offerCodeUtils'

interface CheckoutFormProps {
  planType: 'basic' | 'premium'
  planPrice: number
  planName: string
  userId?: string
  onSubmit: (data: { offerCode?: string; discountAmount?: number; finalAmount: number }) => void
}

export default function CheckoutForm({ 
  planType, 
  planPrice, 
  planName, 
  userId, 
  onSubmit 
}: CheckoutFormProps) {
  const [offerCode, setOfferCode] = useState('')
  const [appliedOfferCode, setAppliedOfferCode] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [validationError, setValidationError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

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
      description: '£2 off any plan',
      discountType: 'fixed',
      discountValue: 2,
      minAmount: 3,
      validFrom: '2024-06-01T00:00:00Z',
      validUntil: '2024-08-31T23:59:59Z',
      isActive: true,
      usageLimit: 500,
      usedCount: 123,
      applicablePlans: ['basic', 'premium'],
      createdAt: '2024-06-01T10:00:00Z',
      updatedAt: '2024-06-01T10:00:00Z',
      createdBy: 'admin@example.com'
    }
  ]

  const handleApplyOfferCode = async () => {
    if (!offerCode.trim()) return

    setIsValidating(true)
    setValidationError('')

    try {
      const validation = validateOfferCode(
        offerCode,
        mockOfferCodes,
        planPrice,
        planType,
        userId
      )

      if (validation.isValid) {
        setAppliedOfferCode(offerCode.toUpperCase())
        setDiscountAmount(validation.discountAmount || 0)
        setValidationError('')
      } else {
        setValidationError(validation.error || 'Invalid offer code')
        setAppliedOfferCode(null)
        setDiscountAmount(0)
      }
    } catch (error) {
      setValidationError('Error validating offer code')
      setAppliedOfferCode(null)
      setDiscountAmount(0)
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveOfferCode = () => {
    setAppliedOfferCode(null)
    setDiscountAmount(0)
    setOfferCode('')
    setValidationError('')
  }

  const finalAmount = planPrice - discountAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      offerCode: appliedOfferCode || undefined,
      discountAmount: discountAmount || undefined,
      finalAmount
    })
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Purchase</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">{planName}</h3>
          <p className="text-blue-700 text-sm mt-1">Monthly subscription</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Offer Code Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Tag className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-900">Promo Code</h4>
          </div>
          
          {!appliedOfferCode ? (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={offerCode}
                  onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyOfferCode}
                  disabled={!offerCode.trim() || isValidating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidating ? 'Applying...' : 'Apply'}
                </button>
              </div>
              
              {validationError && (
                <div className="flex items-center text-red-600 text-sm">
                  <XCircle className="w-4 h-4 mr-1" />
                  {validationError}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="font-medium text-green-800">{appliedOfferCode}</p>
                  <p className="text-sm text-green-600">
                    -{discountAmount > 0 && discountAmount < 1 ? 
                      `£${discountAmount.toFixed(2)}` : 
                      `£${discountAmount.toFixed(0)}`
                    } discount applied
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveOfferCode}
                className="text-green-600 hover:text-green-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{planName}</span>
              <span className="text-gray-900">£{planPrice.toFixed(2)}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedOfferCode})</span>
                <span>-£{discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-medium text-gray-900">
                <span>Total</span>
                <span>£{finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          Complete Purchase - £{finalAmount.toFixed(2)}
        </button>
      </form>

      {/* Sample Codes for Testing */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Sample Codes for Testing:</h5>
        <div className="space-y-1 text-sm">
          <div><code className="bg-white px-1 rounded">WELCOME25</code> - 25% off</div>
          <div><code className="bg-white px-1 rounded">SUMMER50</code> - £2 off</div>
        </div>
      </div>
    </div>
  )
}