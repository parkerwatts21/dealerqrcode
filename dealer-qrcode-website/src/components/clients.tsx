import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Marquee } from "@/registry/magicui/marquee"

const logos = [
  { src: '/images/MatrixMotors.png', alt: 'Matrix Motors' },
  { src: '/images/drivedeals.png', alt: 'Drive Deals' },
  { src: '/images/wadeautogroup.png', alt: 'Wade Auto Group' },
  { src: '/images/andersonmotors.png', alt: 'Anderson Motor' },
]

const LogoItem = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="mx-8 flex h-16 w-48 items-center justify-center">
      <Image 
        src={src} 
        alt={alt} 
        width={158} 
        height={48} 
        className="h-10 w-auto object-contain" 
      />
    </div>
  )
}

export function Clients() {
  return (
    <div className="py-24 sm:py-32 rounded-4xl mt-24 sm:mt-32 lg:mt-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold mb-10">
          Trusted by leading dealerships nationwide
        </h2>
        
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover repeat={10}>
            {logos.map((logo, index) => (
              <LogoItem key={index} {...logo} />
            ))}
          </Marquee>
          
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white"></div>
        </div>
      </div>
    </div>
  )
} 