'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function PurchaseButton({ productId, disabled, className, children, returnUrl, cancelUrl }: { 
  productId: string; 
  disabled?: boolean;
  className: string; 
  children: React.ReactNode;
  /** Where to send user after payment (e.g. / or /plans). Default /plans */
  returnUrl?: string;
  /** Where to send user if they cancel. Default same as returnUrl */
  cancelUrl?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const returnPath = returnUrl ?? '/plans';
  const cancelPath = cancelUrl ?? returnPath;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePurchase = async (e: React.MouseEvent) => {
    // Prevent any default behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();

    if (!mounted || loading) return;

    setLoading(true);

    try {
      console.log('Starting purchase for product:', productId);

      // Make direct API call to get checkout URL
      const response = await fetch('/api/autumn/attach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: productId,
          return_url: base + returnPath,
          success_url: base + '/dashboard',
          cancel_url: base + cancelPath,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
        
        // If 401, redirect to login
        if (response.status === 401) {
          console.error('Authentication failed - redirecting to login');
          window.location.href = `/login?redirect=${encodeURIComponent('/plans?checkout=' + productId)}`;
          return;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('API response:', result);

      // Extract checkout URL from response
      const checkoutUrl = result?.data?.checkout_url || result?.checkout_url;

      if (checkoutUrl) {
        console.log('Redirecting to checkout:', checkoutUrl);

        // Use window.location.href instead of window.open for better mobile compatibility
        // This works reliably across all mobile browsers without popup blockers
        window.location.href = checkoutUrl;
      } else {
        console.warn('No checkout URL found in response:', result);
        setLoading(false);
        alert('Failed to get checkout URL. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Error purchasing:', error);
      setLoading(false);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to start checkout: ${errorMessage}. Please try again or contact support.`);

      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
        if (error.message.includes('auth') || error.message.includes('unauthorized') || error.message.includes('401')) {
          window.location.href = `/login?redirect=${encodeURIComponent('/plans?checkout=' + productId)}`;
        }
      }
    }
  };

  return (
    <Button
      type="button"
      onClick={handlePurchase}
      disabled={!!(disabled || !mounted || loading)}
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

