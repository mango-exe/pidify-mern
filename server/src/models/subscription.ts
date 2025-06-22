import mongoose, { Schema } from 'mongoose'
import { ISubscription } from '../types/models/subscription'

const SubscriptionSchema = new Schema<ISubscription>({
  user: { type:  Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionPlan: { type:  Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  paymentDue: { type: Boolean, default: false }
})

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema)

export {
  Subscription
}
