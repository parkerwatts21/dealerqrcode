import React from 'react'
import { FaQrcode } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { AiFillCar } from 'react-icons/ai'

export function CaseStudies() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 mt-20 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="max-w-2xl opacity-0 transform translate-y-6 animate-fade-up [animation-fill-mode:forwards]">
            <h2>
              <span className="block font-display tracking-tight [text-wrap:balance] text-4xl font-medium sm:text-5xl text-neutral-950">
                QR technology for modern dealerships
              </span>
            </h2>
            <div className="mt-6 text-xl text-neutral-600">
              <p>
                Our QR code system revolutionizes how dealerships interact and serve customers.
                With a simple scan, staff and customers alike can access comprehensive vehicle information instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex transform translate-y-6 animate-fade-up [animation-fill-mode:forwards]">
              <article className="relative bg-neutral-100 flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-200 transition hover:bg-neutral-200 sm:p-8">
                <h3>
                  <span className="absolute inset-0 rounded-3xl"></span>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                    <FaQrcode className="h-8 w-8 text-black" />
                  </div>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <span className="font-semibold text-blue-500">Current Feature</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  Custom QR Code Labels
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  Print custom QR code labels for your vehicles directly from our Chrome Extension. When customers scan these codes, they&apos;re instantly redirected to your website.
                </p>
              </article>
            </div>

            <div className="flex transform translate-y-6 animate-fade-up [animation-delay:0.1s] [animation-fill-mode:forwards]">
              <article className="relative bg-neutral-100 flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-200 transition hover:bg-neutral-200 sm:p-8">
                <h3>
                  <span className="absolute inset-0 rounded-3xl"></span>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                    <MdDashboard className="h-8 w-8 text-black" />
                  </div>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <span className="font-semibold text-blue-500">Coming Soon!</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  Smart Tracking Dashboard
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  Track customer scans with our comprehensive dashboard. Our built-in AI tool automatically drafts personalized follow-up emails to potential customers.
                </p>
              </article>
            </div>

            <div className="flex transform translate-y-6 animate-fade-up [animation-delay:0.2s] [animation-fill-mode:forwards]">
              <article className="relative bg-neutral-100 flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-200 transition hover:bg-neutral-200 sm:p-8">
                <h3>
                  <span className="absolute inset-0 rounded-3xl"></span>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                    <AiFillCar className="h-8 w-8 text-black" />
                  </div>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <span className="font-semibold text-blue-500">Coming Soon!</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  Test Drive Signup
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  When customers scan your QR codes, they&apos;ll be presented with an option to schedule a test drive directly from their mobile device.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 