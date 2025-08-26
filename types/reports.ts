export interface SalesReport {
  id: string
  period: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topSellingItems: {
    itemName: string
    quantitySold: number
    revenue: number
  }[]
}

export interface InventoryReport {
  id: string
  period: string
  totalItems: number
  totalValue: number
  lowStockItems: number
  turnoverRate: number
  topMovingItems: {
    itemName: string
    turnoverRate: number
    currentStock: number
  }[]
}

export interface FinancialReport {
  id: string
  period: string
  revenue: number
  costs: number
  profit: number
  profitMargin: number
  monthlyData: {
    month: string
    revenue: number
    profit: number
  }[]
}

export interface ReportPeriod {
  label: string
  value: string
  startDate: Date
  endDate: Date
}
