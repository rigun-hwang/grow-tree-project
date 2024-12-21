import Image from "'next/image'"

type TreeProps = {
  growth: number // 0 to 100
}

export function Tree({ growth }: TreeProps) {
  const size = 150 + growth * 1.5 // 150px to 300px

  return (
    <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
      <Image
        src="/placeholder.svg?height=300&width=300"
        alt="Growing Tree"
        layout="fill"
        objectFit="cover"
        className="rounded-full transition-all duration-1000 ease-in-out"
      />
    </div>
  )
}

