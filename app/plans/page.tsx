'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

// Dynamically import PurchaseButton to avoid SSR issues with useCustomer hook
const PurchaseButton = dynamic(
  () => import('@/components/plans/purchase-button'),
  {
    ssr: false,
    loading: () => <Button disabled className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 transition-colors opacity-50">Loading...</Button>
  }
);

const CHECKOUT_PRODUCT_IDS = new Set(['single-analysis', 'credit-pack', 'starter-monthly', 'pro-monthly']);

export default function PricingPage() {
  const { data: session, isPending } = useSession();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  // When user lands with ?checkout=productId (e.g. from home or after login), go straight to Stripe checkout
  useEffect(() => {
    const checkoutProductId = searchParams.get('checkout');
    if (!checkoutProductId || !CHECKOUT_PRODUCT_IDS.has(checkoutProductId) || !session?.user || hasRedirected.current) return;

    hasRedirected.current = true;

    (async () => {
      try {
        const response = await fetch('/api/autumn/attach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            product_id: checkoutProductId,
            return_url: window.location.origin + '/plans',
            success_url: window.location.origin + '/dashboard',
            cancel_url: window.location.origin + '/plans',
          }),
        });
        if (!response.ok) {
          hasRedirected.current = false;
          return;
        }
        const result = await response.json();
        const checkoutUrl = result?.data?.checkout_url || result?.checkout_url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          hasRedirected.current = false;
        }
      } catch {
        hasRedirected.current = false;
      }
    })();
  }, [searchParams, session?.user]);

  const checkoutProductId = searchParams.get('checkout');
  const isRedirectingToCheckout = session?.user && checkoutProductId && CHECKOUT_PRODUCT_IDS.has(checkoutProductId);

  if (isRedirectingToCheckout) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Taking you to checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
            Choose Your Pricing Plan
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Flexible pricing options to fit your needs. Pay-as-you-go credits or monthly subscriptions.
          </p>
        </div>

        {/* One-Time Credit Plans Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Pay-As-You-Go Plans
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              One-time purchases. Credits never expire. No subscriptions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600 rounded-lg">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Free Trial</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Try it out</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  11 credits (1 full analysis)
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All 4 AI providers included
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Competitor discovery included
                </li>
              </ul>
              <Link
                href={session?.user ? "/dashboard" : "/register"}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
              >
                {session?.user ? 'Go to Dashboard' : 'Start Free'}
              </Link>
            </div>

            {/* Single Analysis */}
            <div className="bg-white dark:bg-gray-800 p-8 border-2 border-blue-600 relative rounded-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-full">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Single Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">One-time purchase</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$49</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  53 credits (~4 full analyses)
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Credits never expire
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free competitor scraping
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All 4 AI providers
                </li>
              </ul>
              {session?.user ? (
                <PurchaseButton
                  productId="single-analysis"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-md"
                >
                  {isPending ? 'Loading...' : 'Buy Now'}
                </PurchaseButton>
              ) : (
                <Link
                  href="/login?redirect=/plans?checkout=single-analysis"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-md"
                >
                  Buy Now
                </Link>
              )}
            </div>

            {/* Credit Pack */}
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600 rounded-lg">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Credit Pack</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Best value</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$149</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  220 credits (20 full analyses)
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save 25% vs Single Analysis
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Credits never expire
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              {session?.user ? (
                <PurchaseButton
                  productId="credit-pack"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
                >
                  {isPending ? 'Loading...' : 'Buy Now'}
                </PurchaseButton>
              ) : (
                <Link
                  href="/login?redirect=/plans?checkout=credit-pack"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
                >
                  Buy Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Subscription Plans Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Monthly Subscription Plans
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Recurring monthly plans with automatic credit allocation and advanced features.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600 rounded-lg">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Starter</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for individuals</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$39</span>
                <span className="text-gray-600 dark:text-gray-400 text-lg ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  53 credits/month (~4 analyses)
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1 project & 1 brand
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free competitor scraping
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic tracking features
                </li>
              </ul>
              {session?.user ? (
                <PurchaseButton
                  productId="starter-monthly"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
                >
                  {isPending ? 'Loading...' : 'Subscribe'}
                </PurchaseButton>
              ) : (
                <Link
                  href="/login?redirect=/plans?checkout=starter-monthly"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
                >
                  Subscribe
                </Link>
              )}
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-gray-800 p-8 border-2 border-blue-600 relative rounded-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-full">
                Recommended
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Pro</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">For growing businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$69</span>
                <span className="text-gray-600 dark:text-gray-400 text-lg ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  154 credits/month (~14 analyses)
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited projects & brands
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free competitor scraping
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced tracking features
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  DataForSEO integration
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              {session?.user ? (
                <PurchaseButton
                  productId="pro-monthly"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-md"
                >
                  {isPending ? 'Loading...' : 'Subscribe'}
                </PurchaseButton>
              ) : (
                <Link
                  href="/login?redirect=/plans?checkout=pro-monthly"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-md"
                >
                  Subscribe
                </Link>
              )}
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600 rounded-lg">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Enterprise</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited credits
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited projects & brands
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All tracking features
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API access
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  White label options
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dedicated support
                </li>
              </ul>
              <Link
                href="mailto:support@aibrandtrack.com?subject=Enterprise%20Plan%20Inquiry"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How Credits Work</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">1 credit</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Website extraction</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-600 mb-1">FREE</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Competitor scraping</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">10 credits</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Full AI analysis</div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                Total: 11 credits per complete brand analysis
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Each analysis gives you comprehensive insights across all 4 major AI platforms: ChatGPT, Claude, Perplexity, and Gemini. Scrape unlimited competitors for free before running your analysis.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Pay-as-you-go credits never expire. Buy once, use anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}