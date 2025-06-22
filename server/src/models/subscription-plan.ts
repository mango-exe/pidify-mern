import mongoose, { Schema, Document } from 'mongoose'
import { ISubscriptionPlan } from '../types/models/subscription-plan'

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true },
  description: String,
  tier: String,
  quota: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlanQuota' },
  pricing: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlanPricing' }
})

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema)

export {
  SubscriptionPlan
}
