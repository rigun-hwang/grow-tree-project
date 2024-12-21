type GoalProgressProps = {
  current: number
  goal: number
}

export function GoalProgress({ current, goal }: GoalProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100)

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-700">일일 목표 진행률</span>
        <span className="text-sm font-medium text-blue-700">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

