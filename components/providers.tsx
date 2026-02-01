'use client';

import { AutumnProvider } from 'autumn-js/react';
import { QueryProvider } from '@/lib/providers/query-provider';
import { AutumnCustomerProvider } from '@/hooks/useAutumnCustomer';
import { BuyCreditsProvider } from '@/hooks/useBuyCredits';
import { useSession } from '@/lib/auth-client';
import { ThemeProvider } from 'next-themes';

function AuthAwareAutumnProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  // Only render AutumnProvider when logged in
  if (!session) {
    return <>{children}</>;
  }
  
  return (
    <AutumnProvider
      backendUrl="/api/autumn"
      betterAuthUrl={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
      allowAnonymous={false}
      skipInitialFetch={false}
      includeCredentials={true}
    >
      <AutumnCustomerProvider>
        <BuyCreditsProvider>
          {children}
        </BuyCreditsProvider>
      </AutumnCustomerProvider>
    </AutumnProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AuthAwareAutumnProvider>
          {children}
        </AuthAwareAutumnProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}