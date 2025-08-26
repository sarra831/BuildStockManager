export interface Customer {
  id: string
  name: string
  company?: string
  email: string
  phone: string
  address: string
  taxId?: string
  createdAt: Date
}

export interface OrderItem {
  id: string
  itemId: string
  itemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  unit: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerCompany?: string
  items: OrderItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  status: "pending" | "reserved" | "preparing" | "ready" | "delivered" | "cancelled"
  orderDate: Date
  deliveryDate?: Date
  deliveryAddress: string
  notes?: string
  createdBy: string
  createdByName: string
}

export interface Reservation {
  id: string
  orderId: string
  itemId: string
  itemName: string
  quantity: number
  reservedUntil: Date
  status: "active" | "expired" | "fulfilled" | "cancelled"
  createdAt: Date
}

export interface DeliveryNote {
  id: string
  orderId: string
  deliveryNumber: string
  deliveryDate: Date
  deliveredBy: string
  customerSignature?: string
  notes?: string
  items: OrderItem[]
}
