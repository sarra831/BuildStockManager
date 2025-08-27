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
import { Plus, Trash2, Calendar, UserPlus, FileText } from "lucide-react"
import { mockCustomers } from "@/lib/mock-orders"
import { mockInventoryItems } from "@/lib/mock-data"
import { AddNewClientDialog } from "@/components/common/add-new-client-dialog"
import type { Invoice, OrderItem } from "@/types/invoicing"
import { DOCUMENT_TYPES } from "@/types/invoicing"
import type { Customer } from "@/types/orders"
import { useCurrency } from "@/contexts/currency-context"

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber" | "invoiceDate">) => void
}

export function CreateInvoiceDialog({ open, onOpenChange, onCreateInvoice }: CreateInvoiceDialogProps) {
  const [documentType, setDocumentType] = useState<"facture" | "bon_livraison" | "bon_achat" | "devis">("facture")
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [driverName, setDriverName] = useState("")
  const [invoiceItems, setInvoiceItems] = useState<OrderItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [clients, setClients] = useState(mockCustomers)
  const [showAddClientDialog, setShowAddClientDialog] = useState(false)

  const { formatPrice } = useCurrency()
  const selectedCustomer = clients.find((c) => c.id === selectedCustomerId)
  const documentConfig = DOCUMENT_TYPES.find((d) => d.type === documentType) || DOCUMENT_TYPES[0]

  const handleAddClient = (newClient: Omit<Customer, "id">) => {
    const clientWithId: Customer = {
      ...newClient,
      id: Date.now().toString(),
    }
    setClients([...clients, clientWithId])
    setSelectedCustomerId(clientWithId.id)
  }

  const addItem = () => {
    const inventoryItem = mockInventoryItems.find((item) => item.id === selectedItemId)
    if (!inventoryItem) return

    const existingItemIndex = invoiceItems.findIndex((item) => item.itemId === selectedItemId)

    if (existingItemIndex >= 0) {
      const updatedItems = [...invoiceItems]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * inventoryItem.unitPrice
      setInvoiceItems(updatedItems)
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        itemId: inventoryItem.id,
        itemName: inventoryItem.name,
        quantity,
        unitPrice: inventoryItem.unitPrice,
        totalPrice: quantity * inventoryItem.unitPrice,
        unit: inventoryItem.unit,
      }
      setInvoiceItems([...invoiceItems, newItem])
    }

    setSelectedItemId("")
    setQuantity(1)
  }

  const removeItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== itemId))
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    setInvoiceItems(
      invoiceItems.map((item) =>
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

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const taxRate = 20
  const taxAmount = documentConfig.showTax ? subtotal * (taxRate / 100) : 0
  const total = subtotal + taxAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer || invoiceItems.length === 0 || !dueDate) return

    const invoice: Omit<Invoice, "id" | "invoiceNumber" | "invoiceDate"> = {
      documentType,
      driverName: documentConfig.showDriver ? driverName : undefined,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerCompany: selectedCustomer.company,
      customerEmail: selectedCustomer.email,
      customerAddress: selectedCustomer.address,
      customerTaxId: selectedCustomer.taxId,
      items: invoiceItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      paidAmount: 0,
      remainingAmount: total,
      status: "draft",
      dueDate: new Date(dueDate),
      notes,
      createdBy: "3",
      createdByName: "Responsable Commercial",
    }

    onCreateInvoice(invoice)
    resetForm()
  }

  const resetForm = () => {
    setDocumentType("facture")
    setSelectedCustomerId("")
    setDueDate("")
    setNotes("")
    setDriverName("")
    setInvoiceItems([])
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

  // Default due date to 30 days from now
  const defaultDueDate = new Date()
  defaultDueDate.setDate(defaultDueDate.getDate() + 30)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau document</DialogTitle>
            <DialogDescription>
              Créez une facture, bon de livraison, bon d'achat ou devis pour un client.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="documentType">Type de document *</Label>
              <Select value={documentType} onValueChange={(value: any) => setDocumentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((docType) => (
                    <SelectItem key={docType.type} value={docType.type}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {docType.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Customer and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Client *</Label>
                <div className="flex gap-2">
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId} required>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} {customer.company && `- ${customer.company}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAddClientDialog(true)}
                    title="Ajouter un nouveau client"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
            </div>

            {documentConfig.showDriver && (
              <div className="space-y-2">
                <Label htmlFor="driverName">Nom du chauffeur</Label>
                <Input
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Nom du chauffeur pour la livraison"
                />
              </div>
            )}

            {/* Customer Info Display */}
            {selectedCustomer && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      {selectedCustomer.company && <p>{selectedCustomer.company}</p>}
                      <p>{selectedCustomer.email}</p>
                      <p>{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p>{selectedCustomer.address}</p>
                      {selectedCustomer.taxId && <p>N° TVA: {selectedCustomer.taxId}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                            {item.name} - {formatPrice(item.unitPrice)} / {formatUnit(item.unit)}
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

            {/* Invoice Items */}
            {invoiceItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Articles du {documentConfig.label.toLowerCase()}</CardTitle>
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
                      {invoiceItems.map((item) => (
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
                          <TableCell>{formatPrice(item.unitPrice)}</TableCell>
                          <TableCell>{formatPrice(item.totalPrice)}</TableCell>
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
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {documentConfig.showTax && (
                      <div className="flex justify-between">
                        <span>TVA ({taxRate}%):</span>
                        <span>{formatPrice(taxAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
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
                placeholder="Notes ou conditions particulières..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={!selectedCustomerId || invoiceItems.length === 0 || !dueDate}>
                Créer le {documentConfig.label.toLowerCase()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AddNewClientDialog
        open={showAddClientDialog}
        onOpenChange={setShowAddClientDialog}
        onAddClient={handleAddClient}
      />
    </>
  )
}
