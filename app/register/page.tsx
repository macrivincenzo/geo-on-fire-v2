'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/lib/auth-client';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showExistingAccountOptions, setShowExistingAccountOptions] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowExistingAccountOptions(false);

    try {
      const response = await signUp.email({
        name,
        email,
        password,
      });
      
      // Only redirect if signup was successful
      if (!response.error) {
        // Wait a moment for the session to be properly set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Force a hard navigation to ensure cookies are sent
        window.location.href = '/';
      } else {
        throw response.error;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register';
      setError(errorMessage);
      
      // Check if the error is about existing account
      // Better Auth returns 422 status for existing accounts
      if (err.status === 422 ||
          errorMessage.toLowerCase().includes('already exists') || 
          errorMessage.toLowerCase().includes('already registered') ||
          errorMessage.toLowerCase().includes('existing email') ||
          errorMessage.toLowerCase().includes('email already') ||
          errorMessage.toLowerCase().includes('user already exists')) {
        setShowExistingAccountOptions(true);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Blue solid */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">Start tracking your brand</h1>
          <p className="text-lg opacity-90">
            Monitor how AI models rank your brand and get actionable insights to improve your visibility.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>11 free credits on signup</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Track 4+ AI platforms</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="lg:hidden mb-8 flex justify-center">
              <h2 className="text-2xl font-bold text-zinc-900">
                AI Brand Track
              </h2>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                sign in to existing account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-base rounded"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-base rounded"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-base rounded"
                  placeholder="Choose a strong password"
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>
            </div>

            {error && (
              <div className={`border px-4 py-3 ${showExistingAccountOptions ? 'bg-gray-900 border-gray-800' : 'bg-red-50 border-red-200'}`}>
                <p className={showExistingAccountOptions ? 'text-white font-medium' : 'text-red-600'}>
                  {error}
                </p>
                {showExistingAccountOptions && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-300">
                      It looks like you already have an account with this email address.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/login?email=${encodeURIComponent(email)}`}
                        className="inline-flex items-center justify-center px-4 py-2 border-2 border-blue-600 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        Sign in instead
                      </Link>
                      <Link
                        href="/forgot-password"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}