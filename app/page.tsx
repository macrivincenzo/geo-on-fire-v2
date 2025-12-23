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
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
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
            ]
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
            "url": "https://aibrandtrack.com",
            "logo": "https://aibrandtrack.com/logo.png",
            "description": "AI Brand Track helps businesses monitor their brand visibility across AI platforms like ChatGPT, Claude, Perplexity, and Google Gemini.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@aibrandtrack.com"
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-24">
        
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 animate-fade-in-up">
              <span className="block text-zinc-900 dark:text-zinc-100">AI Brand Track</span>
              <span className="block text-blue-600 dark:text-blue-400">
                Monitor Your AI Brand Visibility Across ChatGPT, Claude, Perplexity & Gemini
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-6 animate-fade-in-up animation-delay-200">
              Track how AI models rank your brand against competitors. Get real-time AI brand visibility scores, competitor analysis, and actionable insights to improve your AI search optimization and GEO performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link
                href="/brand-monitor"
                className="btn-firecrawl-orange inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
              >
                Start Brand Analysis
              </Link>
              <Link
                href="/plans"
                className="btn-firecrawl-default inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 animate-fade-in-up animation-delay-600">
              Powered by AI • Real-time AI Brand Analysis • Competitor Tracking • AI Search Optimization • GEO Tracking
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 bg-zinc-900 rounded-[20px] p-12 animate-fade-in-scale animation-delay-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center animate-fade-in-up animation-delay-1000">
                <div className="text-4xl font-bold text-white">ChatGPT</div>
                <div className="text-sm text-zinc-400 mt-1">Claude, Perplexity, Gemini & More</div>
              </div>
              <div className="text-center animate-fade-in-up animation-delay-1000" style={{animationDelay: '1100ms'}}>
                <div className="text-4xl font-bold text-white">Real-time</div>
                <div className="text-sm text-zinc-400 mt-1">AI Brand Analysis</div>
              </div>
              <div className="text-center animate-fade-in-up animation-delay-1000" style={{animationDelay: '1200ms'}}>
                <div className="text-4xl font-bold text-white">Competitor</div>
                <div className="text-sm text-zinc-400 mt-1">Tracking & Rankings</div>
              </div>
              <div className="text-center animate-fade-in-up animation-delay-1000" style={{animationDelay: '1300ms'}}>
                <div className="text-4xl font-bold text-white">Actionable</div>
                <div className="text-sm text-zinc-400 mt-1">SEO & GEO Insights</div>
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
              Monitor your brand's presence across AI search platforms with comprehensive AI brand monitoring and GEO optimization tools.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[20px] shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-2xl font-bold mb-4">Enter Your Website URL</h3>
              <p className="text-zinc-600">
                Start your AI brand visibility analysis by entering your website URL. Our system automatically extracts your brand information, keywords, and industry data to create comprehensive AI brand tracking reports.
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
                Receive detailed reports showing your AI brand visibility score, which prompts trigger your appearance, competitor analysis, and specific recommendations for AI search optimization and GEO improvement.
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
                As AI search platforms like ChatGPT, Claude, Perplexity, and Google Gemini become primary sources of information for millions of users, your brand's visibility in AI responses directly impacts your business growth. Traditional SEO is no longer enough—you need AI search optimization.
              </p>
              <p className="text-lg text-zinc-600 mb-6">
                AI Brand Track helps you understand how AI models perceive and rank your brand. With comprehensive AI brand monitoring, you can identify opportunities to improve your AI presence, track competitor performance, and optimize your content for better AI search visibility.
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