import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - AI Brand Track',
  description: 'Learn about AI Brand Track and our mission to help businesses understand and improve their presence in AI-powered search. Empowering brands with AI visibility insights.',
  keywords: [
    'about AI brand tracking',
    'AI brand monitoring company',
    'AI search optimization',
    'brand visibility tools',
    'AI platform monitoring'
  ],
  openGraph: {
    title: 'About Us - AI Brand Track',
    description: 'Learn about AI Brand Track and our mission to help businesses understand and improve their presence in AI-powered search.',
    url: 'https://aibrandtrack.com/about',
  },
  alternates: {
    canonical: 'https://aibrandtrack.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            About AI Brand Track
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Our mission is to help businesses understand and improve their presence in AI-powered search
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
            <p className="text-lg leading-relaxed">
              At AI Brand Track, our main mission is to empower businesses to take control of how AI models present their brand to the world. As AI-powered search becomes increasingly prevalent, understanding your brand's visibility across platforms like ChatGPT, Claude, Perplexity, and other AI systems is crucial for maintaining a competitive edge.
            </p>

            <p className="text-lg leading-relaxed">
              We believe that every business deserves transparency into how AI models rank and mention their brand. Our platform provides real-time insights, competitor analysis, and actionable recommendations to help you optimize your AI presence and ensure your brand is accurately represented across all major AI platforms.
            </p>

            <p className="text-lg leading-relaxed">
              Whether you're a startup looking to establish your brand in AI search results or an established company monitoring your competitive position, AI Brand Track gives you the tools and insights you need to succeed in the age of AI-powered discovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

