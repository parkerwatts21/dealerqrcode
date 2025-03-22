import { Background } from '@/components/background'
import { Hero } from '@/components/hero'
import { Clients } from '@/components/clients'
import { CaseStudies } from '@/components/case-studies'
import { ContactSection } from '@/components/contact-section'

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
