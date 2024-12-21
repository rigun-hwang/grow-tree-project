export function Tree3D({ growth }: { growth: number }) {
  const scale = 0.5 + (growth / 100) * 0.5 // 0.5 to 1.0

  return (
    <div 
      className="w-64 h-64 relative transition-transform duration-1000 ease-out"
      style={{ transform: `scale(${scale})` }}
    >
      <div className="absolute inset-10 bg-gradient-to-b from-green-400 to-green-500 rounded-full shadow-lg transform-gpu transition-all duration-1000 ease-out"
        style={{
          clipPath: "'polygon(20% 80%, 50% 20%, 80% 80%)'",
          filter: "'drop-shadow(0 4px 6px rgba(0, 0, 0.1))'",
        }}
      />
      <div className="absolute bottom-0 left-1/2 w-8 h-16 -translate-x-1/2 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg" />
    </div>
  )
}

