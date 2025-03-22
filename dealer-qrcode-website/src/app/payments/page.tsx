'use client';

import React from 'react';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';

export default function Payments() {
  // Enterprise contact function
  const handleEnterpriseContact = () => {
    window.location.href = 'mailto:scottyta@gmail.com?subject=Enterprise%20Plan%20Inquiry';
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 lg:pt-32 pb-24">
        {/* Pricing Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-indigo-600 font-semibold mb-3">Pricing</h2>
          <h1 className="font-display tracking-tight text-4xl font-medium sm:text-5xl text-neutral-950 mb-6">
            Choose the right plan for you
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Select a plan that drives your dealership forward with powerful QR code technology. 
            Enhance vehicle listings, boost test drives, and create a seamless experience for your customers.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-4xl mx-auto">
          {/* Dealership Card */}
          <div className="bg-white rounded-[24px] shadow-lg overflow-hidden border border-neutral-200 transition-all hover:shadow-xl lg:rounded-r-none">
            <div className="p-8 mb-0">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Dealership</h3>
              <div className="flex items-baseline mb-5">
                <span className="text-5xl font-bold text-neutral-900">$49.99</span>
                <span className="text-neutral-500 ml-2">/month</span>
              </div>
              <p className="text-neutral-600 mb-6">
                Perfect for individual dealerships looking to help customers instantly access vehicle information right on the lot.
              </p>
              
              <a 
                href="https://buy.stripe.com/3cs5nf9w2gvs4E0dQR" 
                target="_blank"
                rel="noopener noreferrer" 
                className="w-full inline-block text-center rounded-full bg-neutral-950 px-4 py-3 text-md font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                Subscribe today
              </a>
            </div>
            
            <div className="px-8 pb-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 mb-4">What's included:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-600">Chrome extension for your sales team</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-600">Unlimited QR code generation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-600">Analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-600">Basic email support</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-600">Up to 100 vehicles</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Enterprise Card */}
          <div className="bg-neutral-900 text-white rounded-[24px] shadow-lg overflow-hidden border border-neutral-800 transition-all hover:shadow-xl relative z-10 lg:-translate-y-6 lg:h-[calc(100%+3rem)]">
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="flex items-baseline mb-5">
                <span className="text-5xl font-bold">Custom</span>
              </div>
              <p className="text-neutral-300 mb-6">
                Dedicated support and infrastructure for managing multiple dealership locations.
              </p>
              
              <button 
                onClick={handleEnterpriseContact}
                className="w-full rounded-full bg-white px-4 py-3 text-md font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                Contact us
              </button>
            </div>
            
            <div className="px-8 py-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">What's included:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-300">Everything in Dealership plan</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-300">Multiple dealership management</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-300">Advanced analytics and reporting</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-300">Unlimited vehicles</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-neutral-300">Custom integrations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Return to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/" 
            className="text-neutral-600 hover:text-neutral-900 underline underline-offset-4"
          >
            Return to home
          </Link>
        </div>
      </div>
    </main>
  );
} 