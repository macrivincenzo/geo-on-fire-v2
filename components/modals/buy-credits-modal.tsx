'use client';

import React from 'react';
import { X } from 'lucide-react';
import { usePricingTable } from 'autumn-js/react';
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
  const { attach, isLoading } = usePricingTable();
  const messageUsage = customer?.features?.messages;
  const remainingCredits = messageUsage ? (messageUsage.balance || 0) : 0;

  const handlePurchase = async (productId: string) => {
    try {
      await attach(productId);
      setTimeout(() => onClose(), 500);
    } catch (error) {
      console.error('Failed to purchase credits:', error);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Light backdrop — click to close, doesn't block the whole page */}
      <div
        className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel: right-below corner, same design as rest of site */}
      <div
        className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 w-full sm:max-w-md rounded-xl border border-gray-200 dark:border-gray-600/80 bg-white dark:bg-gray-800 shadow-lg dark:shadow-black/20 font-sans tracking-tight overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="buy-credits-title"
      >
        {/* Header — clean, no gradient */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-600/80">
          <div>
            <h2 id="buy-credits-title" className="text-xl font-bold text-gray-900 dark:text-white">
              Buy More Credits
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              You have <span className="font-semibold text-gray-700 dark:text-gray-300">{remainingCredits} credits</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add credits to your account. Credits never expire.
          </p>

          <div className="space-y-3">
            {TOP_UP_PLANS.map((plan) => {
              const pricePerCredit = plan.credits > 0 ? (plan.price / plan.credits).toFixed(2) : '0';
              return (
                <div
                  key={plan.id}
                  className="rounded-lg border border-gray-200 dark:border-gray-600/80 bg-gray-50/50 dark:bg-gray-700/50 p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {plan.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {plan.tagline}
                      </p>
                      <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                          one-off · ${pricePerCredit}/credit
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handlePurchase(plan.id)}
                      disabled={isLoading}
                      className="shrink-0 h-9 px-4 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? '…' : 'Purchase'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 pb-1 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Credits are added instantly and never expire. Each Boost Action uses 5 credits.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
