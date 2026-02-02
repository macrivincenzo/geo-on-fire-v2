'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCustomer } from '@/hooks/useAutumnCustomer';

interface BuyCreditsModalProps {
  open: boolean;
  onClose: () => void;
}

// Top-up plans — matches Autumn dashboard (top-up-10: $12, top-up-25: $25, top-up-50: $45)
const TOP_UP_PLANS = [
  { id: 'top-up-10', name: '10 Credits', price: 12, credits: 10, tagline: 'Quick top-up' },
  { id: 'top-up-25', name: '25 Credits', price: 25, credits: 25, tagline: 'Popular choice' },
  { id: 'top-up-50', name: '50 Credits', price: 45, credits: 50, tagline: 'Best value' },
] as const;

export function BuyCreditsModal({ open, onClose }: BuyCreditsModalProps) {
  const { customer } = useCustomer();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const messageUsage = customer?.features?.messages;
  const remainingCredits = messageUsage ? (messageUsage.balance || 0) : 0;

  // When user returns from Stripe (back button or bfcache restore), clear loading so buttons work again
  useEffect(() => {
    const clearLoading = () => setLoadingPlanId(null);
    const onVisible = () => clearLoading();
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) clearLoading(); // bfcache restore
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  // Reset loading when panel is opened so no stuck state
  useEffect(() => {
    if (open) setLoadingPlanId(null);
  }, [open]);

  const handlePurchase = async (productId: string) => {
    setLoadingPlanId(productId);
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      const returnPath = typeof window !== 'undefined' ? window.location.pathname : '/brand-monitor';
      const response = await fetch('/api/autumn/attach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          product_id: productId,
          return_url: base + returnPath,
          success_url: base + returnPath,
          cancel_url: base + returnPath,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || err?.error || `HTTP ${response.status}`);
      }
      const result = await response.json();
      const checkoutUrl = result?.data?.checkout_url ?? result?.checkout_url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      throw new Error('No checkout URL returned');
    } catch (error) {
      console.error('Failed to start checkout:', error);
      setLoadingPlanId(null);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* No backdrop — page stays clear and clickable; close via X only */}
      {/* Panel: smaller on desktop, full-width with margins on mobile; safe-area for notches */}
      <div
        className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[320px] z-50 rounded-xl border border-gray-200 bg-white shadow-lg font-sans tracking-tight overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200 pb-[env(safe-area-inset-bottom)] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="buy-credits-title"
      >
        {/* Header — compact */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <h2 id="buy-credits-title" className="text-lg font-bold text-gray-900">
              Buy More Credits
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              You have <span className="font-semibold text-gray-700">{remainingCredits} credits</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content — compact */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-600">
            Add credits. Credits never expire.
          </p>

          <div className="space-y-2">
            {TOP_UP_PLANS.map((plan) => {
              const pricePerCredit = plan.credits > 0 ? (plan.price / plan.credits).toFixed(2) : '0';
              const loading = loadingPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {plan.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${plan.price} one-off · ${pricePerCredit}/credit
                      </p>
                    </div>
                    <button
                      onClick={() => handlePurchase(plan.id)}
                      disabled={!!loadingPlanId}
                      className="shrink-0 min-h-[44px] h-9 sm:h-8 px-4 sm:px-3 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 touch-manipulation"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          …
                        </>
                      ) : (
                        'Purchase'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-1.5 pb-1 px-2.5 rounded-lg bg-blue-50 border border-blue-200/60">
            <p className="text-[11px] text-blue-800">
              <strong>Note:</strong> Credits added instantly. Each Boost Action uses 5 credits.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
