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
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@aibrandtrack.com"
            }
          })
        }}
      />
      
      <footer className="bg-white text-zinc-600 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand and Description - SEO Rich */}
            <div className="col-span-1 lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-zinc-900">
                  AI Brand Track
                </h2>
              </div>
              <p className="text-sm mb-6 leading-relaxed">
                Track how AI models like <strong>ChatGPT, Claude, Perplexity, and Google Gemini</strong> rank your brand. Monitor your <strong>AI brand visibility</strong> across all major AI platforms. Get real-time <strong>AI brand monitoring</strong>, competitor analysis, and actionable insights for <strong>AI search optimization</strong> and <strong>GEO optimization</strong>.
              </p>
            </div>

            {/* Product - SEO Optimized Links */}
            <div>
              <h3 className="text-zinc-900 font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/plans" className="text-sm hover:text-zinc-900 transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link href="/brand-monitor" className="text-sm hover:text-zinc-900 transition-colors">
                    Brand Monitor
                  </Link>
                </li>
                <li>
<Link href="/" className="text-sm hover:text-zinc-900 transition-colors">
                  AI Brand Tracking
                </Link>
                </li>
                <li>
<Link href="/" className="text-sm hover:text-zinc-900 transition-colors">
                  AI Search Optimization
                </Link>
                </li>
              </ul>
            </div>

            {/* Features - SEO Keywords */}
            <div>
              <h3 className="text-zinc-900 font-semibold mb-4">Features</h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-sm">ChatGPT Brand Tracking</span>
                </li>
                <li>
                  <span className="text-sm">Claude Brand Monitoring</span>
                </li>
                <li>
                  <span className="text-sm">Perplexity Brand Analysis</span>
                </li>
                <li>
                  <span className="text-sm">Google Gemini Brand Monitoring</span>
                </li>
                <li>
                  <span className="text-sm">AI Competitor Tracking</span>
                </li>
                <li>
                  <span className="text-sm">GEO Optimization</span>
                </li>
              </ul>
            </div>

            {/* Company - SEO Links */}
            <div>
              <h3 className="text-zinc-900 font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm hover:text-zinc-900 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm hover:text-zinc-900 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm hover:text-zinc-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-sm hover:text-zinc-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* SEO Rich Bottom Section */}
          <div className="mt-12 pt-8 border-t border-zinc-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-center md:text-left">
<p className="mb-2">
                © {currentYear} AI Brand Track. All rights reserved.
              </p>
                <p className="text-xs text-zinc-500">
                  AI Brand Visibility Monitoring • ChatGPT Tracking • Claude Monitoring • Perplexity Analysis • Google Gemini Monitoring • AI Search Optimization
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
                <Link href="/privacy-policy" className="hover:text-zinc-900 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="hover:text-zinc-900 transition-colors">
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