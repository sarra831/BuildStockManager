"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, ShoppingCart, Eye, Truck, Package } from "lucide-react"
import { mockOrders } from "@/lib/mock-orders"
import type { Order } from "@/types/orders"
import { CreateOrderDialog } from "./create-order-dialog"
import { OrderDetailsDialog } from "./order-details-dialog"
import { ViewToggle } from "@/components/common/view-toggle"

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [view, setView] = useState<"table" | "grid" | "cards">("table")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerCompany?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "default"
      case "reserved":
        return "secondary"
      case "preparing":
        return "outline"
      case "ready":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "reserved":
        return "Réservé"
      case "preparing":
        return "En préparation"
      case "ready":
        return "Prêt"
      case "delivered":
        return "Livré"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  const handleCreateOrder = (newOrder: Omit<Order, "id" | "orderNumber" | "orderDate">) => {
    const order: Order = {
      ...newOrder,
      id: Date.now().toString(),
      orderNumber: `CMD-2024-${String(orders.length + 1).padStart(3, "0")}`,
      orderDate: new Date(),
    }
    setOrders([...orders, order])
    setShowCreateDialog(false)
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              deliveryDate: newStatus === "delivered" ? new Date() : order.deliveryDate,
            }
          : order,
      ),
    )
  }

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "pending", label: "En attente" },
    { value: "reserved", label: "Réservé" },
    { value: "preparing", label: "En préparation" },
    { value: "ready", label: "Prêt" },
    { value: "delivered", label: "Livré" },
    { value: "cancelled", label: "Annulé" },
  ]

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
            <div className="mt-1">
              <p className="font-medium">{order.customerName}</p>
              {order.customerCompany && <p className="text-sm text-muted-foreground">{order.customerCompany}</p>}
            </div>
          </div>
          <Badge variant={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{order.orderDate.toLocaleDateString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Articles</p>
            <p className="font-medium">{order.items.length} article(s)</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Total</p>
            <p className="font-bold text-lg">€{order.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Voir
          </Button>
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <Select
              value={order.status}
              onValueChange={(value: Order["status"]) => handleUpdateOrderStatus(order.id, value)}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="reserved">Réservé</SelectItem>
                <SelectItem value="preparing">En préparation</SelectItem>
                <SelectItem value="ready">Prêt</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Commandes</h1>
          <p className="text-muted-foreground">Gérez les commandes et réservations clients</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nouvelle commande</span>
          <span className="sm:hidden">Nouvelle</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total commandes</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
              </div>
              <Package className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Réservées</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "reserved").length}</p>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Livrées</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
              </div>
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro, client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Commandes ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {view === "table" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Articles</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          {order.customerCompany && (
                            <p className="text-sm text-muted-foreground">{order.customerCompany}</p>
                          )}
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {order.orderDate.toLocaleDateString("fr-FR")} • {order.items.length} article(s)
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {order.orderDate.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{order.items.length} article(s)</TableCell>
                      <TableCell>€{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <Select
                              value={order.status}
                              onValueChange={(value: Order["status"]) => handleUpdateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-[100px] h-8 hidden sm:flex">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="reserved">Réservé</SelectItem>
                                <SelectItem value="preparing">En préparation</SelectItem>
                                <SelectItem value="ready">Prêt</SelectItem>
                                <SelectItem value="delivered">Livré</SelectItem>
                                <SelectItem value="cancelled">Annulé</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {view === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateOrderDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onCreateOrder={handleCreateOrder} />

      {selectedOrder && (
        <OrderDetailsDialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
          order={selectedOrder}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  )
}
