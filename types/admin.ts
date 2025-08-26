export interface SystemSettings {
  id: string
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  taxRate: number
  currency: string
  invoicePrefix: string
  orderPrefix: string
  quotePrefix: string
  lowStockThreshold: number
  autoReorderEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
  lastBackup?: Date
  updatedAt: Date
  updatedBy: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  entity: string
  entityId: string
  details: string
  ipAddress?: string
  timestamp: Date
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalInventoryItems: number
  lowStockItems: number
  totalOrders: number
  pendingOrders: number
  totalInvoices: number
  overdueInvoices: number
  totalRevenue: number
  monthlyRevenue: number
}
