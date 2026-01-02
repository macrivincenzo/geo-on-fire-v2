'use client';

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* Structured Data - SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Brand Track",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "url": "https://www.aibrandtrack.com",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "url": "https://www.aibrandtrack.com/plans"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            },
            "description": "Track how AI models like ChatGPT, Claude, Perplexity, and Google Gemini rank your brand. Monitor AI brand visibility, competitor analysis, and get actionable insights to improve your AI presence.",
            "featureList": [
              "AI Brand Visibility Monitoring",
              "ChatGPT Brand Tracking",
              "Claude Brand Monitoring",
              "Perplexity Brand Analysis",
              "Google Gemini Brand Monitoring",
              "Competitor Tracking",
              "Real-time Analysis",
              "Actionable Insights",
              "AI Search Optimization",
              "GEO Optimization"
            ],
            "screenshot": "https://www.aibrandtrack.com/og-image.png",
            "softwareVersion": "2.0",
            "releaseNotes": "Comprehensive AI brand monitoring across ChatGPT, Claude, Perplexity, and Google Gemini"
          })
        }}
      />
      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AI Brand Track",
            "url": "https://www.aibrandtrack.com",
            "logo": "https://www.aibrandtrack.com/logo.png",
            "description": "AI Brand Track helps businesses monitor their brand visibility across AI platforms like ChatGPT, Claude, Perplexity, and Google Gemini.",
            "sameAs": [
              "https://twitter.com/aibrandtrack",
              "https://github.com/aibrandtrack"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@aibrandtrack.com",
              "availableLanguage": "English"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.aibrandtrack.com/brand-monitor",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      {/* Structured Data - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does AI Brand Track work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI Brand Track analyzes your brand's visibility across major AI platforms like ChatGPT, Claude, Perplexity, and Google Gemini. Simply enter your website URL, and we'll show you how AI models rank your brand against competitors, what prompts trigger your appearance, and provide actionable insights to improve your AI visibility."
                }
              },
              {
                "@type": "Question",
                "name": "Which AI providers do you monitor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We monitor all major AI platforms including OpenAI's ChatGPT, Anthropic's Claude, Perplexity, Google's Gemini, and more. Our system continuously updates as new AI providers emerge, ensuring you always have comprehensive visibility across the AI landscape."
                }
              },
              {
                "@type": "Question",
                "name": "How often is the data updated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our monitoring runs in real-time. When you request an analysis, we query all AI providers simultaneously to get the most current results. You can run new analyses anytime to track changes in your brand visibility and see how your optimization efforts are performing."
                }
              },
              {
                "@type": "Question",
                "name": "What insights will I get?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You'll see your brand's visibility score, competitor rankings, which prompts trigger your appearance, response quality analysis, and specific recommendations to improve your AI presence. The platform also tracks trends over time and alerts you to significant changes."
                }
              },
              {
                "@type": "Question",
                "name": "How many credits do I need?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Each brand analysis uses 10 credits (1 credit for initial URL analysis, 9 credits for the full AI provider scan). The free tier includes 100 credits monthly, enough for 10 complete analyses. Pro plans include unlimited analyses for comprehensive monitoring."
                }
              }
            ]
          })
        }}
      />
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section - Clean & Minimal */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Clean centered content */}
          <div className="text-center">
            {/* Simple badge */}
            <div className="inline-block mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                Track Your Brand Across 4+ AI Platforms
              </span>
            </div>

            {/* Clean headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              Monitor Your AI Brand
              <br />
              <span className="text-blue-600">Visibility</span>
            </h1>

            {/* Simple description */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed px-4">
              See how ChatGPT, Claude, Perplexity & Gemini rank your brand against competitors. Get actionable insights to improve your AI presence.
            </p>

            {/* Clean CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/brand-monitor"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Start Free Analysis
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 dark:text-white bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
              >
                View Pricing
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>✓ No credit card required</span>
              <span>✓ 10 free credits</span>
              <span>✓ 30 second setup</span>
            </div>
          </div>

          {/* Clean Stats Grid */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-t border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">4+</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Platforms</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">ChatGPT, Claude, Gemini, Perplexity</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Real-time</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Live Analysis</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Instant visibility tracking</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">100%</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Accurate</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Competitor benchmarking</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Monitoring</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">SEO & GEO optimization</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean Minimal */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Pay-As-You-Go Pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
              No subscriptions. No complicated plans. Just simple credits for brand analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free Trial</h3>
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
                href="/register"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Single Analysis - Featured */}
            <div className="bg-white dark:bg-gray-900 p-8 border-2 border-blue-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Single Analysis</h3>
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
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Buy Now
              </Link>
            </div>

            {/* Credit Pack */}
            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Credit Pack</h3>
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
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Buy Now
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/plans" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
              View detailed pricing →
            </Link>
          </div>
        </div>
      </section>


      {/* How It Works Section - Clean Minimal */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How AI Brand Visibility Tracking Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Monitor your brand's presence across AI search platforms with comprehensive <Link href="/brand-monitor" className="text-blue-600 hover:text-blue-700 transition-colors">AI brand monitoring</Link> and <Link href="/about" className="text-blue-600 hover:text-blue-700 transition-colors">GEO optimization tools</Link>.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enter Your Website URL</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start your AI brand visibility analysis by entering your website URL. Our system automatically extracts your brand information, keywords, and industry data to create comprehensive <Link href="/brand-monitor" className="text-blue-600 hover:text-blue-700 transition-colors">AI brand tracking reports</Link>.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Models Analyze Your Brand</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We query ChatGPT, Claude, Perplexity, Gemini, and other major AI platforms simultaneously to see how they rank your brand. Get real-time AI brand visibility scores and competitor rankings across all AI search engines.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get Actionable Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive detailed reports showing your AI brand visibility score, which prompts trigger your appearance, competitor analysis, and specific recommendations for <Link href="/blog" className="text-blue-600 hover:text-blue-700 transition-colors">AI search optimization</Link> and <Link href="/about" className="text-blue-600 hover:text-blue-700 transition-colors">GEO improvement</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI Brand Visibility Matters - Clean Minimal */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why AI Brand Visibility Monitoring Matters
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                As AI search platforms like ChatGPT, Claude, Perplexity, and Google Gemini become primary sources of information for millions of users, your brand's visibility in AI responses directly impacts your business growth. Traditional SEO is no longer enough—you need <Link href="/blog" className="text-blue-600 hover:text-blue-700 transition-colors">AI search optimization</Link>.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                AI Brand Track helps you understand how AI models perceive and rank your brand. With comprehensive <Link href="/brand-monitor" className="text-blue-600 hover:text-blue-700 transition-colors">AI brand monitoring</Link>, you can identify opportunities to improve your AI presence, track competitor performance, and optimize your content for better AI search visibility. <Link href="/plans" className="text-blue-600 hover:text-blue-700 transition-colors">View our pricing plans</Link> to get started.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Track AI Brand Rankings:</strong> See where your brand appears in AI responses across ChatGPT, Claude, Perplexity, Google Gemini, and more.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Monitor Competitor Performance:</strong> Understand how your competitors rank in AI search results and identify gaps.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Optimize for AI Search:</strong> Get specific recommendations to improve your AI brand visibility and GEO performance.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Real-time Monitoring:</strong> Track changes in your AI brand visibility over time and measure the impact of your optimization efforts.</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 p-12 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Multi-Platform AI Monitoring</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Track your brand across ChatGPT, Claude, Perplexity, Gemini, and more AI platforms.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Competitor Analysis</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Compare your AI brand visibility against competitors and identify ranking opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI Search Optimization</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Get actionable insights to improve your AI search visibility and GEO performance.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Real-time Analytics</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Monitor your AI brand visibility score and track changes over time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean Minimal */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 dark:bg-blue-700 p-8 sm:p-12 md:p-16 text-center border-2 border-blue-700 dark:border-blue-600">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              See How AI Models Rank Your Brand
            </h2>
            <p className="text-lg sm:text-xl text-blue-50 mb-8 px-4">
              Monitor your brand visibility across ChatGPT, Claude, Perplexity, Google Gemini, and more. Start your free AI brand analysis today.
            </p>
            <Link
              href="/brand-monitor"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Start Free Analysis
            </Link>
          </div>
        </div>
      </section>


      {/* FAQs - Clean Minimal */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
              Everything you need to know about AI Brand Track
            </p>
          </div>

          <div className="space-y-3">
            {/* FAQ 1 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  How does AI Brand Track work?
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${openFaq === 0 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 0 && (
                <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    AI Brand Track analyzes your brand's visibility across major AI platforms like ChatGPT, Claude, Perplexity, and Google Gemini. Simply enter your website URL, and we'll show you how AI models rank your brand against competitors, what prompts trigger your appearance, and provide actionable insights to improve your AI visibility.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Which AI providers do you monitor?
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${openFaq === 1 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 1 && (
                <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We monitor all major AI platforms including OpenAI's ChatGPT, Anthropic's Claude, Perplexity, Google's Gemini, and more. Our system continuously updates as new AI providers emerge, ensuring you always have comprehensive visibility across the AI landscape.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  How often is the data updated?
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${openFaq === 2 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 2 && (
                <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Our monitoring runs in real-time. When you request an analysis, we query all AI providers simultaneously to get the most current results. You can run new analyses anytime to track changes in your brand visibility and see how your optimization efforts are performing.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  What insights will I get?
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${openFaq === 3 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 3 && (
                <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    You'll see your brand's visibility score, competitor rankings, which prompts trigger your appearance, response quality analysis, and specific recommendations to improve your AI presence. The platform also tracks trends over time and alerts you to significant changes.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleFaq(4)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  How many credits do I need?
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${openFaq === 4 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 4 && (
                <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Each brand analysis uses 10 credits (1 credit for initial URL analysis, 9 credits for the full AI provider scan). The free tier includes 100 credits monthly, enough for 10 complete analyses. Pro plans include unlimited analyses for comprehensive monitoring.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Monitoring Your AI Brand Visibility Today
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Take control of how AI models present your brand. Get comprehensive AI brand monitoring, competitor tracking, and actionable insights for AI search optimization and GEO improvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/brand-monitor"
              className="btn-firecrawl-orange inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
            >
              Analyze Your Brand
            </Link>
            <Link
              href="/plans"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8 bg-zinc-800 text-white hover:bg-zinc-700"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}