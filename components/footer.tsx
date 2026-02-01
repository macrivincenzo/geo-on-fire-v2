import Link from "next/link";

export function Footer() {
  const currentYear = 2026;
  
  return (
    <>
      {/* Structured Data for Footer - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AI Brand Track",
            "url": "https://www.aibrandtrack.com",
            "logo": "https://www.aibrandtrack.com/logo.png",
            "description": "AI Brand Track helps businesses monitor their brand visibility across AI platforms like ChatGPT, Claude, Perplexity, and Gemini. Track AI brand rankings, competitor analysis, and get actionable insights for AI search optimization.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "sameAs": [
              "https://twitter.com/aibrandtrack",
              "https://github.com/aibrandtrack"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@aibrandtrack.com"
            }
          })
        }}
      />
      
      <footer className="bg-white dark:bg-gray-900 text-zinc-600 dark:text-gray-300 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand and Description - SEO Rich */}
            <div className="col-span-1 lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  AI Brand Track
                </h2>
              </div>
              <p className="text-sm mb-6 leading-relaxed dark:text-gray-300">
                Track how AI models like <strong>ChatGPT, Claude, Perplexity, and Google Gemini</strong> rank your brand. Monitor your <strong>AI brand visibility</strong> across all major AI platforms. Get real-time <strong>AI brand monitoring</strong>, competitor analysis, and actionable insights for <strong>AI search optimization</strong> and <strong>GEO optimization</strong>.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com"
                  className="text-zinc-400 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  className="text-zinc-400 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product - SEO Optimized Links */}
            <div>
              <h3 className="text-zinc-900 dark:text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/plans" className="text-sm dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link href="/brand-monitor" className="text-sm dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Brand Monitor
                  </Link>
                </li>
                <li>
<Link href="/" className="text-sm dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  AI Brand Tracking
                </Link>
                </li>
                <li>
<Link href="/" className="text-sm dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  AI Search Optimization
                </Link>
                </li>
              </ul>
            </div>

            {/* Features - SEO Keywords */}
            <div>
              <h3 className="text-zinc-900 dark:text-white font-semibold mb-4">Features</h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-sm dark:text-gray-300">ChatGPT Brand Tracking</span>
                </li>
                <li>
                  <span className="text-sm dark:text-gray-300">Claude Brand Monitoring</span>
                </li>
                <li>
                  <span className="text-sm dark:text-gray-300">Perplexity Brand Analysis</span>
                </li>
                <li>
                  <span className="text-sm dark:text-gray-300">Google Gemini Brand Monitoring</span>
                </li>
                <li>
                  <span className="text-sm dark:text-gray-300">AI Competitor Tracking</span>
                </li>
                <li>
                  <span className="text-sm dark:text-gray-300">GEO Optimization</span>
                </li>
              </ul>
            </div>

            {/* Company - SEO Links */}
            <div>
              <h3 className="text-zinc-900 dark:text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-sm dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* SEO Rich Bottom Section */}
          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-center md:text-left">
<p className="mb-2 dark:text-gray-300">
                © {currentYear} AI Brand Track. All rights reserved.
              </p>
                <p className="text-xs text-zinc-500 dark:text-gray-400">
                  AI Brand Visibility Monitoring • ChatGPT Tracking • Claude Monitoring • Perplexity Analysis • Google Gemini Monitoring • AI Search Optimization
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
                <Link href="/privacy-policy" className="dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}