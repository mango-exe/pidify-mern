enum  Currency {
  USD='USD',
  EUR='EUR',
  LEI='LEI'
}

enum  BillingRate {
  NEVER='NEVER',
  MONTHLY='USD',
  ANNUALLY='EUR'
}

interface ISubscriptionPlanPricing {
  price: number,
  currency: Currency,
  billingRate: BillingRate
}

export {
 ISubscriptionPlanPricing
}
