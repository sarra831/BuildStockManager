"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { mockCustomers } from "@/lib/mock-orders"
import { mockInventoryItems } from "@/lib/mock-data"
import type { Order, OrderItem } from "@/types/orders"

interface CreateOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateOrder: (order: Omit<Order, "id" | "orderNumber" | "orderDate">) => void
}

export function CreateOrderDialog({ open, onOpenChange, onCreateOrder }: CreateOrderDialogProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState("")
  const [quantity, setQuantity] = useState(1)

  const selectedCustomer = mockCustomers.find((c) => c.id === selectedCustomerId)

  const addItem = () => {
    const inventoryItem = mockInventoryItems.find((item) => item.id === selectedItemId)
    if (!inventoryItem) return

    const existingItemIndex = orderItems.findIndex((item) => item.itemId === selectedItemId)

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * inventoryItem.unitPrice
      setOrderItems(updatedItems)
    } else {
      // Add new item
      const newItem: OrderItem = {
        id: Date.now().toString(),
        itemId: inventoryItem.id,
        itemName: inventoryItem.name,
        quantity,
        unitPrice: inventoryItem.unitPrice,
        totalPrice: quantity * inventoryItem.unitPrice,
        unit: inventoryItem.unit,
      }
      setOrderItems([...orderItems, newItem])
    }

    setSelectedItemId("")
    setQuantity(1)
  }

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId))
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.unitPrice,
            }
          : item,
      ),
    )
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const taxRate = 20
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer || orderItems.length === 0) return

    const order: Omit<Order, "id" | "orderNumber" | "orderDate"> = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerCompany: selectedCustomer.company,
      items: orderItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: "pending",
      deliveryAddress: deliveryAddress || selectedCustomer.address,
      notes,
      createdBy: "3", // Mock user ID
      createdByName: "Responsable Commercial",
    }

    onCreateOrder(order)
    resetForm()
  }

  const resetForm = () => {
    setSelectedCustomerId("")
    setDeliveryAddress("")
    setNotes("")
    setOrderItems([])
    setSelectedItemId("")
    setQuantity(1)
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
          <DialogTitle>Créer une nouvelle commande</DialogTitle>
          <DialogDescription>Ajoutez les détails de la commande et sélectionnez les articles.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Client *</Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} {customer.company && `- ${customer.company}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Adresse de livraison</Label>
              <Input
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={selectedCustomer?.address || "Adresse de livraison"}
              />
            </div>
          </div>

          {/* Add Items Section */}
          <Card>
            <CardHeader>
              <CardTitle>Ajouter des articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="item">Article</Label>
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un article" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockInventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - €{item.unitPrice} / {formatUnit(item.unit)} (Stock: {item.currentStock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-24">
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  />
                </div>

                <Button type="button" onClick={addItem} disabled={!selectedItemId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          {orderItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Articles de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>€{item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>€{item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({taxRate}%):</span>
                    <span>€{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes ou instructions spéciales..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!selectedCustomerId || orderItems.length === 0}>
              Créer la commande
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
