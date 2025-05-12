import { Background } from '@/components/background'
import { Hero } from '@/components/hero'
import { Clients } from '@/components/clients'
import { CaseStudies } from '@/components/case-studies'
import { ContactSection } from '@/components/contact-section'

export const metadata = {
  title: "Dealer QRCode | QR Solutions for Modern Dealerships",
  description: "Streamline your dealership operations with our QR code system. Generate unique QR codes for each vehicle to provide instant access to vehicle information.",
};

export default function Home() {
  return (
    <main className="relative">
      <Background />
      <Hero />
      <Clients />
      <CaseStudies />
      <ContactSection />
    </main>
  )
}
