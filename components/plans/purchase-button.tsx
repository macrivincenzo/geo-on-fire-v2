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
      
      // Call attach - it should automatically redirect to Stripe checkout
      // or return a checkout URL
      const result = await attach({
        productId,
        returnUrl: window.location.origin + '/plans',
        successUrl: window.location.origin + '/dashboard',
        cancelUrl: window.location.origin + '/plans',
      });
      
      console.log('Attach result:', result);
      
      // Autumn's attach function may automatically redirect or return a checkout URL
      // Check various possible response structures
      if (result?.data?.checkout_url) {
        console.log('Redirecting to checkout:', result.data.checkout_url);
        window.location.href = result.data.checkout_url;
      } else if (result?.checkout_url) {
        console.log('Redirecting to checkout (direct):', result.checkout_url);
        window.location.href = result.checkout_url;
      } else if (result?.url) {
        console.log('Redirecting to URL:', result.url);
        window.location.href = result.url;
      } else {
        // If no explicit redirect, attach might have already redirected
        // or opened a checkout session automatically
        console.log('Attach completed, checking if redirect happened...');
        // Give it a moment in case redirect is happening
        setTimeout(() => {
          console.warn('No redirect detected after attach. Result:', result);
        }, 1000);
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

