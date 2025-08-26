"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar, User, FileText, Package, Download, Mail } from "lucide-react"
import type { Invoice } from "@/types/invoicing"

interface InvoiceDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
}

export function InvoiceDetailsDialog({ open, onOpenChange, invoice }: InvoiceDetailsDialogProps) {
  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "draft":
        return "secondary"
      case "sent":
        return "outline"
      case "paid":
        return "default"
      case "partial":
        return "secondary"
      case "overdue":
        return "destructive"
      case "cancelled":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: Invoice["status"]) => {
    switch (status) {
      case "draft":
        return "Brouillon"
      case "sent":
        return "Envoyée"
      case "paid":
        return "Payée"
      case "partial":
        return "Partiellement payée"
      case "overdue":
        return "En retard"
      case "cancelled":
        return "Annulée"
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

  const isOverdue = new Date() > invoice.dueDate && invoice.status !== "paid" && invoice.status !== "cancelled"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Facture {invoice.invoiceNumber}</span>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(isOverdue ? "overdue" : invoice.status)}>
                {getStatusLabel(isOverdue ? "overdue" : invoice.status)}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
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
                  <p className="font-medium">{invoice.customerName}</p>
                  {invoice.customerCompany && (
                    <p className="text-sm text-muted-foreground">{invoice.customerCompany}</p>
                  )}
                  <p className="text-sm">{invoice.customerEmail}</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium">Adresse de facturation:</p>
                  <p className="text-sm text-muted-foreground">{invoice.customerAddress}</p>
                </div>
                {invoice.customerTaxId && (
                  <div className="pt-2">
                    <p className="text-sm">
                      <span className="font-medium">N° TVA:</span> {invoice.customerTaxId}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Dates et paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date de facture</p>
                    <p className="font-medium">{invoice.invoiceDate.toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'échéance</p>
                    <p className="font-medium">{invoice.dueDate.toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                {invoice.paidDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date de paiement</p>
                    <p className="font-medium">{invoice.paidDate.toLocaleDateString("fr-FR")}</p>
                  </div>
                )}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Montant payé:</span>
                    <span className="font-medium">€{invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Montant restant:</span>
                    <span className="font-medium">€{invoice.remainingAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Articles facturés
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
                  {invoice.items.map((item) => (
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
                  <span>€{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA ({invoice.taxRate}%):</span>
                  <span>€{invoice.taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>€{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Footer Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-xs text-muted-foreground">
                <p>
                  Facture créée par {invoice.createdByName} le {invoice.invoiceDate.toLocaleDateString("fr-FR")}
                </p>
                {invoice.orderId && <p>Commande associée: {invoice.orderId}</p>}
                {invoice.quoteId && <p>Devis associé: {invoice.quoteId}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
