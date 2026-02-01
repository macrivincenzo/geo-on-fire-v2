'use client';

import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCustomer } from '@/hooks/useAutumnCustomer';
import { ThemeToggle } from './theme-toggle';
import { Menu, X, CreditCard } from 'lucide-react';
import { useBuyCredits } from '@/hooks/useBuyCredits';

// Separate component that only renders when Autumn is available
function UserCredits() {
  const { customer } = useCustomer();
  const messageUsage = customer?.features?.messages;
  const remainingMessages = messageUsage ? (messageUsage.balance || 0) : 0;
  
  return (
    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-100">
      <span>{remainingMessages}</span>
      <span className="ml-1">credits</span>
    </div>
  );
}

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openBuyCredits } = useBuyCredits();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setMobileMenuOpen(false);
    try {
      await signOut();
      // Small delay to ensure the session is cleared
      setTimeout(() => {
        router.refresh();
        setIsLoggingOut(false);
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                AI Brand Track
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {session && (
              <Link
                href="/brand-monitor"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Brand Monitor
              </Link>
            )}
            <Link
              href="/plans"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
            {session && (
              <>
                <UserCredits />
                <button
                  onClick={() => openBuyCredits()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors border border-transparent dark:border-gray-600"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Buy More Credits
                </button>
              </>
            )}
            <ThemeToggle />
            {isPending ? (
              <div className="text-sm text-gray-400 dark:text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 rounded"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-4 space-y-3">
            {session && (
              <>
                <Link
                  href="/brand-monitor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  Brand Monitor
                </Link>
                <div className="px-4 py-2">
                  <UserCredits />
                </div>
                <button
                  onClick={() => {
                    openBuyCredits();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Buy More Credits
                </button>
              </>
            )}
            <Link
              href="/plans"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              Pricing
            </Link>
            {isPending ? (
              <div className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 rounded"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

    </nav>
  );
}