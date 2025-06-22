import mongoose from 'mongoose'

interface ISubscription {
  user: mongoose.Types.ObjectId,
  subscriptionPlan: mongoose.Types.ObjectId,
  paymentDue: boolean
}

export {
  ISubscription
}
