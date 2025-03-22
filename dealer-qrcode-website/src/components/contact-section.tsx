'use client';

import React, { useState } from 'react'
import Link from 'next/link'

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
    dealershipSize: 'Less than 50 vehicles'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send data to our API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        fullName: '',
        email: '',
        message: '',
        dealershipSize: 'Less than 50 vehicles'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  href="/payments"
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
                      412 West Rivers Edge Drive<br />
                      Provo, UT 84604
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="full-name" className="block text-sm font-medium text-neutral-700">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                        className={`mt-2 block w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 text-neutral-950 shadow-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm sm:leading-6`}
                      />
                      {errors.fullName && (
                        <p className="mt-2 text-red-100 text-sm text-red-500">{errors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className={`mt-2 block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 text-neutral-950 shadow-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm sm:leading-6`}
                      />
                      {errors.email && (
                        <p className="mt-2 text-red-100 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
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
                        name="dealershipSize"
                        value={formData.dealershipSize}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-950 shadow-sm focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 text-sm sm:leading-6"
                      >
                        <option>Less than 50 vehicles</option>
                        <option>50-100 vehicles</option>
                        <option>100-200 vehicles</option>
                        <option>More than 200 vehicles</option>
                      </select>
                    </div>
                    <div>
                      {submitSuccess && (
                        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
                          Your message has been sent successfully. We'll get back to you soon!
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`rounded-full ${isSubmitting ? 'bg-neutral-600' : 'bg-neutral-950 hover:bg-neutral-800'} px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 w-full flex justify-center items-center`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Submit inquiry'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 