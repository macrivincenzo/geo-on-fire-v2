'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

const PurchaseButton = dynamic(
  () => import('@/components/plans/purchase-button'),
  { ssr: false, loading: () => <Button disabled className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold opacity-50">Loading...</Button> }
);

/**
 * Renders a CTA that goes directly to Stripe checkout for the given plan.
 * If logged in: starts checkout. If not: sends to login, then plans?checkout=productId (plans page auto-redirects to checkout).
 */
export function PlanCheckoutLink({
  productId,
  children,
  className,
  returnUrl = '/plans',
  cancelUrl,
}: {
  productId: string;
  children: React.ReactNode;
  className: string;
  returnUrl?: string;
  cancelUrl?: string;
}) {
  const { data: session, isPending } = useSession();

  if (session?.user) {
    return (
      <PurchaseButton
        productId={productId}
        disabled={isPending}
        className={className}
        returnUrl={returnUrl}
        cancelUrl={cancelUrl ?? returnUrl}
      >
        {isPending ? 'Loading...' : children}
      </PurchaseButton>
    );
  }

  const loginRedirect = `/login?redirect=${encodeURIComponent('/plans?checkout=' + productId)}`;
  return (
    <Link href={loginRedirect} className={className}>
      {children}
    </Link>
  );
}
