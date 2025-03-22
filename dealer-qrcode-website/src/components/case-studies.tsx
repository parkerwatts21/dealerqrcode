import React from 'react'
import Link from 'next/link'

export function CaseStudies() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-24 sm:mt-32 lg:mt-40">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="max-w-2xl opacity-0 transform translate-y-6 animate-fade-up [animation-fill-mode:forwards]">
            <h2>
              <span className="block font-display tracking-tight [text-wrap:balance] text-4xl font-medium sm:text-5xl text-neutral-950">
                QR technology for modern dealerships
              </span>
            </h2>
            <div className="mt-6 text-xl text-neutral-600">
              <p>
                Our QR code system revolutionizes how dealerships manage inventory and serve customers.
                With a simple scan, staff and customers alike can access comprehensive vehicle information instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex opacity-0 transform translate-y-6 animate-fade-up [animation-fill-mode:forwards]">
              <article className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-200 transition hover:bg-neutral-50 sm:p-8">
                <h3>
                  <Link href="/case-studies/inventory-management">
                    <span className="absolute inset-0 rounded-3xl"></span>
                    <svg viewBox="0 0 24 24" fill="none" className="h-16 w-16">
                      <rect width="24" height="24" rx="12" fill="#000" />
                      <path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </Link>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <time dateTime="2023" className="font-semibold">2023</time>
                  <span className="text-neutral-300" aria-hidden="true">/</span>
                  <span>Case study</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  Inventory management simplified
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  How Matthews Auto Group reduced inventory processing time by 65% and eliminated paperwork errors using QR codes.
                </p>
              </article>
            </div>

            <div className="flex opacity-0 transform translate-y-6 animate-fade-up [animation-delay:0.1s] [animation-fill-mode:forwards]">
              <article className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-200 transition hover:bg-neutral-50 sm:p-8">
                <h3>
                  <Link href="/case-studies/customer-experience">
                    <span className="absolute inset-0 rounded-3xl"></span>
                    <svg viewBox="0 0 24 24" fill="none" className="h-16 w-16">
                      <rect width="24" height="24" rx="12" fill="#000" />
                      <path d="M12 7v4l2 2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <time dateTime="2023" className="font-semibold">2023</time>
                  <span className="text-neutral-300" aria-hidden="true">/</span>
                  <span>Case study</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  Enhanced customer experience
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  How Riverside Motors increased customer satisfaction by 47% by providing instant vehicle information through QR codes.
                </p>
              </article>
            </div>

            <div className="flex opacity-0 transform translate-y-6 animate-fade-up [animation-delay:0.2s] [animation-fill-mode:forwards]">
              <article className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-200 transition hover:bg-neutral-50 sm:p-8">
                <h3>
                  <Link href="/case-studies/sales-acceleration">
                    <span className="absolute inset-0 rounded-3xl"></span>
                    <svg viewBox="0 0 24 24" fill="none" className="h-16 w-16">
                      <rect width="24" height="24" rx="12" fill="#000" />
                      <path d="m7 13 3 3 7-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <time dateTime="2022" className="font-semibold">2022</time>
                  <span className="text-neutral-300" aria-hidden="true">/</span>
                  <span>Case study</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  Sales cycle acceleration
                </p>
                <p className="mt-4 text-base text-neutral-600">
                  How Suncoast Auto reduced their sales cycle by 35% by implementing QR codes that streamlined vehicle research and financing.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 