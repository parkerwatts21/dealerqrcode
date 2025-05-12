"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  }, [signIn, router]);

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-white px-4">
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="relative flex flex-col px-6 py-4 rounded-xl shadow-lg bg-white border border-gray-200 min-w-[340px] max-w-xs">
            <button onClick={() => setShowToast(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-50 mr-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              <span className="font-semibold text-base text-gray-900">Successfully created!</span>
            </div>
            <div className="text-sm text-gray-500 pl-8">Confirm sign up through email.</div>
          </div>
        </div>
      )}
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center">
          <Image
            src="/images/logo.svg"
            alt="Dealer QRCode"
            width={80}
            height={80}
            className="mb-6 mt-2"
          />
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'inherit' }}>
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-800 outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-800 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-neutral-950 px-2.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:outline-neutral-950 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-400">
          Not a member?{' '}
          <Link href="/signup" className="text-neutral-800 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
} 