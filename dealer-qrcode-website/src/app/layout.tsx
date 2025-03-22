import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dealer QRCode | QR Solutions for Modern Dealerships",
  description: "Streamline your dealership operations with our QR code system. Generate unique QR codes for each vehicle to provide instant access to vehicle information.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
