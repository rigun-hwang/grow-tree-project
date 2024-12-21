type StatsDisplayProps = {
  dailySteps: number[]
}

export function StatsDisplay({ dailySteps }: StatsDisplayProps) {
  const averageSteps = dailySteps.length > 0 
    ? Math.round(dailySteps.reduce((a, b) => a + b, 0) / dailySteps.length) 
    : 0

  return (
    <div className="w-full max-w-md mt-4">
      <h2 className="text-xl font-bold mb-2">통계</h2>
      <p>평균 일일 걸음 수: {averageSteps}</p>
      <p>기록 일수: {dailySteps.length}일</p>
      <p>총 걸음 수: {dailySteps.reduce((a, b) => a + b, 0)}</p>
    </div>
  )
}

