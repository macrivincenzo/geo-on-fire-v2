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
      
      // Make direct API call to get checkout URL instead of using attach
      // This gives us control over opening in a new tab
      const response = await fetch('/api/autumn/attach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          returnUrl: window.location.origin + '/plans',
          successUrl: window.location.origin + '/dashboard',
          cancelUrl: window.location.origin + '/plans',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create checkout: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Checkout response:', data);
      
      // Extract checkout URL from response
      const checkoutUrl = data?.checkout_url || data?.data?.checkout_url || data?.url;
      
      if (checkoutUrl) {
        console.log('Opening checkout in new tab:', checkoutUrl);
        window.open(checkoutUrl, '_blank');
        setLoading(false);
      } else {
        throw new Error('No checkout URL in response');
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

