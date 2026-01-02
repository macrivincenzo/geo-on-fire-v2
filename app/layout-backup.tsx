import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aibrandtrack.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  title: {
    default: "AI Brand Track - Monitor Your Brand Visibility Across AI Platforms | ChatGPT, Claude, Perplexity & Gemini Tracking",
    template: "%s | AI Brand Track"
  },
  description: "Track how AI models like ChatGPT, Claude, Perplexity, and Google Gemini rank your brand. Monitor AI brand visibility, competitor analysis, and get actionable insights to improve your AI presence. Real-time AI search optimization and GEO tracking.",
  keywords: [
    "AI brand visibility",
    "AI brand monitoring",
    "brand tracking AI",
    "AI brand analysis",
    "ChatGPT brand tracking",
    "Claude brand monitoring",
    "AI competitor analysis",
    "brand SEO AI",
    "AI search visibility",
    "brand mention tracker",
    "AI search optimization",
    "GEO optimization",
    "AI ranking tracker",
    "brand visibility score",
    "AI platform monitoring",
    "Perplexity brand tracking",
    "Gemini brand monitoring",
    "Google Gemini brand tracking",
    "Gemini brand analysis",
    "Google AI brand monitoring",
    "AI search engine optimization",
    "brand presence AI",
    "AI brand reputation",
    "ChatGPT SEO",
    "Claude SEO",
    "AI model ranking",
    "brand visibility analytics",
    "AI search analytics"
  ],
  authors: [{ name: "AI Brand Track" }],
  creator: "AI Brand Track",
  publisher: "AI Brand Track",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.aibrandtrack.com',
    siteName: 'AI Brand Track',
    title: 'AI Brand Track - Monitor Your Brand Visibility Across AI Platforms',
    description: 'Track how AI models like ChatGPT, Claude, Perplexity, and Google Gemini rank your brand. Monitor AI brand visibility, competitor analysis, and get actionable insights to improve your AI presence.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Brand Track - Brand Visibility Monitoring Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Brand Track - Monitor Your Brand Visibility Across AI Platforms',
    description: 'Track how AI models rank your brand. Monitor AI brand visibility, competitor analysis, and get actionable insights.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.aibrandtrack.com',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48' }
    ],
    apple: '/ai-brand-track-logo.jpeg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
