import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans - AI Brand Track',
  description: 'Simple pay-as-you-go pricing for AI brand visibility monitoring. Track your brand across ChatGPT, Claude, Perplexity, and more. No subscriptions, just credits.',
  keywords: [
    'AI brand tracking pricing',
    'AI brand monitoring cost',
    'ChatGPT brand tracking price',
    'AI search optimization pricing',
    'brand visibility monitoring plans'
  ],
  openGraph: {
    title: 'Pricing Plans - AI Brand Track',
    description: 'Simple pay-as-you-go pricing for AI brand visibility monitoring. Track your brand across ChatGPT, Claude, Perplexity, and more.',
    url: 'https://aibrandtrack.com/plans',
  },
  alternates: {
    canonical: 'https://aibrandtrack.com/plans',
  },
};

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

