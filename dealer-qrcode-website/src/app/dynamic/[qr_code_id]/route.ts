import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    // Get the qr_code_id from the URL
    const url = new URL(request.url);
    const qrCodeId = url.pathname.split('/')[3].toUpperCase();

    // Fetch the vehicle data from Supabase
    const { data, error } = await supabase
      .from('vehicles')
      .select('url')
      .eq('qr_code_id', qrCodeId)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return new NextResponse(
        '<html><body><div style="display: flex; min-height: 100vh; align-items: center; justify-content: center; background-color: #fafafa;"><div style="text-align: center;"><img src="/images/logo.svg" alt="Dealer QRCode" style="width: 80px; height: 80px; margin: 0 auto 1rem;"><p style="color: #dc2626; margin-bottom: 0.5rem;">Error processing QR code</p><p style="color: #525252;">This QR code appears to be invalid or has expired.</p></div></div></body></html>',
        {
          status: 500,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    if (!data || !data.url) {
      console.log('No vehicle found for QR code:', qrCodeId);
      return new NextResponse(
        '<html><body><div style="display: flex; min-height: 100vh; align-items: center; justify-content: center; background-color: #fafafa;"><div style="text-align: center;"><img src="/images/logo.svg" alt="Dealer QRCode" style="width: 80px; height: 80px; margin: 0 auto 1rem;"><p style="color: #dc2626; margin-bottom: 0.5rem;">Invalid QR code</p><p style="color: #525252;">This QR code appears to be invalid or has expired.</p></div></div></body></html>',
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Redirect to the vehicle URL
    return NextResponse.redirect(data.url);
  } catch (err) {
    console.error('Error fetching vehicle data:', err);
    return new NextResponse(
      '<html><body><div style="display: flex; min-height: 100vh; align-items: center; justify-content: center; background-color: #fafafa;"><div style="text-align: center;"><img src="/images/logo.svg" alt="Dealer QRCode" style="width: 80px; height: 80px; margin: 0 auto 1rem;"><p style="color: #dc2626; margin-bottom: 0.5rem;">Error processing QR code</p><p style="color: #525252;">This QR code appears to be invalid or has expired.</p></div></div></body></html>',
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}