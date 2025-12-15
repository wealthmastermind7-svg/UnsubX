import { useState, useEffect, useCallback } from 'react';
import {
  configureRevenueCat,
  checkPremiumAccess,
  presentPaywall,
  restorePurchases,
  simulatePurchase,
  isUsingMockImplementation,
  PaywallResult,
} from '@/services/revenueCat';

type UseRevenueCatResult = {
  isReady: boolean;
  isPremium: boolean;
  isLoading: boolean;
  isMock: boolean;
  purchasePremium: () => Promise<boolean>;
  restorePurchase: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
};

export function useRevenueCat(): UseRevenueCatResult {
  const [isReady, setIsReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function init() {
      await configureRevenueCat();
      const hasPremium = await checkPremiumAccess();
      setIsPremium(hasPremium);
      setIsReady(true);
    }
    init();
  }, []);

  const refreshStatus = useCallback(async () => {
    const hasPremium = await checkPremiumAccess();
    setIsPremium(hasPremium);
  }, []);

  const purchasePremium = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isUsingMockImplementation()) {
        const success = await simulatePurchase();
        if (success) {
          setIsPremium(true);
        }
        return success;
      }

      const result: PaywallResult = await presentPaywall();
      
      if (result === 'PURCHASED' || result === 'RESTORED') {
        setIsPremium(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[useRevenueCat] Purchase error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restorePurchase = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const customerInfo = await restorePurchases();
      if (customerInfo) {
        const hasPremium = await checkPremiumAccess();
        setIsPremium(hasPremium);
        return hasPremium;
      }
      return false;
    } catch (error) {
      console.error('[useRevenueCat] Restore error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isReady,
    isPremium,
    isLoading,
    isMock: isUsingMockImplementation(),
    purchasePremium,
    restorePurchase,
    refreshStatus,
  };
}
