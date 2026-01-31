'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authClient, signOut } from '@/lib/auth-client';
import { ArrowLeft, CheckCircle } from 'lucide-react';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Sign out any existing session as soon as user lands here from the email link,
  // so they don't see another account's Dashboard/Logout in the navbar
  useEffect(() => {
    if (token) {
      signOut();
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await authClient.resetPassword({
        newPassword: password,
        token: token!,
      });

      // Sign out any existing session so user doesn't land in another account
      await signOut();
      
      // Redirect to login with success message
      router.push('/login?reset=success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Blue solid */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600" />
          <div className="relative z-10 max-w-md text-white">
            <h1 className="text-4xl font-bold mb-4">Invalid Link</h1>
            <p className="text-lg opacity-90">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        {/* Right side - Error message */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Invalid Reset Link
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                This password reset link is invalid or has expired.
              </p>
              <Link 
                href="/forgot-password"
                className="mt-6 inline-block btn-firecrawl-default whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-6 py-2"
              >
                Request new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Blue solid */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600" />
        <div className="relative z-10 max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">Almost there!</h1>
          <p className="text-lg opacity-90">
            Create a new password for your account. Make sure it's strong and unique.
          </p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center text-white/80">
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="text-sm">At least 8 characters long</span>
            </div>
            <div className="flex items-center text-white/80">
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="text-sm">Mix of letters and numbers</span>
            </div>
            <div className="flex items-center text-white/80">
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="text-sm">Unique to this account</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="lg:hidden mb-8 flex justify-center">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                AI Brand Track
              </h2>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-firecrawl-default w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 h-10 px-4"
              >
                {loading ? 'Resetting...' : 'Reset password'}
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500 inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}