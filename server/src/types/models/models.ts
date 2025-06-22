import { User } from '../../models/user'
import { Export } from '../../models/export'
import { FileMeta } from '../../models/filemeta'
import { Permission } from '../../models/permission'
import { Subscription } from '../../models/subscription'
import { SubscriptionPlan } from '../../models/subscription-plan'
import { SubscriptionPlanPricing } from '../../models/subscription-plan-pricing'
import { SubscriptionPlanQuota } from '../../models/subscription-plan-quota'

interface Models {
  User: typeof User;
  Export: typeof Export;
  FileMeta: typeof FileMeta;
  Permission: typeof Permission;
  Subscription: typeof Subscription;
  SubscriptionPlan: typeof SubscriptionPlan;
  SubscriptionPlanPricing: typeof SubscriptionPlanPricing;
  SubscriptionPlanQuota: typeof SubscriptionPlanQuota;
}

export {
  Models
}
