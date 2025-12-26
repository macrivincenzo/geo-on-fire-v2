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
      
      // Store a flag to prevent automatic redirect
      let shouldPreventRedirect = true;
      let checkoutUrl: string | null = null;
      
      // Override window.location.href to intercept redirects
      const originalLocation = window.location;
      const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
      
      // Create a proxy to intercept location.href assignments
      const locationProxy = {
        get href() {
          return originalLocation.href;
        },
        set href(value: string) {
          if (shouldPreventRedirect && value.includes('checkout.stripe.com')) {
            console.log('Intercepted Stripe checkout redirect:', value);
            checkoutUrl = value;
            // Open in new tab instead
            window.open(value, '_blank');
            setLoading(false);
            shouldPreventRedirect = false;
            return; // Prevent the actual redirect
          }
          // Allow other redirects
          originalLocation.href = value;
        },
        get origin() {
          return originalLocation.origin;
        },
        // Proxy other location properties
        assign: (url: string) => {
          if (shouldPreventRedirect && url.includes('checkout.stripe.com')) {
            console.log('Intercepted Stripe checkout assign:', url);
            checkoutUrl = url;
            window.open(url, '_blank');
            setLoading(false);
            shouldPreventRedirect = false;
            return;
          }
          originalLocation.assign(url);
        },
        replace: (url: string) => {
          if (shouldPreventRedirect && url.includes('checkout.stripe.com')) {
            console.log('Intercepted Stripe checkout replace:', url);
            checkoutUrl = url;
            window.open(url, '_blank');
            setLoading(false);
            shouldPreventRedirect = false;
            return;
          }
          originalLocation.replace(url);
        },
      };
      
      // Temporarily override window.location
      try {
        Object.defineProperty(window, 'location', {
          value: locationProxy,
          writable: true,
          configurable: true,
        });
      } catch (e) {
        console.warn('Could not override location, will use attach result');
      }
      
      // Call attach - it might automatically redirect, but we'll intercept it
      const result = await attach({
        productId,
        returnUrl: window.location.origin + '/plans',
        successUrl: window.location.origin + '/dashboard',
        cancelUrl: window.location.origin + '/plans',
      });
      
      // Restore original location
      try {
        if (locationDescriptor) {
          Object.defineProperty(window, 'location', locationDescriptor);
        } else {
          Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
            configurable: true,
          });
        }
      } catch (e) {
        // Ignore restore errors
      }
      
      // If we intercepted a redirect, we're done
      if (checkoutUrl) {
        console.log('Checkout opened in new tab via intercepted redirect');
        return;
      }
      
      console.log('Attach result:', result);
      
      // If attach returned a checkout URL directly, open it in a new tab
      if (result?.data?.checkout_url) {
        console.log('Opening checkout in new tab:', result.data.checkout_url);
        window.open(result.data.checkout_url, '_blank');
        setLoading(false);
      } else if (result?.checkout_url) {
        console.log('Opening checkout in new tab (direct):', result.checkout_url);
        window.open(result.checkout_url, '_blank');
        setLoading(false);
      } else if (result?.url) {
        console.log('Opening URL in new tab:', result.url);
        window.open(result.url, '_blank');
        setLoading(false);
      } else {
        console.log('Attach completed, no checkout URL found');
        setLoading(false);
        setTimeout(() => {
          console.warn('No redirect detected after attach. Result:', result);
        }, 1000);
      }
    } catch (error) {
      // Restore original location in case of error
      try {
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
          value: originalLocation,
          writable: true,
          configurable: true,
        });
      } catch (e) {
        // Ignore restore errors
      }
      
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

