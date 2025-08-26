"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FileText, Eye, Download, Euro, AlertTriangle } from "lucide-react"
import { mockInvoices } from "@/lib/mock-invoicing"
import type { Invoice } from "@/types/invoicing"
import { CreateInvoiceDialog } from "./create-invoice-dialog"
import { InvoiceDetailsDialog } from "./invoice-details-dialog"
import { AddPaymentDialog } from "./add-payment-dialog"

export function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerCompany?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus
    return matchesSearch && matchesStatus
  })

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

  const isOverdue = (invoice: Invoice) => {
    return new Date() > invoice.dueDate && invoice.status !== "paid" && invoice.status !== "cancelled"
  }

  const handleCreateInvoice = (newInvoice: Omit<Invoice, "id" | "invoiceNumber" | "invoiceDate">) => {
    const invoice: Invoice = {
      ...newInvoice,
      id: Date.now().toString(),
      invoiceNumber: `FAC-2024-${String(invoices.length + 1).padStart(3, "0")}`,
      invoiceDate: new Date(),
    }
    setInvoices([...invoices, invoice])
    setShowCreateDialog(false)
  }

  const handleAddPayment = (invoiceId: string, amount: number, method: string, reference?: string, notes?: string) => {
    setInvoices(
      invoices.map((invoice) => {
        if (invoice.id === invoiceId) {
          const newPaidAmount = invoice.paidAmount + amount
          const newRemainingAmount = invoice.total - newPaidAmount
          const newStatus =
            newRemainingAmount <= 0 ? "paid" : newRemainingAmount < invoice.total ? "partial" : invoice.status

          return {
            ...invoice,
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: newStatus,
            paidDate: newStatus === "paid" ? new Date() : invoice.paidDate,
          }
        }
        return invoice
      }),
    )
    setPaymentInvoice(null)
  }

  const overdueInvoices = invoices.filter(isOverdue)
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((sum, inv) => sum + inv.remainingAmount, 0)

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "draft", label: "Brouillon" },
    { value: "sent", label: "Envoyée" },
    { value: "partial", label: "Partiellement payée" },
    { value: "paid", label: "Payée" },
    { value: "overdue", label: "En retard" },
    { value: "cancelled", label: "Annulée" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facturation</h1>
          <p className="text-muted-foreground">Gérez vos factures, devis et paiements</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total factures</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">€{totalOutstanding.toFixed(2)}</p>
              </div>
              <Euro className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payées</p>
                <p className="text-2xl font-bold">{invoices.filter((i) => i.status === "paid").length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold">{overdueInvoices.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Invoices Alert */}
      {overdueInvoices.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Factures en retard ({overdueInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-medium">
                      {invoice.invoiceNumber} - {invoice.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      €{invoice.remainingAmount.toFixed(2)} - Échéance: {invoice.dueDate.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPaymentInvoice(invoice)}>
                    Ajouter paiement
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Factures ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payé</TableHead>
                  <TableHead>Restant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className={isOverdue(invoice) ? "bg-destructive/5" : ""}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.customerName}</p>
                        {invoice.customerCompany && (
                          <p className="text-sm text-muted-foreground">{invoice.customerCompany}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{invoice.invoiceDate.toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {invoice.dueDate.toLocaleDateString("fr-FR")}
                        {isOverdue(invoice) && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      </div>
                    </TableCell>
                    <TableCell>€{invoice.total.toFixed(2)}</TableCell>
                    <TableCell>€{invoice.paidAmount.toFixed(2)}</TableCell>
                    <TableCell>€{invoice.remainingAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(isOverdue(invoice) ? "overdue" : invoice.status)}>
                        {getStatusLabel(isOverdue(invoice) ? "overdue" : invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                          <Button variant="outline" size="sm" onClick={() => setPaymentInvoice(invoice)}>
                            <Euro className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateInvoice={handleCreateInvoice}
      />

      {selectedInvoice && (
        <InvoiceDetailsDialog
          open={!!selectedInvoice}
          onOpenChange={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}

      {paymentInvoice && (
        <AddPaymentDialog
          open={!!paymentInvoice}
          onOpenChange={() => setPaymentInvoice(null)}
          invoice={paymentInvoice}
          onAddPayment={handleAddPayment}
        />
      )}
    </div>
  )
}
