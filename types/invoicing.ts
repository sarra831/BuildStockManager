export interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  customerName: string
  customerCompany?: string
  items: OrderItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  validUntil: Date
  quoteDate: Date
  notes?: string
  createdBy: string
  createdByName: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  orderId?: string
  quoteId?: string
  customerId: string
  customerName: string
  customerCompany?: string
  customerEmail: string
  customerAddress: string
  customerTaxId?: string
  items: OrderItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  paidAmount: number
  remainingAmount: number
  status: "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled"
  invoiceDate: Date
  dueDate: Date
  paidDate?: Date
  notes?: string
  createdBy: string
  createdByName: string
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  paymentMethod: "cash" | "check" | "transfer" | "card" | "other"
  paymentDate: Date
  reference?: string
  notes?: string
  createdBy: string
  createdByName: string
}

// Reuse OrderItem from orders.ts
import type { OrderItem } from "./orders"
