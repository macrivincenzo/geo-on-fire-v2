'use client';

import { Button } from '@/components/ui/button';
import { useCustomer } from '@/hooks/useAutumnCustomer';
import { useEffect, useState } from 'react';

export default function PurchaseButton({ productId, disabled, className, children }: { 
  productId: string; 
  disabled: boolean; 
  className: string; 
  children: React.ReactNode;
}) {
  const { attach } = useCustomer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePurchase = async () => {
    if (!mounted) return;
    
    try {
      const result = await attach({
        productId,
        returnUrl: window.location.origin + '/plans',
        successUrl: window.location.origin + '/dashboard',
        cancelUrl: window.location.origin + '/plans',
      });
      
      // Handle the result - if there's a checkout_url, redirect to it
      if (result.data?.checkout_url) {
        window.location.href = result.data.checkout_url;
      }
    } catch (error) {
      console.error('Error purchasing:', error);
      if (error instanceof Error && (error.message.includes('auth') || error.message.includes('unauthorized'))) {
        window.location.href = '/login?redirect=/plans';
      }
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={disabled || !mounted}
      className={className}
    >
      {children}
    </Button>
  );
}

