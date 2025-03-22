export function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      {/* Base white background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-neutral-100" />
      
      {/* Radial gradient for center focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_top,transparent_20%,white_85%)]" />
      
      {/* Grid pattern with strong fade out after top 45% */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-80" style={{
        maskImage: 'linear-gradient(to bottom, black 30%, transparent 60%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 60%)'
      }} />
      
      {/* Additional center focus gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0)_0%,white_70%)]" />
    </div>
  )
} 