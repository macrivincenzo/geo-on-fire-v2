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
    url: 'https://aibrandtrack.com/blog',
  },
  alternates: {
    canonical: 'https://aibrandtrack.com/blog',
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            We're working on creating valuable content for you. Check back soon for blog posts about AI brand tracking, SEO strategies, and industry insights.
          </p>
        </div>
      </div>
    </div>
  );
}

