import Image from 'next/image'

export function Clients() {
  return (
    <div className="mt-24 rounded-4xl bg-neutral-100 py-20 sm:mt-32 sm:py-32 lg:mt-56">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="flex items-center gap-x-8 opacity-0 transform translate-y-6 animate-fade-up [animation-fill-mode:forwards]">
            <h2 className="text-center font-display text-sm font-semibold tracking-wider text-neutral-950 sm:text-left">
              Trusted by leading dealerships nationwide
            </h2>
            <div className="h-px flex-auto bg-neutral-300"></div>
          </div>
          <div>
            <ul role="list" className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
              {[
                { name: 'AutoNation', logo: '/images/autonation.svg' },
                { name: 'CarMax', logo: '/images/carmax.svg' },
                { name: 'Lithia Motors', logo: '/images/lithia.svg' },
                { name: 'Hendrick Automotive', logo: '/images/hendrick.svg' },
                { name: 'Penske Automotive', logo: '/images/penske.svg' },
                { name: 'Group 1 Automotive', logo: '/images/group1.svg' },
                { name: 'Sonic Automotive', logo: '/images/sonic.svg' },
                { name: 'Asbury Automotive', logo: '/images/asbury.svg' },
              ].map((client) => (
                <li key={client.name}>
                  <div className="opacity-0 transform translate-y-6 animate-fade-up [animation-fill-mode:forwards] [animation-delay:0.1s]">
                    <div className="h-8 text-neutral-950 font-medium">
                      {client.name}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 