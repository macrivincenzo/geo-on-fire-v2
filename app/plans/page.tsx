'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-tr from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Simple Pay-As-You-Go Pricing
            </span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            No subscriptions. No complicated plans. Just simple credits for brand analysis.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 border border-zinc-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Free Trial</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Try it out</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">$0</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                1 free brand analysis
              </li>
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                10 credits on signup
              </li>
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All AI providers
              </li>
            </ul>
            <Link
              href="/register"
              className="btn-firecrawl-outline w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
            >
              Start Free
            </Link>
          </div>

          {/* Single Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 border-2 border-orange-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Single Analysis</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">One-time purchase</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">$49</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                50 credits (5 analyses)
              </li>
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No expiration
              </li>
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full AI coverage
              </li>
            </ul>
            <Link
              href="/register"
              className="btn-firecrawl-orange w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
            >
              Buy Now
            </Link>
          </div>

          {/* Credit Pack */}
          <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-lg p-8 border border-zinc-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Credit Pack</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Best value</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">$149</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                200 credits (20 analyses)
              </li>
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save 25%
              </li>
              <li className="flex items-center text-zinc-700 dark:text-zinc-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
            </ul>
            <Link
              href="/register"
              className="btn-firecrawl-outline w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
            >
              Buy Now
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">How Credits Work</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Each brand analysis costs 10 credits. One analysis gives you comprehensive insights across all major AI platforms including ChatGPT, Claude, Perplexity, and Gemini.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Credits never expire. Buy once, use anytime. No subscriptions, no recurring charges.
          </p>
        </div>
      </div>
    </div>
  );
}