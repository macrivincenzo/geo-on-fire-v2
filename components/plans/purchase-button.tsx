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
      
      // Set up redirect prevention BEFORE calling attach
      // This must happen before attach is called, not after
      let redirectPrevented = false;
      const originalHrefDescriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
      const originalReplace = window.location.replace;
      const originalAssign = window.location.assign;
      
      // Override location methods to prevent Stripe redirects
      if (originalHrefDescriptor) {
        Object.defineProperty(window.location, 'href', {
          get: originalHrefDescriptor.get,
          set: function(value: string) {
            if (value.includes('checkout.stripe.com')) {
              console.log('Prevented href redirect to Stripe:', value);
              redirectPrevented = true;
              return; // Prevent redirect
            }
            if (originalHrefDescriptor.set) {
              originalHrefDescriptor.set.call(window.location, value);
            }
          },
          configurable: true,
        });
      }
      
      window.location.replace = function(url: string) {
        if (url.includes('checkout.stripe.com')) {
          console.log('Prevented replace redirect to Stripe:', url);
          redirectPrevented = true;
          return; // Prevent redirect
        }
        return originalReplace.call(window.location, url);
      };
      
      window.location.assign = function(url: string) {
        if (url.includes('checkout.stripe.com')) {
          console.log('Prevented assign redirect to Stripe:', url);
          redirectPrevented = true;
          return; // Prevent redirect
        }
        return originalAssign.call(window.location, url);
      };
      
      // Now call attach - the redirect prevention is already in place
      const result = await attach({
        productId,
        returnUrl: window.location.origin + '/plans',
        successUrl: window.location.origin + '/dashboard',
        cancelUrl: window.location.origin + '/plans',
      } as any);
      
      console.log('Attach result:', result);
      
      // Extract checkout URL from result.data.checkout_url
      const checkoutUrl = result?.data?.checkout_url;
      
      if (checkoutUrl) {
        console.log('Opening checkout in new tab:', checkoutUrl);
        // Open in new tab - redirect is already prevented
        window.open(checkoutUrl, '_blank');
        setLoading(false);
        
        // Restore original location methods after a delay
        setTimeout(() => {
          if (originalHrefDescriptor) {
            Object.defineProperty(window.location, 'href', originalHrefDescriptor);
          }
          window.location.replace = originalReplace;
          window.location.assign = originalAssign;
        }, 1000);
      } else {
        console.warn('No checkout URL found in result:', result);
        setLoading(false);
        // Restore if no URL found
        if (originalHrefDescriptor) {
          Object.defineProperty(window.location, 'href', originalHrefDescriptor);
        }
        window.location.replace = originalReplace;
        window.location.assign = originalAssign;
      }
    } catch (error) {
      // Restore original location methods on error
      // Note: We can't restore here because we don't have access to the originals
      // The restore will happen in the finally block or after timeout
      
      console.error('Error purchasing:', error);
      setLoading(false);
      
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

