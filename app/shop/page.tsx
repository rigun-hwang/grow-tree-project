"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { shopItems } from "../../data/shop-items"
import { Header } from "../../components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { toast } from "sonner"
import type { UserData } from "'../../types/shop'"
// import { Modal } from "'../../components/Modal'"



// Kalman Filter Class
class KalmanFilter {
  constructor(r = 0.1, q = 0.1, a = 1, b = 0, h = 1) {
    this.r = r; // Process noise covariance
    this.q = q; // Measurement noise covariance
    this.a = a; // State transition matrix
    this.b = b; // Control input matrix
    this.h = h; // Observation matrix
    this.x = 0; // Initial state
    this.p = 1; // Initial covariance
  }

  update(measurement) {
    // Predict
    const predictedX = this.a * this.x;
    const predictedP = this.a * this.p * this.a + this.q;

    // Update
    const k = (predictedP * this.h) / (this.h * predictedP * this.h + this.r); // Kalman gain
    this.x = predictedX + k * (measurement - this.h * predictedX);
    this.p = (1 - k * this.h) * predictedP;

    return this.x;
  }
}


export default function ShopPage() {
  const [userData, setUserData] = useState<UserData>({
    coins: 0,
    steps: 0,
    purchasedItems: [],
    dailySteps: []
  })
  const [stepCount, setStepCount] = useState(0);
  const [supportMessage, setSupportMessage] = useState('');
  const [filteredAcceleration, setFilteredAcceleration] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setSupportMessage('DeviceMotionEvent is supported!');

      // Kalman filters for each axis
      const kalmanX = new KalmanFilter();
      const kalmanY = new KalmanFilter();
      const kalmanZ = new KalmanFilter();
      let lastMagnitude = 0;

      const handleMotionEvent = (event) => {
        const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };

        // Filter acceleration data using Kalman filter
        const filteredX = kalmanX.update(x);
        const filteredY = kalmanY.update(y);
        const filteredZ = kalmanZ.update(z);

        setFilteredAcceleration({ x: filteredX, y: filteredY, z: filteredZ });

        // Calculate the magnitude of acceleration
        const magnitude = Math.sqrt(filteredX ** 2 + filteredY ** 2 + filteredZ ** 2);

        // Detect steps based on magnitude difference
        const threshold = 1.2; // Customize the sensitivity here
        if (Math.abs(magnitude - lastMagnitude) > threshold) {
          setStepCount((prev) => prev + 1);
        }

        lastMagnitude = magnitude;
      };

      window.addEventListener('devicemotion', handleMotionEvent);

      return () => {
        window.removeEventListener('devicemotion', handleMotionEvent);
      };
    } else {
      setSupportMessage('DeviceMotionEvent is not supported on this device or browser.');
    }
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("'userData'")
    if (stored) {
      setUserData(JSON.parse(stored))
    }
  }, [])

  const handlePurchase = (itemId: string, price: number) => {
    if (userData.coins < price) {
      setModalMessage("'코인이 부족합니다!'")
      setIsModalOpen(true)
      return
    }

    const newUserData = {
      ...userData,
      coins: userData.coins - price,
      purchasedItems: [...userData.purchasedItems, itemId]
    }
    
    setUserData(newUserData)
    localStorage.setItem("'userData'", JSON.stringify(newUserData))
    setModalMessage("'구매가 완료되었습니다!'")
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <Header coins={userData.coins} />
      
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-2xl font-bold mb-6">상점</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full aspect-square">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="font-semibold">🪙 {item.price}</span>
                <Button
                  onClick={() => handlePurchase(item.id, item.price)}
                  disabled={userData.purchasedItems.includes(item.id)}
                >
                  {userData.purchasedItems.includes(item.id) ? "'구매완료'" : "'구매하기'"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="알림"
        message={modalMessage}
      /> */}
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Pedometer</h1>
      <p>{supportMessage}</p>
      <h2>Steps Counted: {stepCount}</h2>
    </div>
    </div>

  )
}

