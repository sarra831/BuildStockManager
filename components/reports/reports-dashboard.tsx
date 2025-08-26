"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, FileText, Download, Calendar } from "lucide-react"
import { mockSalesReport, mockInventoryReport, mockFinancialReport } from "@/lib/mock-reports"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function ReportsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024")

  const salesReport = mockSalesReport
  const inventoryReport = mockInventoryReport
  const financialReport = mockFinancialReport

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num)
  }

  const pieChartData = salesReport.topSellingItems.map((item, index) => ({
    name: item.itemName,
    value: item.revenue,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rapports & Analyses</h1>
          <p className="text-muted-foreground">Analysez les performances de votre entreprise</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">Année 2024</SelectItem>
              <SelectItem value="2023">Année 2023</SelectItem>
              <SelectItem value="q4-2024">Q4 2024</SelectItem>
              <SelectItem value="q3-2024">Q3 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesReport.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12.5% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(salesReport.totalOrders)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +8.2% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesReport.averageOrderValue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +3.8% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marge bénéficiaire</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialReport.profitMargin.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              -1.2% vs période précédente
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution du chiffre d'affaires</CardTitle>
            <CardDescription>Revenus et bénéfices mensuels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financialReport.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenus" />
                <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Bénéfices" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des ventes</CardTitle>
            <CardDescription>Top 5 des articles les plus vendus</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Details */}
        <Card>
          <CardHeader>
            <CardTitle>Articles les plus vendus</CardTitle>
            <CardDescription>Détail des ventes par article</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Revenus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesReport.topSellingItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>{formatNumber(item.quantitySold)}</TableCell>
                    <TableCell>{formatCurrency(item.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Inventory Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance inventaire</CardTitle>
            <CardDescription>Rotation des stocks par article</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Rotation</TableHead>
                  <TableHead>Stock actuel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryReport.topMovingItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>
                      <Badge variant={item.turnoverRate > 5 ? "default" : "secondary"}>
                        {item.turnoverRate.toFixed(1)}x
                      </Badge>
                    </TableCell>
                    <TableCell>{formatNumber(item.currentStock)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Inventaire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Articles totaux</span>
              <span className="font-medium">{inventoryReport.totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valeur totale</span>
              <span className="font-medium">{formatCurrency(inventoryReport.totalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Stock faible</span>
              <Badge variant="destructive">{inventoryReport.lowStockItems}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taux de rotation</span>
              <span className="font-medium">{inventoryReport.turnoverRate.toFixed(1)}x</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Finances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Revenus</span>
              <span className="font-medium">{formatCurrency(financialReport.revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Coûts</span>
              <span className="font-medium">{formatCurrency(financialReport.costs)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Bénéfices</span>
              <span className="font-medium text-green-600">{formatCurrency(financialReport.profit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Marge</span>
              <Badge variant="default">{financialReport.profitMargin.toFixed(1)}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Période actuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Période</span>
              <span className="font-medium">Année 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Dernière MAJ</span>
              <span className="font-medium">Aujourd'hui</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Statut</span>
              <Badge variant="default">À jour</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
