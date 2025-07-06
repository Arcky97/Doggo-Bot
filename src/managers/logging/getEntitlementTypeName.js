import { EntitlementType } from 'discord.js';

export default (entitlement) => {
  switch(entitlement.type) {
    case EntitlementType.Purchase:
      return 'Purchase';
    case EntitlementType.PremiumSubscription:
      return 'Premium Subscription';
    case EntitlementType.DeveloperGift:
      return 'Developer Gift';
    case EntitlementType.TestModePurchase:
      return 'Text Purchase';
    case EntitlementType.FreePurchase:
      return 'Free Purchase';
    case EntitlementType.UserGift:
      return 'User Gift';
    case EntitlementType.PremiumPurchase:
      return 'Premium Purchase';
    case EntitlementType.ApplicationSubscription:
      return 'Application Subscription';
    default:
      return 'Unknown Entitlement Type';
  }
};