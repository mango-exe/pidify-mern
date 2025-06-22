import mongoose, { Schema } from 'mongoose'
import { ISubscriptionPlanQuota } from '../types/models/subscription-plan-quota'

const SubscriptionPlanQuotaSchema = new Schema<ISubscriptionPlanQuota>({
  promptsLimit: { type: Number, required: true },
  exportsLimit: { type: Number, required: true },
  resetFrequency: String
})

const SubscriptionPlanQuota = mongoose.model<ISubscriptionPlanQuota>('SubscriptionPlanQuota', SubscriptionPlanQuotaSchema)

export {
  SubscriptionPlanQuota
}
