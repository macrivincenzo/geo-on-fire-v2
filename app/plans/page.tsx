'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// Dynamically import PurchaseButton to avoid SSR issues with useCustomer hook
const PurchaseButton = dynamic(
  () => import('@/components/plans/purchase-button'),
  {
    ssr: false,
    loading: () => <Button disabled className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 transition-colors opacity-50">Loading...</Button>
  }
);

export default function PricingPage() {
  const { data: session, isPending } = useSession();


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
            Simple Pay-As-You-Go Pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            No subscriptions. No complicated plans. Just simple credits for brand analysis.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600">
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
                1 free brand analysis
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                10 credits on signup
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All AI providers
              </li>
            </ul>
            <Link
              href={session?.user ? "/dashboard" : "/register"}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {session?.user ? 'Go to Dashboard' : 'Start Free'}
            </Link>
          </div>

          {/* Single Analysis */}
          <div className="bg-white dark:bg-gray-800 p-8 border-2 border-blue-600 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
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
                50 credits (5 analyses)
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No expiration
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full AI coverage
              </li>
            </ul>
            {session?.user ? (
              <PurchaseButton
                productId="single-analysis"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {isPending ? 'Loading...' : 'Buy Now'}
              </PurchaseButton>
            ) : (
              <Link
                href="/login?redirect=/plans"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Buy Now
              </Link>
            )}
          </div>

          {/* Credit Pack */}
          <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600">
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
                200 credits (20 analyses)
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save 25%
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
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isPending ? 'Loading...' : 'Buy Now'}
              </PurchaseButton>
            ) : (
              <Link
                href="/login?redirect=/plans"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Buy Now
              </Link>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How Credits Work</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Each brand analysis costs 10 credits. One analysis gives you comprehensive insights across all major AI platforms including ChatGPT, Claude, Perplexity, and Gemini.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Credits never expire. Buy once, use anytime. No subscriptions, no recurring charges.
          </p>
        </div>
      </div>
    </div>
  );
}