"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/signin" || pathname === "/signup" || pathname === "/dashboard";

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          {!hideNavbar && <Navbar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
