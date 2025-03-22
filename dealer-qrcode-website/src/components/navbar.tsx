import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
  return (
    <header className="absolute z-50 w-full">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex items-center justify-between py-6">
          <div className="flex items-center gap-x-8">
            <Link href="/" aria-label="Home">
              <Image 
                src="/images/logo.svg" 
                alt="Dealer QRCode" 
                width={140} 
                height={40} 
                className="h-22 w-auto" 
              />
            </Link>
          </div>
          <div className="flex items-center gap-x-5">
            <Link 
              href="/contact" 
              className="hidden lg:block rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
            >
              Contact us
            </Link>
            <button type="button" className="lg:hidden" aria-label="Toggle navigation">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 stroke-neutral-950">
                <path d="M3.75 12h16.5M3.75 6.75h16.5M3.75 17.25h16.5" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 