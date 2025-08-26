import type { SalesReport, InventoryReport, FinancialReport } from "@/types/reports"

export const mockSalesReport: SalesReport = {
  id: "sales-2024",
  period: "2024",
  totalRevenue: 485750,
  totalOrders: 156,
  averageOrderValue: 3114,
  topSellingItems: [
    { itemName: "Ciment Portland", quantitySold: 450, revenue: 67500 },
    { itemName: "Sable de construction", quantitySold: 320, revenue: 48000 },
    { itemName: "Gravier concassé", quantitySold: 280, revenue: 42000 },
    { itemName: "Béton prêt à l'emploi", quantitySold: 150, revenue: 37500 },
    { itemName: "Briques creuses", quantitySold: 2400, revenue: 36000 },
  ],
}

export const mockInventoryReport: InventoryReport = {
  id: "inventory-2024",
  period: "2024",
  totalItems: 45,
  totalValue: 125680,
  lowStockItems: 8,
  turnoverRate: 4.2,
  topMovingItems: [
    { itemName: "Ciment Portland", turnoverRate: 8.5, currentStock: 120 },
    { itemName: "Sable de construction", turnoverRate: 6.8, currentStock: 85 },
    { itemName: "Gravier concassé", turnoverRate: 5.2, currentStock: 95 },
    { itemName: "Béton prêt à l'emploi", turnoverRate: 4.8, currentStock: 25 },
    { itemName: "Briques creuses", turnoverRate: 3.9, currentStock: 1200 },
  ],
}

export const mockFinancialReport: FinancialReport = {
  id: "financial-2024",
  period: "2024",
  revenue: 485750,
  costs: 291450,
  profit: 194300,
  profitMargin: 40.0,
  monthlyData: [
    { month: "Jan", revenue: 38500, profit: 15400 },
    { month: "Fév", revenue: 42300, profit: 16920 },
    { month: "Mar", revenue: 45200, profit: 18080 },
    { month: "Avr", revenue: 41800, profit: 16720 },
    { month: "Mai", revenue: 39600, profit: 15840 },
    { month: "Jun", revenue: 43700, profit: 17480 },
    { month: "Jul", revenue: 40900, profit: 16360 },
    { month: "Aoû", revenue: 38200, profit: 15280 },
    { month: "Sep", revenue: 41500, profit: 16600 },
    { month: "Oct", revenue: 44300, profit: 17720 },
    { month: "Nov", revenue: 46800, profit: 18720 },
    { month: "Déc", revenue: 42950, profit: 17180 },
  ],
}
