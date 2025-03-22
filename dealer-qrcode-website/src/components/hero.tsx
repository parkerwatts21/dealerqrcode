import React from 'react'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative">
      {/* QR code-inspired corner brackets - darker and bottom ones positioned lower */}
      <div className="absolute top-32 sm:top-34 left-4 md:left-8 lg:left-16 w-16 h-16 border-l-4 border-t-4 border-neutral-700 z-0" />
      <div className="absolute top-32 sm:top-34 right-4 md:right-8 lg:right-16 w-16 h-16 border-r-4 border-t-4 border-neutral-700 z-0" />
      <div className="absolute top-[20rem] sm:top-[38rem] left-4 md:left-8 lg:left-16 w-16 h-16 border-l-4 border-b-4 border-neutral-700 z-0" />
      <div className="absolute top-[40rem] sm:top-[38rem] right-4 md:right-8 lg:right-16 w-16 h-16 border-r-4 border-b-4 border-neutral-700 z-0" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-38 sm:pt-60 lg:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="max-w-3xl opacity-0 transform translate-y-6 animate-fade-up [animation-fill-mode:forwards] relative z-10">
            <h1>
              <span className="block font-display tracking-tight [text-wrap:balance] text-5xl font-medium sm:text-7xl text-neutral-950">
                Streamline your dealership with QR codes
              </span>
            </h1>
            <div className="mt-6 text-xl text-neutral-600">
              <p>
                Our Chrome extension and management platform lets you generate QR codes for every vehicle on your lot,
                giving customers instant access to specs, features, pricing, and more.
              </p>
            </div>
            <div className="mt-10 flex gap-6">
              <Link
                href="/contact"
                className="rounded-full bg-neutral-950 px-4 py-2.5 text-md font-semibold text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                Get started
              </Link>
              <Link
                href="/demo"
                className="rounded-full px-4 py-2.5 text-md font-semibold text-neutral-950 ring-1 ring-inset ring-neutral-950/10 hover:bg-neutral-50 hover:ring-neutral-950/15 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                View demo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Right column - Video */}
          <div className="opacity-0 transform translate-y-8 animate-fade-up [animation-delay:0.2s] [animation-fill-mode:forwards] relative mt-8 lg:mt-0">
            <div className="rounded-4xl overflow-hidden bg-neutral-100 sm:rounded-[2.5rem] shadow-lg max-h-[400px]">
              <video 
                className="w-full h-auto max-h-[400px]"
                autoPlay
                loop
                muted
                playsInline
                poster="/images/dashboard-preview.jpg"
              >
                <source src="/videos/demo.mp4" type="video/mp4" />
                {/* Fallback to image if video isn't supported */}
                <img 
                  src="/images/dashboard-preview.jpg" 
                  alt="Dealer QRCode dashboard preview"
                  className="w-full"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}