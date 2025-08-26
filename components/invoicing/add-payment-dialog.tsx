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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Euro } from "lucide-react"
import type { Invoice } from "@/types/invoicing"

interface AddPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
  onAddPayment: (invoiceId: string, amount: number, method: string, reference?: string, notes?: string) => void
}

export function AddPaymentDialog({ open, onOpenChange, invoice, onAddPayment }: AddPaymentDialogProps) {
  const [amount, setAmount] = useState(invoice.remainingAmount)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount <= 0 || amount > invoice.remainingAmount || !paymentMethod) return

    onAddPayment(invoice.id, amount, paymentMethod, reference || undefined, notes || undefined)
    resetForm()
  }

  const resetForm = () => {
    setAmount(invoice.remainingAmount)
    setPaymentMethod("")
    setReference("")
    setNotes("")
    setPaymentDate(new Date().toISOString().split("T")[0])
  }

  const paymentMethods = [
    { value: "cash", label: "Espèces" },
    { value: "check", label: "Chèque" },
    { value: "transfer", label: "Virement" },
    { value: "card", label: "Carte bancaire" },
    { value: "other", label: "Autre" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Euro className="mr-2 h-5 w-5" />
            Ajouter un paiement
          </DialogTitle>
          <DialogDescription>Enregistrez un paiement pour la facture {invoice.invoiceNumber}</DialogDescription>
        </DialogHeader>

        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Résumé de la facture</CardTitle>
            <CardDescription>{invoice.customerName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total facture:</span>
              <span>€{invoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Déjà payé:</span>
              <span>€{invoice.paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Montant restant:</span>
              <span>€{invoice.remainingAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant du paiement (€) *</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                max={invoice.remainingAmount}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Mode de paiement *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mode" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Date de paiement *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="pl-10"
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="N° chèque, référence virement..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes sur le paiement..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={amount <= 0 || amount > invoice.remainingAmount || !paymentMethod}>
              Enregistrer le paiement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
