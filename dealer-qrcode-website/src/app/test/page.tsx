'use client';

import { Marquee } from "@/registry/magicui/marquee";

export default function TestPage() {
  return (
    <div className="min-h-screen p-10">
      <h1 className="text-2xl font-bold mb-8">Marquee Test</h1>
      
      <div className="w-full max-w-4xl mx-auto bg-gray-100 p-4 rounded-lg">
        <Marquee pauseOnHover repeat={4}>
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item} 
              className="mx-4 h-20 w-40 bg-blue-500 text-white flex items-center justify-center rounded-md"
            >
              Item {item}
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
} 