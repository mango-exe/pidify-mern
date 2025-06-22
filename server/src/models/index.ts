import { User } from './user'
import { Export } from './export'
import { FileMeta } from './filemeta'
import { Permission } from './permission'
import { Subscription } from './subscription'
import { SubscriptionPlan } from './subscription-plan'
import { SubscriptionPlanPricing } from './subscription-plan-pricing'
import { SubscriptionPlanQuota } from './subscription-plan-quota'
import { Models } from '../types/models/models'


const models: Models = {
  User,
  Export,
  FileMeta,
  Permission,
  Subscription,
  SubscriptionPlan,
  SubscriptionPlanPricing,
  SubscriptionPlanQuota
}

export { models }
