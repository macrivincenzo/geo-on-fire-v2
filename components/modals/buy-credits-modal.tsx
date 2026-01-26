'use client';

import React from 'react';
import { X, CreditCard, Sparkles } from 'lucide-react';
import { usePricingTable } from 'autumn-js/react';
import { useCustomer } from '@/hooks/useAutumnCustomer';

interface BuyCreditsModalProps {
  open: boolean;
  onClose: () => void;
}

// Top-up plans configuration
const TOP_UP_PLANS = [
  { id: 'top-up-10', name: 'Top-Up 10', price: 12, credits: 10, description: 'Quick top-up' },
  { id: 'top-up-25', name: 'Top-Up 25', price: 25, credits: 25, description: 'Popular choice' },
  { id: 'top-up-50', name: 'Top-Up 50', price: 45, credits: 50, description: 'Best value' },
];

export function BuyCreditsModal({ open, onClose }: BuyCreditsModalProps) {
  const { customer } = useCustomer();
  const { products, attach, isLoading } = usePricingTable();
  const messageUsage = customer?.features?.messages;
  const remainingCredits = messageUsage ? (messageUsage.balance || 0) : 0;

  // Filter for one-time top-up products
  const topUpProducts = products?.filter(
    (product: any) => 
      product.id?.startsWith('top-up-') || 
      TOP_UP_PLANS.some(plan => plan.id === product.id)
  ) || [];

  // Merge with our known top-up plans if they're not in the products list
  const availablePlans = React.useMemo(() => {
    const planMap = new Map();
    
    // Add products from Autumn
    topUpProducts.forEach((product: any) => {
      planMap.set(product.id, product);
    });
    
    // Add our known plans if not already present
    TOP_UP_PLANS.forEach(plan => {
      if (!planMap.has(plan.id)) {
        planMap.set(plan.id, {
          id: plan.id,
          name: plan.name,
          display: { name: plan.name },
          items: [
            {
              id: `${plan.id}-price`,
              type: 'flat',
              flat: { amount: plan.price * 100 }, // Convert to cents
              display: { primary_text: `$${plan.price}` }
            },
            {
              id: 'messages',
              type: 'unit',
              unit: { quantity: plan.credits },
              display: { primary_text: `${plan.credits} credits` }
            }
          ],
          properties: { interval: 'one_time' }
        });
      }
    });
    
    return Array.from(planMap.values());
  }, [topUpProducts]);

  const handlePurchase = async (productId: string) => {
    try {
      await attach(productId);
      // Close modal after successful purchase
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Failed to purchase credits:', error);
      // Error handling is done by Autumn's attach function
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Buy More Credits
                </h2>
                <p className="text-sm text-white/90">
                  You currently have <span className="font-semibold">{remainingCredits} credits</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose a top-up plan to add credits to your account. Credits never expire and can be used for any action.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : availablePlans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {availablePlans.map((product: any) => {
                const priceItem = product.items?.find((item: any) => item.type === 'flat');
                const creditItem = product.items?.find((item: any) => item.id === 'messages');
                const price = priceItem?.flat?.amount ? priceItem.flat.amount / 100 : 0;
                const credits = creditItem?.unit?.quantity || 0;
                const pricePerCredit = credits > 0 ? (price / credits).toFixed(2) : '0';

                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {product.display?.name || product.name}
                      </h3>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        ${price}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {credits} credits
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        ${pricePerCredit} per credit
                      </div>
                    </div>

                    <button
                      onClick={() => handlePurchase(product.id)}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Purchase'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No top-up plans available at the moment. Please check back later.
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Note:</strong> Credits are added instantly after purchase and never expire. 
              Each Boost Action uses 5 credits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
