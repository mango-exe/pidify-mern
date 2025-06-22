import mongoose, { Schema } from 'mongoose'
import { ISubscriptionPlanPricing } from '../types/models/subscription-plan-pricing'

const SubscriptionPlanPricingSchema = new Schema<ISubscriptionPlanPricing>({
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  billingRate: { type: String, required: true }
})

const SubscriptionPlanPricing = mongoose.model<ISubscriptionPlanPricing>('SubscriptionPlanPricing', SubscriptionPlanPricingSchema)

export {
  SubscriptionPlanPricing
}
