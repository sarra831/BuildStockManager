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
  documentType: "facture" | "bon_livraison" | "bon_achat" | "devis"
  orderId?: string
  quoteId?: string
  customerId: string
  customerName: string
  customerCompany?: string
  customerEmail: string
  customerAddress: string
  customerTaxId?: string
  driverName?: string
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

export interface DocumentTypeConfig {
  type: "facture" | "bon_livraison" | "bon_achat" | "devis"
  label: string
  prefix: string
  showTax: boolean
  showPayment: boolean
  showDriver: boolean
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    type: "facture",
    label: "Facture",
    prefix: "FACT-",
    showTax: true,
    showPayment: true,
    showDriver: false,
  },
  {
    type: "bon_livraison",
    label: "Bon de Livraison",
    prefix: "BL-",
    showTax: false,
    showPayment: false,
    showDriver: true,
  },
  {
    type: "bon_achat",
    label: "Bon d'Achat",
    prefix: "BA-",
    showTax: true,
    showPayment: false,
    showDriver: false,
  },
  {
    type: "devis",
    label: "Devis",
    prefix: "DEV-",
    showTax: true,
    showPayment: false,
    showDriver: false,
  },
]

// Reuse OrderItem from orders.ts
import type { OrderItem } from "./orders"
