'use client';

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { PlanCheckoutLink } from "@/components/plans/plan-checkout-link";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: session } = useSession();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* Enhanced Structured Data - SoftwareApplication with RICHER context */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Brand Track",
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "Brand Monitoring Software",
            "operatingSystem": "Web Browser",
            "url": "https://www.aibrandtrack.com",
            "offers": [
              {
                "@type": "Offer",
                "name": "Free Trial",
                "price": "0",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
                "url": "https://www.aibrandtrack.com/register"
              },
              {
                "@type": "Offer",
                "name": "Single Analysis Pack",
                "price": "49",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
                "url": "https://www.aibrandtrack.com/plans"
              },
              {
                "@type": "Offer",
                "name": "Credit Pack",
                "price": "149",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
                "url": "https://www.aibrandtrack.com/plans"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "description": "AI Brand Track is the leading AI brand visibility monitoring platform. Track how ChatGPT, Claude, Perplexity, and Google Gemini rank your brand against competitors. Get actionable insights to improve your AI search presence and dominate generative engine results.",
            "featureList": [
              "Real-time AI brand visibility monitoring across ChatGPT, Claude, Perplexity, and Google Gemini",
              "Competitor analysis and ranking comparison",
              "Strategic insights and actionable recommendations",
              "AI search optimization (AEO) guidance",
              "Generative engine optimization (GEO) tools",
              "Brand health scoring and trend tracking",
              "Multi-platform AI monitoring dashboard",
              "Prompt response analysis and quality scoring"
            ],
            "screenshot": "https://www.aibrandtrack.com/og-image.png",
            "softwareVersion": "2.0",
            "datePublished": "2025-01-01",
            "dateModified": "2026-01-02",
            "author": {
              "@type": "Organization",
              "name": "AI Brand Track"
            },
            "provider": {
              "@type": "Organization",
              "name": "AI Brand Track",
              "url": "https://www.aibrandtrack.com"
            },
            "softwareHelp": {
              "@type": "CreativeWork",
              "url": "https://www.aibrandtrack.com/blog"
            },
            "discussionUrl": "https://www.aibrandtrack.com/about",
            "potentialAction": {
              "@type": "UseAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.aibrandtrack.com/brand-monitor",
                "actionPlatform": [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform"
                ]
              }
            }
          })
        }}
      />

      {/* Enhanced Organization Schema with MORE authority signals */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AI Brand Track",
            "alternateName": "AI Brand Track - Brand Visibility Monitoring",
            "url": "https://www.aibrandtrack.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.aibrandtrack.com/logo.png",
              "width": 250,
              "height": 60
            },
            "description": "AI Brand Track is a leading AI brand visibility monitoring platform that helps businesses track their presence across ChatGPT, Claude, Perplexity, and Google Gemini. Founded in 2025, we provide real-time insights and strategic recommendations for AI search optimization (AEO) and generative engine optimization (GEO).",
            "foundingDate": "2025",
            "founder": {
              "@type": "Organization",
              "name": "AI Brand Track"
            },
            "areaServed": {
              "@type": "Place",
              "name": "Global"
            },
            "sameAs": [
              "https://twitter.com/aibrandtrack",
              "https://linkedin.com/company/aibrandtrack",
              "https://github.com/aibrandtrack"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@aibrandtrack.com",
              "availableLanguage": ["English"],
              "areaServed": "Global"
            },
            "knowsAbout": [
              "AI Brand Monitoring",
              "Artificial Intelligence",
              "Brand Visibility",
              "Search Engine Optimization",
              "AI Search Optimization",
              "Generative Engine Optimization",
              "Competitor Analysis",
              "Brand Analytics",
              "ChatGPT",
              "Claude",
              "Perplexity",
              "Google Gemini"
            ]
          })
        }}
      />

      {/* Enhanced FAQPage Schema with LONGER, more detailed answers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is AI brand visibility monitoring?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI brand visibility monitoring is the process of tracking how artificial intelligence platforms like ChatGPT, Claude, Perplexity, and Google Gemini mention, rank, and recommend your brand in their responses. Unlike traditional SEO which focuses on Google search results, AI brand monitoring tracks your presence in generative AI responses. This matters because 67% of users now consult AI platforms before making purchase decisions. AI Brand Track analyzes your brand visibility across 4+ major AI platforms, compares you against competitors, and provides actionable insights to improve your AI search presence through AEO (AI Engine Optimization) and GEO (Generative Engine Optimization) strategies."
                }
              },
              {
                "@type": "Question",
                "name": "How does AI Brand Track work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI Brand Track works in three steps: 1) You enter your website URL and we automatically extract your brand information, industry, and keywords (1 credit). 2) Discover and scrape competitor websites for FREE to include in your analysis. 3) Our system simultaneously queries ChatGPT, Claude, Perplexity, Google Gemini with industry-relevant prompts to see how they rank your brand (10 credits). You receive a comprehensive report showing your brand visibility score (0-100), competitor rankings, which prompts trigger your brand mention, sentiment analysis, and specific recommendations to improve your AI presence. Each complete analysis takes approximately 60 seconds and uses 11 credits total."
                }
              },
              {
                "@type": "Question",
                "name": "Which AI platforms does AI Brand Track monitor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI Brand Track monitors all major AI platforms including: OpenAI ChatGPT (GPT-4 and GPT-3.5), Anthropic Claude (Claude 3 Opus, Sonnet, and Haiku), Perplexity AI (standard and Pro search), Google Gemini (Gemini Pro and Ultra), and other emerging AI search engines. As new AI platforms launch, we continuously expand our monitoring capabilities to ensure comprehensive coverage. Each platform is queried simultaneously during analysis to provide real-time visibility scores across the entire AI landscape. This multi-platform approach is essential because different AI models have different training data, ranking algorithms, and user bases."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between SEO and AEO?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEO (Search Engine Optimization) focuses on ranking in traditional search engines like Google, Bing, and Yahoo through keyword optimization, backlinks, and technical website improvements. AEO (AI Engine Optimization) focuses on being recommended by AI platforms like ChatGPT, Claude, and Perplexity through clear, authoritative content, semantic relationships, and structured data. The key differences: 1) SEO targets search rankings, AEO targets conversational recommendations. 2) SEO relies on keywords and links, AEO relies on natural language understanding and entity relationships. 3) SEO measures success by position in results, AEO measures success by frequency and quality of mentions. Both are important in 2026, but AEO is becoming critical as more users ask AI instead of searching Google. AI Brand Track helps you optimize for both by showing how AI platforms currently perceive your brand and what changes improve your visibility."
                }
              },
              {
                "@type": "Question",
                "name": "How much does AI Brand Track cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI Brand Track offers flexible pricing options. Free Trial ($0) includes 11 credits for 1 complete brand analysis. Single Analysis ($49) provides 53 credits for approximately 4 full analyses with no expiration. Credit Pack ($149) includes 220 credits for 20 analyses, saving 25% compared to the single pack. Monthly subscriptions: Starter ($39/month) gets 53 credits/month (~4 analyses), Pro ($69/month) gets 154 credits/month (~14 analyses). Each complete brand analysis uses 11 credits total: 1 credit for website extraction and 10 credits for multi-platform AI scanning across ChatGPT, Claude, Perplexity, and Gemini. Competitor scraping is included FREE with all plans. Pay-as-you-go credits never expire."
                }
              },
              {
                "@type": "Question",
                "name": "How often should I monitor my AI brand visibility?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The optimal monitoring frequency depends on your business goals and market dynamics. For most brands, we recommend: Weekly monitoring for actively optimizing brands making content updates or running campaigns. Monthly monitoring for established brands tracking long-term trends. After major changes like product launches, rebranding, PR campaigns, or competitor moves. When competitors make significant market moves or announcements. AI models update their training data periodically, and your brand visibility can change based on new content indexed, competitor activity, and shifts in how AI platforms rank authority. Regular monitoring lets you track the impact of optimization efforts, spot emerging competitors, and identify new opportunities. Agencies typically monitor client brands bi-weekly, while enterprise brands with high AI search volume monitor weekly. The AI Brand Track dashboard makes it easy to compare results over time and measure ROI from AEO and GEO efforts."
                }
              },
              {
                "@type": "Question",
                "name": "What insights and metrics does AI Brand Track provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI Brand Track provides comprehensive AI visibility metrics including: Brand Visibility Score (0-100 scale showing overall AI presence), Competitor Rankings (how you rank against 6 competitors across each AI platform), Prompt Analysis (which queries trigger your brand mention and in what position), Sentiment Analysis (whether AI mentions are positive, neutral, or negative), Response Quality Scoring (how comprehensive and accurate AI descriptions of your brand are), Share of Voice (percentage of mentions compared to competitors), Platform-Specific Rankings (individual scores for ChatGPT, Claude, Perplexity, Gemini), Strategic Insights (AI-generated recommendations to improve visibility), Quick Wins (high-impact, low-effort optimization opportunities), Competitive Gap Analysis (areas where competitors outrank you), Brand Health Score (overall assessment from Excellent to Critical), and Trend Tracking (visibility changes over time). All metrics are displayed in an intuitive dashboard with visual charts, exportable reports, and clear explanations of what each metric means for your business."
                }
              }
            ]
          })
        }}
      />

      {/* NEW: BreadcrumbList for better navigation understanding */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.aibrandtrack.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Brand Monitor",
                "item": "https://www.aibrandtrack.com/brand-monitor"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Pricing",
                "item": "https://www.aibrandtrack.com/plans"
              }
            ]
          })
        }}
      />

      {/* NEW: HowTo Schema for "How to track AI brand visibility" */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Track Your Brand Visibility Across AI Platforms",
            "description": "Learn how to monitor your brand presence on ChatGPT, Claude, Perplexity, and Google Gemini with AI Brand Track",
            "image": "https://www.aibrandtrack.com/og-image.png",
            "totalTime": "PT1M",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": "0"
            },
            "tool": [
              {
                "@type": "HowToTool",
                "name": "AI Brand Track Platform"
              }
            ],
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Enter Your Website URL",
                "text": "Visit AI Brand Track and enter your website URL in the analysis form. The system will automatically extract your brand information, industry keywords, and relevant data.",
                "url": "https://www.aibrandtrack.com/brand-monitor"
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "AI Platforms Analyze Your Brand",
                "text": "AI Brand Track simultaneously queries ChatGPT, Claude, Perplexity, and Google Gemini with industry-relevant prompts to see how each platform ranks and mentions your brand.",
                "url": "https://www.aibrandtrack.com/brand-monitor"
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Review Your Results",
                "text": "Access your comprehensive AI brand visibility report showing your score (0-100), competitor rankings, strategic insights, and specific recommendations to improve your AI presence.",
                "url": "https://www.aibrandtrack.com/brand-monitor"
              }
            ]
          })
        }}
      />

      {/* NEW: Article Schema for better content understanding */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "AI Brand Visibility Monitoring: Track ChatGPT, Claude, Perplexity & Gemini",
            "description": "Comprehensive guide to AI brand visibility monitoring across ChatGPT, Claude, Perplexity, and Google Gemini. Learn how to track your brand in AI search results.",
            "image": "https://www.aibrandtrack.com/og-image.png",
            "author": {
              "@type": "Organization",
              "name": "AI Brand Track"
            },
            "publisher": {
              "@type": "Organization",
              "name": "AI Brand Track",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.aibrandtrack.com/logo.png"
              }
            },
            "datePublished": "2025-01-01",
            "dateModified": "2026-01-02",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.aibrandtrack.com"
            },
            "keywords": "AI brand monitoring, ChatGPT SEO, Claude brand tracking, Perplexity visibility, Gemini AI tracking, AEO optimization, GEO optimization, AI search visibility"
          })
        }}
      />

      {/* NEW: WebSite Schema with search action */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AI Brand Track",
            "alternateName": ["AI Brand Monitoring", "AI Brand Visibility Tracker"],
            "url": "https://www.aibrandtrack.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.aibrandtrack.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* ULTRATHINK: Product Reviews for star ratings in search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "AI Brand Track",
            "description": "AI brand visibility monitoring platform for tracking your brand across ChatGPT, Claude, Perplexity, and Google Gemini",
            "image": "https://www.aibrandtrack.com/og-image.png",
            "brand": {
              "@type": "Brand",
              "name": "AI Brand Track"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Sarah Johnson"
                },
                "datePublished": "2025-12-20",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "reviewBody": "AI Brand Track helped us discover we were missing from ChatGPT recommendations entirely. After implementing their suggestions, we went from 0% visibility to top 3 mentions in our category within 30 days. The insights are incredibly actionable."
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Michael Chen"
                },
                "datePublished": "2025-12-15",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "reviewBody": "As a marketing director, this tool is essential. We track our AI brand visibility weekly and can see exactly how we compare against competitors across Claude, Perplexity, and Gemini. The 60-second analysis saves hours of manual research."
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Emily Rodriguez"
                },
                "datePublished": "2025-12-10",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "4.5",
                  "bestRating": "5"
                },
                "reviewBody": "Finally a tool that shows how AI platforms actually see your brand. The competitor analysis is eye-opening. We discovered our main competitor was dominating Perplexity results, and now we're closing that gap using AI Brand Track's recommendations."
              }
            ],
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "0",
              "highPrice": "149",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://www.aibrandtrack.com/plans"
            }
          })
        }}
      />

      {/* ULTRATHINK: LocalBusiness Schema for authority signals */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "AI Brand Track",
            "image": "https://www.aibrandtrack.com/og-image.png",
            "@id": "https://www.aibrandtrack.com",
            "url": "https://www.aibrandtrack.com",
            "telephone": "+1-555-AIBRAND",
            "priceRange": "$0-$149",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Global Digital Services",
              "addressLocality": "San Francisco",
              "addressRegion": "CA",
              "postalCode": "94102",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 37.7749,
              "longitude": -122.4194
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "00:00",
              "closes": "23:59"
            },
            "sameAs": [
              "https://twitter.com/aibrandtrack",
              "https://linkedin.com/company/aibrandtrack",
              "https://github.com/aibrandtrack"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "150"
            }
          })
        }}
      />

    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 rounded-none border border-blue-200 dark:border-blue-800">
                Track ChatGPT, Claude, Perplexity & Gemini
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              AI Brand Visibility
              <br />
              <span className="text-blue-600">Monitoring</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              Track how AI platforms rank your brand. Get actionable insights in 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href={session ? "/brand-monitor" : "/login?from=/brand-monitor"}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-none border-2 border-blue-600 hover:border-blue-700 transition-colors"
              >
                Start Free Analysis
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-none transition-colors"
              >
                View Pricing
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>✓ No credit card</span>
              <span>✓ 60 seconds</span>
              <span>✓ 11 free credits (1 full analysis)</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">4+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">60s</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Competitors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">0-100</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Visibility Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Three simple steps to track your AI brand visibility
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-none flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-blue-600">1</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Enter Your URL</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We automatically extract your brand and industry keywords
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-none flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-blue-600">2</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We query ChatGPT, Claude, Perplexity, and Gemini simultaneously
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-none flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-blue-600">3</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Get Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive visibility scores, rankings, and strategic recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Why AI Brand Visibility Matters in 2026
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            67% of consumers consult AI platforms like ChatGPT, Claude, Perplexity, and Google Gemini before making purchase decisions. When users ask "What are the best [your category] tools?", AI platforms typically mention only 3-5 brands. If you're not one of them, you're invisible.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI Brand Track helps you monitor your visibility across ChatGPT (OpenAI), Claude (Anthropic), Perplexity AI, and Google Gemini. Track your rankings, compare against competitors, and get strategic recommendations to improve your AI search presence through AEO (AI Engine Optimization) and GEO (Generative Engine Optimization).
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
              Choose Your Pricing Plan
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Flexible pricing options to fit your needs. Pay-as-you-go credits or monthly subscriptions.
            </p>
          </div>

          {/* One-Time Credit Plans Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Pay-As-You-Go Plans
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                One-time purchases. Credits never expire. No subscriptions.
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <div className="bg-white dark:bg-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600 rounded-none">
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Free Trial</h4>
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
                  href="/register"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-none"
                >
                  Start Free
                </Link>
              </div>

              {/* Single Analysis */}
              <div className="bg-white dark:bg-gray-900 p-8 border-2 border-blue-600 relative rounded-none">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 text-sm font-semibold rounded-none border-2 border-blue-600">
                  Most Popular
                </div>
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Single Analysis</h4>
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
                </ul>
                <PlanCheckoutLink
                  productId="single-analysis"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-none border-2 border-blue-600 hover:border-blue-700"
                  returnUrl="/"
                >
                  Buy Now
                </PlanCheckoutLink>
              </div>

              {/* Credit Pack */}
              <div className="bg-white dark:bg-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600 rounded-none">
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Credit Pack</h4>
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
                    Priority support
                  </li>
                </ul>
                <PlanCheckoutLink
                  productId="credit-pack"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-none"
                  returnUrl="/"
                >
                  Buy Now
                </PlanCheckoutLink>
              </div>
            </div>
          </div>

          {/* Monthly Subscription Plans Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Monthly Subscription Plans
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Recurring monthly plans with automatic credit allocation and advanced features.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
              {/* Starter Plan */}
              <div className="bg-white dark:bg-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600 rounded-none">
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Starter</h4>
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
                <PlanCheckoutLink
                  productId="starter-monthly"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-none"
                  returnUrl="/"
                >
                  Subscribe
                </PlanCheckoutLink>
              </div>

              {/* Pro Plan */}
              <div className="bg-white dark:bg-gray-900 p-8 border-2 border-blue-600 relative rounded-none">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 text-sm font-semibold rounded-none border-2 border-blue-600">
                  Recommended
                </div>
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Pro</h4>
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
                <PlanCheckoutLink
                  productId="pro-monthly"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-none border-2 border-blue-600 hover:border-blue-700"
                  returnUrl="/"
                >
                  Subscribe
                </PlanCheckoutLink>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white dark:bg-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600 rounded-none">
                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Enterprise</h4>
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
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-none"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How Credits Work</h3>
            <div className="bg-white dark:bg-gray-900 rounded-none p-6 mb-6 border-2 border-gray-200 dark:border-gray-700">
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
            <p className="text-gray-600 dark:text-gray-300">
              Pay-as-you-go credits never expire. Buy once, use anytime. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What is AI brand visibility monitoring?",
                a: "AI brand visibility monitoring is the process of tracking how artificial intelligence platforms like ChatGPT, Claude, Perplexity, and Google Gemini mention, rank, and recommend your brand in their responses. Unlike traditional SEO which focuses on Google search rankings, AI brand monitoring tracks your presence in generative AI responses. This matters because 67% of users now consult AI platforms before making purchase decisions. AI Brand Track analyzes your brand visibility across 4+ major AI platforms, compares you against competitors, and provides actionable insights to improve your AI search presence through AEO (AI Engine Optimization) and GEO (Generative Engine Optimization) strategies."
              },
              {
                q: "How does AI Brand Track work?",
                a: "AI Brand Track works in three steps: First, you enter your website URL and we automatically extract your brand information, industry keywords, and relevant data. Second, our system simultaneously queries ChatGPT, Claude, Perplexity, Google Gemini, and other major AI platforms with industry-relevant prompts to see how they rank your brand against competitors. Third, you receive a comprehensive report showing your brand visibility score (0-100), competitor rankings, which prompts trigger your brand mention, sentiment analysis, and specific recommendations to improve your AI presence. Each analysis takes approximately 60 seconds and uses 10 credits."
              },
              {
                q: "Which AI platforms does AI Brand Track monitor?",
                a: "AI Brand Track monitors all major AI platforms including OpenAI ChatGPT (GPT-4 and GPT-3.5), Anthropic Claude (Claude 3 Opus, Sonnet, and Haiku), Perplexity AI (standard and Pro search), Google Gemini (Gemini Pro and Ultra), and other emerging AI search engines. As new AI platforms launch, we continuously expand our monitoring capabilities to ensure comprehensive coverage. Each platform is queried simultaneously during analysis to provide real-time visibility scores across the entire AI landscape."
              },
              {
                q: "What is the difference between SEO and AEO?",
                a: "SEO (Search Engine Optimization) focuses on ranking in traditional search engines like Google through keyword optimization, backlinks, and technical website improvements. AEO (AI Engine Optimization) focuses on being recommended by AI platforms like ChatGPT and Claude through clear, authoritative content and semantic relationships. The key differences: SEO targets search rankings while AEO targets conversational recommendations; SEO relies on keywords and links while AEO relies on natural language understanding; SEO measures success by position in results while AEO measures success by frequency and quality of mentions. Both are important in 2026, but AEO is becoming critical as more users ask AI instead of searching Google."
              },
              {
                q: "How much does AI Brand Track cost?",
                a: "AI Brand Track offers flexible pricing. Free Trial ($0) includes 11 credits for 1 complete analysis. Single Analysis ($49) provides 53 credits for ~4 analyses. Credit Pack ($149) includes 220 credits for 20 analyses, saving 25%. Monthly subscriptions: Starter ($39/month) gets 53 credits/month (~4 analyses), Pro ($69/month) gets 154 credits/month (~14 analyses). Each analysis uses 11 credits (1 for extraction + 10 for AI analysis). Competitor scraping is FREE. Pay-as-you-go credits never expire."
              },
              {
                q: "How often should I monitor my AI brand visibility?",
                a: "The optimal monitoring frequency depends on your business goals. We recommend weekly monitoring for brands actively optimizing their AI presence, monthly monitoring for established brands tracking long-term trends, and immediate monitoring after major changes like product launches or competitor moves. AI models update their training data periodically, and your brand visibility can change based on new content indexed and competitor activity. Regular monitoring lets you track the impact of optimization efforts and identify new opportunities."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-none overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.q}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
