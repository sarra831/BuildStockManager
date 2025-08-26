"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, FileText, Package } from "lucide-react"
import type { Order } from "@/types/orders"

interface OrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order
  onUpdateStatus: (orderId: string, status: Order["status"]) => void
}

export function OrderDetailsDialog({ open, onOpenChange, order, onUpdateStatus }: OrderDetailsDialogProps) {
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

  const formatUnit = (unit: string) => {
    const units = {
      kg: "kg",
      tonnes: "t",
      m3: "m³",
      m2: "m²",
      pieces: "pcs",
      sacs: "sacs",
      litres: "L",
    }
    return units[unit as keyof typeof units] || unit
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la commande {order.orderNumber}</span>
            <Badge variant={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Informations client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  {order.customerCompany && <p className="text-sm text-muted-foreground">{order.customerCompany}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Date de commande</p>
                  <p className="font-medium">{order.orderDate.toLocaleDateString("fr-FR")}</p>
                </div>
                {order.deliveryDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date de livraison</p>
                    <p className="font-medium">{order.deliveryDate.toLocaleDateString("fr-FR")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Adresse de livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.deliveryAddress}</p>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Articles commandés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Prix unitaire</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>
                        {item.quantity} {formatUnit(item.unit)}
                      </TableCell>
                      <TableCell>€{item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>€{item.totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>€{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA ({order.taxRate}%):</span>
                  <span>€{order.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>€{order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Status Update */}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <Card>
              <CardHeader>
                <CardTitle>Mettre à jour le statut</CardTitle>
                <CardDescription>Changez le statut de la commande selon son avancement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <Select
                    value={order.status}
                    onValueChange={(value: Order["status"]) => onUpdateStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-[200px]">
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
                  <p className="text-sm text-muted-foreground">
                    Créé par {order.createdByName} le {order.orderDate.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
