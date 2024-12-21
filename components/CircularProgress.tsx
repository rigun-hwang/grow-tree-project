type CircularProgressProps = {
  value: number
  maxValue: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
}

export function CircularProgress({
  value,
  maxValue,
  size = 200,
  strokeWidth = 12,
  children
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = Math.min(value / maxValue, 1)
  const offset = circumference - progress * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="stroke-gray-200"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="stroke-blue-500 transition-all duration-700 ease-out"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

