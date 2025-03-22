'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to email
    window.location.href = 'mailto:sales@dealerqrcode.com?subject=Dealer%20QRCode%20Inquiry';
    
    // Fallback to homepage if the mailto link doesn't work
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Redirecting to email...</p>
    </div>
  );
} 