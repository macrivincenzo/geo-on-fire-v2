import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
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
                "name": "Terms of Service",
                "item": "https://www.aibrandtrack.com/terms-of-service"
              }
            ]
          })
        }}
      />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-zinc-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-zinc-900">Terms of Service</li>
            </ol>
          </nav>

          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-zinc-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-zinc-700">
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using <Link href="/" className="text-blue-600 hover:underline">AI Brand Track</Link> ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. Description of Service</h2>
              <p className="leading-relaxed">
                AI Brand Track is a platform that monitors and analyzes how AI models like ChatGPT, Claude, Perplexity, and Google Gemini rank and mention your brand. The Service provides <Link href="/brand-monitor" className="text-blue-600 hover:underline">brand visibility tracking</Link>, competitor analysis, and actionable insights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. User Accounts</h2>
              <p className="leading-relaxed mb-4">To use our Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create an account with accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Be at least 18 years old</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">4. Payment and Credits</h2>
              <p className="leading-relaxed mb-4">Our Service operates on a credit-based system:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credits are required to perform brand analyses</li>
                <li>Credits are purchased in advance and do not expire</li>
                <li>All payments are processed securely through third-party payment processors</li>
                <li>Refunds are handled on a case-by-case basis</li>
                <li>We reserve the right to change pricing with notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">5. Acceptable Use</h2>
              <p className="leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Reproduce, duplicate, copy, or exploit any portion of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">6. Intellectual Property</h2>
              <p className="leading-relaxed">
                The Service and its original content, features, and functionality are owned by AI Brand Track and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">7. Data and Analytics</h2>
              <p className="leading-relaxed">
                You retain ownership of any data you submit to the Service. By using the Service, you grant us a license to use, store, and process your data solely for the purpose of providing the Service. We may use aggregated and anonymized data for analytics and improvement purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">8. Service Availability</h2>
              <p className="leading-relaxed">
                We strive to maintain high availability of our Service but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">9. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">10. Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, AI Brand Track shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">11. Termination</h2>
              <p className="leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">12. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">13. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">14. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our <Link href="/" className="text-blue-600 hover:underline">platform</Link> or email us at legal@aibrandtrack.com.
              </p>
            </section>
          </div>

          {/* Related Links */}
          <div className="mt-16 pt-8 border-t border-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Related Pages</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/privacy-policy" className="p-4 border border-zinc-200 rounded-lg hover:border-blue-600 transition-colors">
                <h3 className="font-semibold text-zinc-900 mb-2">Privacy Policy</h3>
                <p className="text-sm text-zinc-600">Read our privacy policy</p>
              </Link>
              <Link href="/about" className="p-4 border border-zinc-200 rounded-lg hover:border-blue-600 transition-colors">
                <h3 className="font-semibold text-zinc-900 mb-2">About Us</h3>
                <p className="text-sm text-zinc-600">Learn more about AI Brand Track</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

