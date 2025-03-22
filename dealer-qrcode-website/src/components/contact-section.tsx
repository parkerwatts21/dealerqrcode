import React from 'react'
import Link from 'next/link'

export function ContactSection() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-24 sm:mt-32 lg:mt-40 pb-24 sm:pb-32 lg:pb-40">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="opacity-0 transform translate-y-6 animate-fade-up [animation-fill-mode:forwards]">
          <div className="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-2">
            <div>
              <h2>
                <span className="block font-display tracking-tight [text-wrap:balance] text-4xl font-medium sm:text-5xl text-neutral-950">
                  Ready to transform your dealership?
                </span>
              </h2>
              <div className="mt-6 text-xl text-neutral-600">
                <p>
                  Get in touch to learn how our QR code system can help streamline your operations
                  and enhance the customer experience at your dealership.
                </p>
              </div>
              <div className="mt-10 flex">
                <Link
                  href="/contact"
                  className="rounded-full bg-neutral-950 px-4 py-2.5 text-md font-semibold text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
                >
                  Get started <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-16 border-t border-neutral-200 pt-16">
                <h3 className="font-display text-base font-semibold text-neutral-950">
                  Our offices
                </h3>
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <p className="text-sm not-italic text-neutral-950">
                      <strong className="font-semibold">Headquarters</strong><br />
                      8521 Auto Park Drive<br />
                      Suite 300<br />
                      San Diego, CA 92121
                    </p>
                  </div>
                  <div>
                    <p className="text-sm not-italic text-neutral-950">
                      <strong className="font-semibold">East Coast Office</strong><br />
                      1200 Dealership Way<br />
                      Floor 4<br />
                      Charlotte, NC 28202
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-4xl bg-neutral-100 p-8 sm:p-10 shadow-md">
                <h3 className="font-display text-lg font-semibold text-neutral-950">
                  Contact our sales team
                </h3>
                <div className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="full-name" className="block text-sm font-medium text-neutral-700">
                        Full name
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        name="full-name"
                        autoComplete="name"
                        className="mt-2 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-950 shadow-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        className="mt-2 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-950 shadow-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        className="mt-2 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-950 shadow-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm sm:leading-6"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="dealership-size" className="block text-sm font-medium text-neutral-700">
                        Dealership size
                      </label>
                      <select
                        id="dealership-size"
                        name="dealership-size"
                        className="mt-2 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-950 shadow-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm sm:leading-6"
                      >
                        <option>Less than 50 vehicles</option>
                        <option>50-100 vehicles</option>
                        <option>100-200 vehicles</option>
                        <option>More than 200 vehicles</option>
                      </select>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="rounded-full bg-neutral-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 w-full"
                      >
                        Submit inquiry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 