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
    <div className="min-h-screen">
      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-24 pb-32">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl animate-pulse delay-700" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Track Your Brand Across 4+ AI Platforms
            </div>

            <h1 className="text-6xl lg:text-8xl font-black tracking-tight mb-8 animate-fade-in-up animation-delay-100">
              <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                AI Brand Track
              </span>
              <span className="block mt-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-5xl lg:text-7xl">
                See How AI Ranks Your Brand
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
              Monitor your brand visibility across <span className="font-semibold text-gray-900 dark:text-white">ChatGPT, Claude, Perplexity & Gemini</span>. Get real-time rankings, competitor analysis, and AI search optimization insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-400">
              <Link
                href="/brand-monitor"
                className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Start Free Analysis
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                View Pricing
              </Link>
            </div>

            <p className="mt-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-600 flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                10 free credits on signup
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Setup in 30 seconds
              </span>
            </p>
          </div>

          {/* Premium Stats Card */}
          <div className="mt-24 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[30px] blur-2xl opacity-20" />
            <div className="relative backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/20 dark:border-gray-700/20 rounded-[30px] p-12 shadow-2xl animate-fade-in-scale animation-delay-800">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center group cursor-default animate-fade-in-up animation-delay-1000">
                  <div className="text-5xl font-black bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">4+</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">AI Platforms</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">ChatGPT, Claude, Gemini, Perplexity</div>
                </div>
                <div className="text-center group cursor-default animate-fade-in-up animation-delay-1000" style={{animationDelay: '1100ms'}}>
                  <div className="text-5xl font-black bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">Real-time</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Live Analysis</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Instant brand visibility tracking</div>
                </div>
                <div className="text-center group cursor-default animate-fade-in-up animation-delay-1000" style={{animationDelay: '1200ms'}}>
                  <div className="text-5xl font-black bg-gradient-to-br from-pink-600 to-orange-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">100%</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Accurate</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Competitor benchmarking</div>
                </div>
                <div className="text-center group cursor-default animate-fade-in-up animation-delay-1000" style={{animationDelay: '1300ms'}}>
                  <div className="text-5xl font-black bg-gradient-to-br from-orange-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">24/7</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Monitoring</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">SEO & GEO optimization</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-[30px] p-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-blue-600 dark:text-blue-400">
                  Simple Pay-As-You-Go Pricing
                </span>
              </h2>
              <p className="text-xl text-zinc-600">
                No subscriptions. No complicated plans. Just simple credits for brand analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <div className="bg-white p-8 rounded-[20px] border border-zinc-200 animate-fade-in-up animation-delay-400 hover:scale-105 transition-all duration-200">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <p className="text-zinc-600 mb-6">Try it out</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1 free brand analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10 credits on signup
                </li>
                <li className="flex items-center">
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

            {/* Single Analysis - Featured */}
            <div className="bg-white p-8 rounded-[20px] border-2 border-blue-500 relative animate-fade-in-up animation-delay-600 hover:scale-105 transition-all duration-200">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Single Analysis</h3>
              <p className="text-zinc-600 mb-6">One-time purchase</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  50 credits (5 analyses)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No expiration
                </li>
                <li className="flex items-center">
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
            <div className="bg-white p-8 rounded-[20px] border border-zinc-200 animate-fade-in-up animation-delay-800 hover:scale-105 transition-all duration-200">
              <h3 className="text-2xl font-bold mb-2">Credit Pack</h3>
              <p className="text-zinc-600 mb-6">Best value</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$149</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  200 credits (20 analyses)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save 25%
                </li>
                <li className="flex items-center">
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

            <div className="text-center mt-12">
              <Link href="/plans" className="text-blue-600 hover:text-blue-700 font-medium">
                View detailed pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section - SEO Optimized */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">
              How AI Brand Visibility Tracking Works
            </h2>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Monitor your brand's presence across AI search platforms with comprehensive <Link href="/brand-monitor" className="text-blue-600 dark:text-blue-400 hover:underline">AI brand monitoring</Link> and <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">GEO optimization tools</Link>.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[20px] shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-2xl font-bold mb-4">Enter Your Website URL</h3>
              <p className="text-zinc-600">
                Start your AI brand visibility analysis by entering your website URL. Our system automatically extracts your brand information, keywords, and industry data to create comprehensive <Link href="/brand-monitor" className="text-blue-600 dark:text-blue-400 hover:underline">AI brand tracking reports</Link>.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[20px] shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-2xl font-bold mb-4">AI Models Analyze Your Brand</h3>
              <p className="text-zinc-600">
                We query ChatGPT, Claude, Perplexity, Gemini, and other major AI platforms simultaneously to see how they rank your brand. Get real-time AI brand visibility scores and competitor rankings across all AI search engines.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[20px] shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-2xl font-bold mb-4">Get Actionable Insights</h3>
              <p className="text-zinc-600">
                Receive detailed reports showing your AI brand visibility score, which prompts trigger your appearance, competitor analysis, and specific recommendations for <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">AI search optimization</Link> and <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">GEO improvement</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI Brand Visibility Matters - SEO Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-zinc-900 mb-6">
                Why AI Brand Visibility Monitoring Matters
              </h2>
              <p className="text-lg text-zinc-600 mb-6">
                As AI search platforms like ChatGPT, Claude, Perplexity, and Google Gemini become primary sources of information for millions of users, your brand's visibility in AI responses directly impacts your business growth. Traditional SEO is no longer enough—you need <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">AI search optimization</Link>.
              </p>
              <p className="text-lg text-zinc-600 mb-6">
                AI Brand Track helps you understand how AI models perceive and rank your brand. With comprehensive <Link href="/brand-monitor" className="text-blue-600 dark:text-blue-400 hover:underline">AI brand monitoring</Link>, you can identify opportunities to improve your AI presence, track competitor performance, and optimize your content for better AI search visibility. <Link href="/plans" className="text-blue-600 dark:text-blue-400 hover:underline">View our pricing plans</Link> to get started.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-600"><strong>Track AI Brand Rankings:</strong> See where your brand appears in AI responses across ChatGPT, Claude, Perplexity, Google Gemini, and more.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-600"><strong>Monitor Competitor Performance:</strong> Understand how your competitors rank in AI search results and identify gaps.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-600"><strong>Optimize for AI Search:</strong> Get specific recommendations to improve your AI brand visibility and GEO performance.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-600"><strong>Real-time Monitoring:</strong> Track changes in your AI brand visibility over time and measure the impact of your optimization efforts.</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-[30px] p-12">
              <h3 className="text-2xl font-bold text-zinc-900 mb-6">Key Features</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Multi-Platform AI Monitoring</h4>
                    <p className="text-zinc-600 text-sm">Track your brand across ChatGPT, Claude, Perplexity, Gemini, and more AI platforms.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Competitor Analysis</h4>
                    <p className="text-zinc-600 text-sm">Compare your AI brand visibility against competitors and identify ranking opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">AI Search Optimization</h4>
                    <p className="text-zinc-600 text-sm">Get actionable insights to improve your AI search visibility and GEO performance.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1">Real-time Analytics</h4>
                    <p className="text-zinc-600 text-sm">Monitor your AI brand visibility score and track changes over time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section 1 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-[30px] p-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              See How AI Models Rank Your Brand
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Monitor your brand visibility across ChatGPT, Claude, Perplexity, Google Gemini, and more. Start your free AI brand analysis today.
            </p>
            <Link
              href="/brand-monitor"
              className="btn-firecrawl-default inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
            >
              Start Free Analysis
            </Link>
          </div>
        </div>
      </section>


      {/* FAQs */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4 animate-fade-in-up">
              Frequently asked questions
            </h2>
            <p className="text-xl text-zinc-600 animate-fade-in-up animation-delay-200">
              Everything you need to know about AI Brand Track
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-400">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  How does AI Brand Track work?
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 0 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 0 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    AI Brand Track analyzes your brand's visibility across major AI platforms like ChatGPT, Claude, Perplexity, and Google Gemini. Simply enter your website URL, and we'll show you how AI models rank your brand against competitors, what prompts trigger your appearance, and provide actionable insights to improve your AI visibility.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-400" style={{animationDelay: '500ms'}}>
              <button
                onClick={() => toggleFaq(1)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  Which AI providers do you monitor?
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 1 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 1 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    We monitor all major AI platforms including OpenAI's ChatGPT, Anthropic's Claude, Perplexity, Google's Gemini, and more. Our system continuously updates as new AI providers emerge, ensuring you always have comprehensive visibility across the AI landscape.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-600">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  How often is the data updated?
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 2 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 2 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    Our monitoring runs in real-time. When you request an analysis, we query all AI providers simultaneously to get the most current results. You can run new analyses anytime to track changes in your brand visibility and see how your optimization efforts are performing.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-400" style={{animationDelay: '700ms'}}>
              <button
                onClick={() => toggleFaq(3)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  What insights will I get?
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 3 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 3 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    You'll see your brand's visibility score, competitor rankings, which prompts trigger your appearance, response quality analysis, and specific recommendations to improve your AI presence. The platform also tracks trends over time and alerts you to significant changes.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-800">
              <button
                onClick={() => toggleFaq(4)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  How many credits do I need?
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 4 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 4 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
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