import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - AI Brand Track',
  description: 'Insights, tips, and updates about AI brand visibility, ChatGPT SEO, Claude optimization, Perplexity tracking, and AI search engine optimization strategies.',
  keywords: [
    'AI brand tracking blog',
    'AI SEO tips',
    'ChatGPT optimization',
    'AI search visibility',
    'brand monitoring insights',
    'GEO optimization strategies'
  ],
  openGraph: {
    title: 'Blog - AI Brand Track',
    description: 'Insights, tips, and updates about AI brand visibility, ChatGPT SEO, Claude optimization, and AI search engine optimization.',
    url: 'https://www.aibrandtrack.com/blog',
  },
  alternates: {
    canonical: 'https://www.aibrandtrack.com/blog',
  },
};

import Link from 'next/link';

export default function BlogPage() {
  return (
    <>
      {/* Breadcrumb Structured Data */}
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
                "name": "Blog",
                "item": "https://www.aibrandtrack.com/blog"
              }
            ]
          })
        }}
      />
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-zinc-900 dark:text-zinc-100">Blog</li>
            </ol>
          </nav>

          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Blog
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Insights, tips, and updates about AI brand visibility
            </p>
          </div>

          <div className="text-center py-16">
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              We're working on creating valuable content for you. Check back soon for blog posts about <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">AI brand tracking</Link>, <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">SEO strategies</Link>, and industry insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/brand-monitor"
                className="btn-primary inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
              >
                Start Monitoring Your Brand
              </Link>
              <Link
                href="/plans"
                className="btn-outline inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Explore More</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/" className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-500 transition-colors">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Home</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Learn about AI brand tracking</p>
              </Link>
              <Link href="/about" className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-500 transition-colors">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">About Us</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Our mission and values</p>
              </Link>
              <Link href="/brand-monitor" className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-500 transition-colors">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Brand Monitor</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Start tracking your brand</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

