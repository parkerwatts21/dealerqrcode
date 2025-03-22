import React from 'react'

export function Features() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-24 sm:mt-32 lg:mt-40">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="max-w-2xl transform opacity-0 translate-y-6 animate-fade-up [animation-fill-mode:forwards]">
          <h2>
            <span className="block font-display tracking-tight [text-wrap:balance] text-4xl font-medium sm:text-5xl text-neutral-950">
              Powerful features for modern dealerships
            </span>
          </h2>
          <div className="mt-6 text-xl text-neutral-600">
            <p>
              Our QR code system offers a comprehensive suite of tools designed specifically for automotive dealerships,
              helping you streamline operations and enhance customer experience.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl lg:mt-20 lg:max-w-none">
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-3">
          <div className="transform opacity-0 translate-y-6 animate-fade-up [animation-fill-mode:forwards]">
            <div className="relative pb-12 pt-12">
              <div className="absolute bottom-0 left-12 top-0 border border-neutral-200"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <path d="M9 6.75H7.75a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 4.75v10M8.75 8.75 12 4.75l3.25 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-medium text-neutral-950">Instant Vehicle Information</h3>
            <p className="mt-4 text-base text-neutral-600">
              Generate and print unique QR codes for each vehicle that instantly display complete specs, features, history, and pricing when scanned.
            </p>
          </div>

          <div className="transform opacity-0 translate-y-6 animate-fade-up [animation-delay:0.1s] [animation-fill-mode:forwards]">
            <div className="relative pb-12 pt-12">
              <div className="absolute bottom-0 left-12 top-0 border border-neutral-200"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <path d="M12 4.75v1.5M17.127 6.873l-1.061 1.061M19.25 12h-1.5M17.127 17.127l-1.061-1.061M12 17.75v1.5M7.934 16.066l-1.06 1.06M6.25 12h-1.5M7.934 7.934l-1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-medium text-neutral-950">Inventory Management</h3>
            <p className="mt-4 text-base text-neutral-600">
              Track vehicle location, status, and maintenance history with a quick scan, eliminating paperwork and reducing administrative time.
            </p>
          </div>

          <div className="transform opacity-0 translate-y-6 animate-fade-up [animation-delay:0.2s] [animation-fill-mode:forwards]">
            <div className="relative pb-12 pt-12">
              <div className="absolute bottom-0 left-12 top-0 border border-neutral-200"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <path d="M5.75 19.25h12.5a1 1 0 0 0 1-1V5.75a1 1 0 0 0-1-1H5.75a1 1 0 0 0-1 1v12.5a1 1 0 0 0 1 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.75 8.75v3.5a1 1 0 0 0 1 1h3.5v-3.5a1 1 0 0 0-1-1h-3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-medium text-neutral-950">Customer Experience</h3>
            <p className="mt-4 text-base text-neutral-600">
              Allow customers to scan and compare vehicles while browsing your lot, even outside business hours, enhancing the shopping experience.
            </p>
          </div>

          <div className="transform opacity-0 translate-y-6 animate-fade-up [animation-delay:0.3s] [animation-fill-mode:forwards]">
            <div className="relative pb-12 pt-12">
              <div className="absolute bottom-0 left-12 top-0 border border-neutral-200"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <path d="M17.25 10c0 1-1.75 6.25-5.25 6.25S6.75 11 6.75 10 8.5 3.75 12 3.75 17.25 9 17.25 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16.25V20M8.75 18h6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-medium text-neutral-950">Sales Performance</h3>
            <p className="mt-4 text-base text-neutral-600">
              Track QR code scans to gain insights into customer interests and optimize your inventory based on real data.
            </p>
          </div>

          <div className="transform opacity-0 translate-y-6 animate-fade-up [animation-delay:0.4s] [animation-fill-mode:forwards]">
            <div className="relative pb-12 pt-12">
              <div className="absolute bottom-0 left-12 top-0 border border-neutral-200"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <path d="M4.75 8h14.5M8.75 5v6M4.75 14.5h14.5M15.25 11.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-medium text-neutral-950">Multi-Platform Integration</h3>
            <p className="mt-4 text-base text-neutral-600">
              Seamlessly integrate with your existing CRM, DMS, and inventory management systems to maintain a unified workflow.
            </p>
          </div>

          <div className="transform opacity-0 translate-y-6 animate-fade-up [animation-delay:0.5s] [animation-fill-mode:forwards]">
            <div className="relative pb-12 pt-12">
              <div className="absolute bottom-0 left-12 top-0 border border-neutral-200"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <path d="M16.25 10.75v-1.5a4.25 4.25 0 1 0-8.5 0v1.5M8.75 10.5v1.25a3.25 3.25 0 0 0 6.5 0v-1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 13.25v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19.25 16.75v3.5a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1v-3.5a1 1 0 0 1 1-1h12.5a1 1 0 0 1 1 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-medium text-neutral-950">Security & Compliance</h3>
            <p className="mt-4 text-base text-neutral-600">
              Maintain data security with encrypted QR codes that protect sensitive vehicle and customer information while meeting regulatory requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 