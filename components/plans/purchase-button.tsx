'use client';

import { Button } from '@/components/ui/button';
import { useCustomer } from '@/hooks/useAutumnCustomer';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function PurchaseButton({ productId, disabled, className, children }: { 
  productId: string; 
  disabled: boolean; 
  className: string; 
  children: React.ReactNode;
}) {
  const { attach } = useCustomer();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePurchase = async () => {
    if (!mounted || loading) return;
    
    setLoading(true);
    
    try {
      console.log('Starting purchase for product:', productId);
      
      // Call attach - it returns the checkout URL in result.data.checkout_url
      const result = await attach({
        productId,
        returnUrl: window.location.origin + '/plans',
        successUrl: window.location.origin + '/dashboard',
        cancelUrl: window.location.origin + '/plans',
      });
      
      console.log('Attach result:', result);
      
      // Extract checkout URL from result.data.checkout_url immediately
      const checkoutUrl = result?.data?.checkout_url;
      
      if (checkoutUrl) {
        console.log('Opening checkout in new tab:', checkoutUrl);
        // Open immediately in new tab - this should happen before any redirect
        window.open(checkoutUrl, '_blank');
        setLoading(false);
      } else {
        console.warn('No checkout URL found in result:', result);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error purchasing:', error);
      setLoading(false);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to start checkout: ${errorMessage}. Please try again or contact support.`);
      
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
        if (error.message.includes('auth') || error.message.includes('unauthorized') || error.message.includes('401')) {
          window.location.href = '/login?redirect=/plans';
        }
      }
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={disabled || !mounted || loading}
      className={className}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading checkout...
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

