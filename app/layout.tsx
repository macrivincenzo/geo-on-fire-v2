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
  title: {
    default: "AI Brand Track - Monitor Your Brand Visibility Across AI Platforms",
    template: "%s | AI Brand Track"
  },
  description: "Track how AI models like ChatGPT, Claude, and Perplexity rank your brand. Monitor AI brand visibility, competitor analysis, and get actionable insights to improve your AI presence.",
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
    "brand mention tracker"
  ],
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
