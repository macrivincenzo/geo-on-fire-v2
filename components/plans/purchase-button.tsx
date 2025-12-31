'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function PurchaseButton({ productId, disabled, className, children }: { 
  productId: string; 
  disabled: boolean; 
  className: string; 
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

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
          return_url: window.location.origin + '/plans',
          success_url: window.location.origin + '/dashboard',
          cancel_url: window.location.origin + '/plans',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API response:', result);

      // Extract checkout URL from response
      const checkoutUrl = result?.data?.checkout_url || result?.checkout_url;

      if (checkoutUrl) {
        console.log('Redirecting to checkout:', checkoutUrl);

        // Directly navigate to checkout in the same tab
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
          window.location.href = '/login?redirect=/plans';
        }
      }
    }
  };

  return (
    <Button
      type="button"
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

