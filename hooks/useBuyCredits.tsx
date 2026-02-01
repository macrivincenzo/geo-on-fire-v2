'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { BuyCreditsModal } from '@/components/modals/buy-credits-modal';
import { useRefreshCustomer } from '@/hooks/useAutumnCustomer';

type BuyCreditsContextValue = {
  openBuyCredits: () => void;
};

const defaultValue: BuyCreditsContextValue = {
  openBuyCredits: () => {},
};

const BuyCreditsContext = createContext<BuyCreditsContextValue>(defaultValue);

export function useBuyCredits(): BuyCreditsContextValue {
  return useContext(BuyCreditsContext);
}

export function BuyCreditsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const refreshCustomer = useRefreshCustomer();

  const openBuyCredits = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => {
    setOpen(false);
    refreshCustomer();
  }, [refreshCustomer]);

  return (
    <BuyCreditsContext.Provider value={{ openBuyCredits }}>
      {children}
      <BuyCreditsModal open={open} onClose={handleClose} />
    </BuyCreditsContext.Provider>
  );
}
