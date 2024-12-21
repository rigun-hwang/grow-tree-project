export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export interface UserData {
  coins: number
  steps: number
  purchasedItems: string[]
  dailySteps: number[]
}

