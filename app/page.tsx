'use client'

import { useState, useEffect } from 'react'
import { useMotion } from 'react-use'
import { CircularProgress } from '../components/CircularProgress'
import { Tree3D } from '../components/Tree3D'
import { Header } from '../components/Header'
import { toast } from 'sonner'
import type { UserData } from '../types/shop'

const DAILY_GOAL = 10000
const CO2_PER_STEP = 0.004
const COINS_PER_GOAL = 50 // 목표 달성시 지급할 코인

export default function PedometerApp() {
  const [userData, setUserData] = useState<UserData>({
    coins: 0,
    steps: 0,
    purchasedItems: [],
    dailySteps: []
  })
  const [lastY, setLastY] = useState(0)
  const [threshold] = useState(10)
  const [goalAchieved, setGoalAchieved] = useState(false)

  const state = useMotion()

  useEffect(() => {
    const stored = localStorage.getItem('userData')
    if (stored) {
      setUserData(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (state.acceleration && state.acceleration.y) {
      const currentY = state.acceleration.y
      const deltaY = Math.abs(currentY - lastY)

      if (deltaY > threshold) {
        setUserData(prev => {
          const newSteps = prev.steps + 1
          
          // 목표 달성 시 코인 지급
          if (newSteps >= DAILY_GOAL && !goalAchieved) {
            setGoalAchieved(true)
            const newCoins = prev.coins + COINS_PER_GOAL
            toast.success(`목표 달성! ${COINS_PER_GOAL} 코인을 획득했습니다!`)
            const newUserData = {
              ...prev,
              steps: newSteps,
              coins: newCoins
            }
            localStorage.setItem('userData', JSON.stringify(newUserData))
            return newUserData
          }

          const newUserData = { ...prev, steps: newSteps }
          localStorage.setItem('userData', JSON.stringify(newUserData))
          return newUserData
        })
      }

      setLastY(currentY)
    }
  }, [state, lastY, threshold, goalAchieved])

  useEffect(() => {
    const resetAtMidnight = () => {
      const now = new Date()
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
      )
      const msToMidnight = night.getTime() - now.getTime()

      setTimeout(() => {
        setUserData(prev => ({
          ...prev,
          steps: 0,
          dailySteps: [...prev.dailySteps, prev.steps]
        }))
        setGoalAchieved(false)
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          steps: 0,
          dailySteps: [...userData.dailySteps, userData.steps]
        }))
      }, msToMidnight)
    }

    resetAtMidnight()
  }, [userData])

  const co2Saved = userData.steps * CO2_PER_STEP
  const progress = (userData.steps / DAILY_GOAL) * 100

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-white to-green-50">
      <Header coins={userData.coins} />
      
      <div className="flex flex-col items-center space-y-6 pt-20">
        <h1 className="text-2xl font-bold tracking-tight">오늘 아낀</h1>
        <h2 className="text-xl font-semibold text-gray-600">CO2</h2>
        
        <CircularProgress value={userData.steps} maxValue={DAILY_GOAL} size={280} strokeWidth={16}>
          <span className="text-6xl font-bold text-blue-500">
            {Math.round(co2Saved)}
          </span>
        </CircularProgress>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">오늘의 걸음 수</p>
          <p className="text-2xl font-semibold">{userData.steps}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center my-0">
        <Tree3D growth={progress} />
      </div>

      <div className="w-full max-w-xs bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">일일 목표</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

