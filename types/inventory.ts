export interface InventoryItem {
  id: string
  name: string
  description?: string
  category: string
  supplier: string
  unit: "kg" | "tonnes" | "m3" | "m2" | "pieces" | "sacs" | "litres"
  currentStock: number
  reorderLevel: number
  unitPrice: number
  totalValue: number
  lastUpdated: Date
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email?: string
  phone?: string
  address?: string
}

export interface StockMovement {
  id: string
  itemId: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  userId: string
  userName: string
  date: Date
}
