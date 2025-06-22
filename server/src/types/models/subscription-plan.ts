import mongoose from 'mongoose'

enum SubscriptionTier {
  FREE='free',
  PRO='pro'
}

interface ISubscriptionPlan {
  name: string;
  description: string;
  tier: SubscriptionTier;
  quota: mongoose.Types.ObjectId,
  pricing: mongoose.Types.ObjectId
}

export {
  ISubscriptionPlan
}
