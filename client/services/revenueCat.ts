import { Platform } from 'react-native';
import Constants from 'expo-constants';

const REVENUECAT_IOS_API_KEY = 'test_nCIVUMQPfemLdevxXGvNYeUltuH';
const REVENUECAT_ANDROID_API_KEY = 'test_nCIVUMQPfemLdevxXGvNYeUltuH';
const ENTITLEMENT_ID = 'UnsubX Pro';

export type CustomerInfo = {
  entitlements: {
    active: {
      [key: string]: {
        identifier: string;
        isActive: boolean;
        willRenew: boolean;
        expirationDate: string | null;
      };
    };
  };
  activeSubscriptions: string[];
  originalAppUserId: string;
};

export type PaywallResult = 
  | 'NOT_PRESENTED'
  | 'ERROR'
  | 'CANCELLED'
  | 'PURCHASED'
  | 'RESTORED';

let isConfigured = false;
let mockIsPremium = false;
let Purchases: any = null;
let RevenueCatUI: any = null;

const isExpoGo = Constants.appOwnership === 'expo';

async function loadRevenueCat(): Promise<boolean> {
  if (isExpoGo) {
    console.log('[RevenueCat] Running in Expo Go - using mock implementation');
    return false;
  }

  try {
    const purchasesModule = await import('react-native-purchases');
    Purchases = purchasesModule.default;
    
    const uiModule = await import('react-native-purchases-ui');
    RevenueCatUI = uiModule.default;
    
    return true;
  } catch (error) {
    console.log('[RevenueCat] SDK not available - using mock implementation');
    return false;
  }
}

export async function configureRevenueCat(): Promise<void> {
  if (isConfigured) return;

  const sdkAvailable = await loadRevenueCat();

  if (sdkAvailable && Purchases) {
    try {
      Purchases.setLogLevel(Purchases.LOG_LEVEL?.VERBOSE || 4);

      const apiKey = Platform.OS === 'ios' 
        ? REVENUECAT_IOS_API_KEY 
        : REVENUECAT_ANDROID_API_KEY;

      await Purchases.configure({ apiKey });
      isConfigured = true;
      console.log('[RevenueCat] SDK configured successfully');
    } catch (error) {
      console.error('[RevenueCat] Configuration failed:', error);
    }
  } else {
    isConfigured = true;
    console.log('[RevenueCat] Using mock implementation');
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  if (Purchases && !isExpoGo) {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Error fetching customer info:', error);
    }
  }

  return {
    entitlements: {
      active: mockIsPremium ? {
        [ENTITLEMENT_ID]: {
          identifier: ENTITLEMENT_ID,
          isActive: true,
          willRenew: true,
          expirationDate: null,
        },
      } : {},
    },
    activeSubscriptions: mockIsPremium ? ['unsubx_pro_monthly'] : [],
    originalAppUserId: 'mock_user_id',
  };
}

export async function checkPremiumAccess(): Promise<boolean> {
  const customerInfo = await getCustomerInfo();
  return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
}

export async function presentPaywall(): Promise<PaywallResult> {
  if (RevenueCatUI && !isExpoGo) {
    try {
      const result = await RevenueCatUI.presentPaywall();
      
      const PAYWALL_RESULT = {
        NOT_PRESENTED: 0,
        ERROR: 1,
        CANCELLED: 2,
        PURCHASED: 3,
        RESTORED: 4,
      };

      switch (result) {
        case PAYWALL_RESULT.NOT_PRESENTED:
          return 'NOT_PRESENTED';
        case PAYWALL_RESULT.ERROR:
          return 'ERROR';
        case PAYWALL_RESULT.CANCELLED:
          return 'CANCELLED';
        case PAYWALL_RESULT.PURCHASED:
          return 'PURCHASED';
        case PAYWALL_RESULT.RESTORED:
          return 'RESTORED';
        default:
          return 'ERROR';
      }
    } catch (error) {
      console.error('[RevenueCat] Paywall error:', error);
      return 'ERROR';
    }
  }

  return 'NOT_PRESENTED';
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  if (Purchases && !isExpoGo) {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Restore failed:', error);
      return null;
    }
  }

  return getCustomerInfo();
}

export function setMockPremiumStatus(isPremium: boolean): void {
  mockIsPremium = isPremium;
  console.log(`[RevenueCat Mock] Premium status set to: ${isPremium}`);
}

export async function simulatePurchase(): Promise<boolean> {
  if (!isExpoGo && Purchases) {
    console.log('[RevenueCat] Use presentPaywall() for real purchases');
    return false;
  }

  setMockPremiumStatus(true);
  return true;
}

export function isUsingMockImplementation(): boolean {
  return isExpoGo || !Purchases;
}
