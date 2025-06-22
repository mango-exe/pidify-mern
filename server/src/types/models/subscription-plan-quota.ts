enum  ResetFrequency {
  DAILY='daily',
  MONTHLY='monthly'
}

interface ISubscriptionPlanQuota {
  promptsLimit: number;
  exportsLimit: number;
  resetFrequency: ResetFrequency
}

export {
  ISubscriptionPlanQuota
}
