import { OfferCode } from '@/types'

export interface OfferCodeValidationResult {
  isValid: boolean
  error?: string
  discountAmount?: number
  finalAmount?: number
}

export function validateOfferCode(
  code: string,
  offerCodes: OfferCode[],
  orderAmount: number,
  planType: 'basic' | 'premium',
  userId?: string
): OfferCodeValidationResult {
  const offerCode = offerCodes.find(
    offer => offer.code.toUpperCase() === code.toUpperCase() && offer.isActive
  )

  if (!offerCode) {
    return {
      isValid: false,
      error: 'Invalid offer code'
    }
  }

  const now = new Date()
  const validFrom = new Date(offerCode.validFrom)
  const validUntil = new Date(offerCode.validUntil)

  if (now < validFrom) {
    return {
      isValid: false,
      error: 'Offer code is not yet active'
    }
  }

  if (now > validUntil) {
    return {
      isValid: false,
      error: 'Offer code has expired'
    }
  }

  if (!offerCode.applicablePlans.includes(planType)) {
    return {
      isValid: false,
      error: 'Offer code is not applicable to this plan'
    }
  }

  if (offerCode.minAmount && orderAmount < offerCode.minAmount) {
    return {
      isValid: false,
      error: `Minimum order amount is £${offerCode.minAmount.toFixed(2)}`
    }
  }

  if (offerCode.usageLimit && offerCode.usedCount >= offerCode.usageLimit) {
    return {
      isValid: false,
      error: 'Offer code usage limit reached'
    }
  }

  let discountAmount = 0
  if (offerCode.discountType === 'percentage') {
    discountAmount = (orderAmount * offerCode.discountValue) / 100
  } else {
    discountAmount = offerCode.discountValue
  }

  if (offerCode.maxDiscount && discountAmount > offerCode.maxDiscount) {
    discountAmount = offerCode.maxDiscount
  }

  discountAmount = Math.min(discountAmount, orderAmount)

  return {
    isValid: true,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalAmount: Math.round((orderAmount - discountAmount) * 100) / 100
  }
}

export function formatDiscountDisplay(offerCode: OfferCode): string {
  if (offerCode.discountType === 'percentage') {
    return `${offerCode.discountValue}% off`
  } else {
    return `£${offerCode.discountValue.toFixed(2)} off`
  }
}

export function isOfferCodeActive(offerCode: OfferCode): boolean {
  const now = new Date()
  const validFrom = new Date(offerCode.validFrom)
  const validUntil = new Date(offerCode.validUntil)
  
  return offerCode.isActive && now >= validFrom && now <= validUntil
}

export function getOfferCodeStatus(offerCode: OfferCode): 'active' | 'expired' | 'scheduled' | 'inactive' {
  const now = new Date()
  const validFrom = new Date(offerCode.validFrom)
  const validUntil = new Date(offerCode.validUntil)
  
  if (!offerCode.isActive) {
    return 'inactive'
  }
  
  if (now < validFrom) {
    return 'scheduled'
  }
  
  if (now > validUntil) {
    return 'expired'
  }
  
  return 'active'
}