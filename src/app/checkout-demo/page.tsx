'use client'

import { useState } from 'react'
import CheckoutForm from '@/components/CheckoutForm'

export default function CheckoutDemo() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic')
  const [checkoutData, setCheckoutData] = useState<any>(null)

  const plans = {
    basic: {
      name: 'Basic Plan',
      price: 4.99,
      features: ['Access to all channels', 'HD quality', 'Mobile app']
    },
    premium: {
      name: 'Premium Plan', 
      price: 9.99,
      features: ['All Basic features', '4K quality', 'Multiple devices', 'Download for offline']
    }
  }

  const handleCheckoutSubmit = (data: any) => {
    setCheckoutData(data)
    console.log('Checkout data:', data)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
          <p className="text-gray-600">Select a plan and test the offer code functionality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Plan Selection */}
          <div className="space-y-4">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`border rounded-lg p-6 cursor-pointer transition-all ${
                  selectedPlan === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(key as 'basic' | 'premium')}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <span className="text-2xl font-bold text-gray-900">£{plan.price}/mo</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Checkout Form */}
          <div>
            <CheckoutForm
              planType={selectedPlan}
              planPrice={plans[selectedPlan].price}
              planName={plans[selectedPlan].name}
              userId="demo-user"
              onSubmit={handleCheckoutSubmit}
            />
          </div>
        </div>

        {/* Results Display */}
        {checkoutData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Checkout Results</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(checkoutData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}