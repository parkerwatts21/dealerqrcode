"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    const fullName = formData.get('name') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, { full_name: fullName });
      router.push('/signin?signup=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  }, [signUp, router]);

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-white px-4">
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
            Create your account
          </h2>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-800 outline-none"
            />
          </div>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-800 outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900 mb-1">
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-800 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-neutral-950 px-2.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:outline-neutral-950 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="text-neutral-800 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 