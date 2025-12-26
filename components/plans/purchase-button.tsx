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

  const handlePurchase = async () => {
    if (!mounted || loading) return;
    
    setLoading(true);
    
    try {
      console.log('Starting purchase for product:', productId);
      
      // Make direct API call to get checkout URL without redirect
      // Try the attach endpoint - Autumn.js uses catch-all route [...all]
      const response = await fetch('/api/autumn/attach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
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
        console.log('Opening checkout in new tab:', checkoutUrl);
        // Open in new tab - this will work because we're not using attach()
        const newWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        
        if (!newWindow || newWindow.closed) {
          // Popup was blocked - fallback to same window
          console.warn('Popup blocked, opening in same window');
          window.location.href = checkoutUrl;
        }
        
        setLoading(false);
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

