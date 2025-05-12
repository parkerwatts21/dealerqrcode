'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function DynamicQRRedirect({ params }: { params: { qr_code_id: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        // Fetch the vehicle data from Supabase
        const qrCodeId = params.qr_code_id.toUpperCase();
        const { data, error } = await supabase
          .from('vehicles')
          .select('url')
          .eq('qr_code_id', qrCodeId)
          .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data || !data.url) {
          console.log('No vehicle found for QR code:', params.qr_code_id);
          setError('Invalid QR code');
          setLoading(false);
          return;
        }

        console.log('Found vehicle URL:', data.url);
        // Redirect to the vehicle URL
        window.location.href = data.url;
      } catch (err) {
        console.error('Error fetching vehicle data:', err);
        setError('Error processing QR code');
        setLoading(false);
      }
    };

    if (params.qr_code_id) {
      fetchAndRedirect();
    } else {
      setError('Invalid QR code');
      setLoading(false);
    }
  }, [params.qr_code_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Image
            src="/images/logo.svg"
            alt="Dealer QRCode"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <p className="text-neutral-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Image
            src="/images/logo.svg"
            alt="Dealer QRCode"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-neutral-600">This QR code appears to be invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return null;
} 