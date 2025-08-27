"use client"
import { useCurrency } from "@/contexts/currency-context"

import type { Invoice } from "@/types/invoicing"
import { DOCUMENT_TYPES } from "@/types/invoicing"

interface ProfessionalInvoiceTemplateProps {
  invoice: Invoice
  companyInfo?: {
    name: string
    address: string
    phone: string
    taxId: string
  }
}

export function ProfessionalInvoiceTemplate({
  invoice,
  companyInfo = {
    name: "STE SAKLI CERAMIC",
    address: "Route ceinture Km 1.4 cité El Nasser Médenine Tél : 98 750 509",
    phone: "98 750 509",
    taxId: "1419140/Q/A/M/000",
  },
}: ProfessionalInvoiceTemplateProps) {
  const { formatPrice } = useCurrency()

  const documentConfig = DOCUMENT_TYPES.find((d) => d.type === invoice.documentType) || DOCUMENT_TYPES[0]

  const formatUnit = (unit: string) => {
    const units = {
      kg: "kg",
      tonnes: "t",
      m3: "m³",
      m2: "m²",
      pieces: "P",
      sacs: "sacs",
      litres: "L",
    }
    return units[unit as keyof typeof units] || unit
  }

  const getDocumentTitle = () => {
    const docNumber = invoice.invoiceNumber
    switch (invoice.documentType) {
      case "bon_livraison":
        return `BON DE LIVRAISON N° ${docNumber}`
      case "bon_achat":
        return `BON D'ACHAT N° ${docNumber}`
      case "devis":
        return `DEVIS N° ${docNumber}`
      default:
        return `FACTURE N° ${docNumber}`
    }
  }

  const calculateTaxBreakdown = () => {
    const taxRates = [6, 12, 18] // Different tax rates
    const breakdown = taxRates.map((rate) => {
      const itemsWithRate = invoice.items.filter(
        (item) => Math.abs((item.totalPrice * rate) / 100 - (item.totalPrice * invoice.taxRate) / 100) < 0.01,
      )
      const base = itemsWithRate.reduce((sum, item) => sum + item.totalPrice, 0)
      const tax = (base * rate) / 100
      return { rate: `${rate} - ${rate + 5}`, base, tax }
    })

    return breakdown.filter((b) => b.base > 0)
  }

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className="border-2 border-black mb-4">
        <div className="text-center py-2 bg-gray-100 border-b border-black">
          <h1 className="text-xl font-bold">{companyInfo.name}</h1>
        </div>

        <div className="p-4 space-y-2">
          <div className="text-center">
            <p className="font-semibold">VENTE EN GROS FAIENCE ET SANITAIRE</p>
            <p className="text-sm">{companyInfo.address}</p>
            <p className="text-sm">Code TVA : {companyInfo.taxId}</p>
          </div>

          <div className="text-center py-2">
            <h2 className="text-lg font-bold underline">{getDocumentTitle()}</h2>
          </div>
        </div>
      </div>

      {/* Client and Date Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="space-y-1">
          <div className="flex">
            <span className="font-semibold w-20">Date :</span>
            <span>{invoice.invoiceDate.toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-20">Client :</span>
            <span>
              {invoice.customerId} - {invoice.customerName}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-20">Adresse :</span>
            <span>{invoice.customerAddress}</span>
          </div>
        </div>

        <div className="space-y-1">
          {documentConfig.showDriver && invoice.driverName && (
            <div className="flex">
              <span className="font-semibold w-20">Chauffeur :</span>
              <span>{invoice.driverName}</span>
            </div>
          )}
          {invoice.customerTaxId && (
            <div className="flex">
              <span className="font-semibold w-20">C.TVA :</span>
              <span>{invoice.customerTaxId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="border border-black mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black p-2 text-left">Réf.</th>
              <th className="border-r border-black p-2 text-left">Désignation</th>
              <th className="border-r border-black p-2 text-center">Qté</th>
              <th className="border-r border-black p-2 text-center">Unité</th>
              <th className="border-r border-black p-2 text-center">Prix unitaire</th>
              {documentConfig.showTax && (
                <>
                  <th className="border-r border-black p-2 text-center">T.V.A</th>
                  <th className="border-r border-black p-2 text-center">Rem</th>
                </>
              )}
              <th className="p-2 text-center">Prix total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className="border-b border-black">
                <td className="border-r border-black p-2">{item.itemCode || `REF${index + 1}`}</td>
                <td className="border-r border-black p-2">{item.itemName}</td>
                <td className="border-r border-black p-2 text-center">{item.quantity}</td>
                <td className="border-r border-black p-2 text-center">{formatUnit(item.unit)}</td>
                <td className="border-r border-black p-2 text-center">{formatPrice(item.unitPrice)}</td>
                {documentConfig.showTax && (
                  <>
                    <td className="border-r border-black p-2 text-center">{invoice.taxRate}</td>
                    <td className="border-r border-black p-2 text-center">-</td>
                  </>
                )}
                <td className="p-2 text-center">{formatPrice(item.totalPrice)}</td>
              </tr>
            ))}

            {/* Empty rows for spacing */}
            {Array.from({ length: Math.max(0, 10 - invoice.items.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b border-black">
                <td className="border-r border-black p-2 h-8">&nbsp;</td>
                <td className="border-r border-black p-2">&nbsp;</td>
                <td className="border-r border-black p-2">&nbsp;</td>
                <td className="border-r border-black p-2">&nbsp;</td>
                <td className="border-r border-black p-2">&nbsp;</td>
                {documentConfig.showTax && (
                  <>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                  </>
                )}
                <td className="p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tax Breakdown and Totals */}
      {documentConfig.showTax && (
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="border border-black">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black">
                  <th className="border-r border-black p-2">T.V.A.</th>
                  <th className="border-r border-black p-2">Base</th>
                  <th className="border-r border-black p-2">Montant</th>
                  <th className="p-2">Redevance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-2">6 - 7.5</td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="p-2"></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-2">12 - 15</td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="p-2"></td>
                </tr>
                <tr>
                  <td className="border-r border-black p-2">18 - 22.5</td>
                  <td className="border-r border-black p-2">{formatPrice(invoice.subtotal)}</td>
                  <td className="border-r border-black p-2">0.000</td>
                  <td className="p-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-black">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-2 font-semibold">Total HTTVA</td>
                  <td className="p-2 text-right font-semibold">{formatPrice(invoice.subtotal)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-2">Remise</td>
                  <td className="p-2 text-right">0.000</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-2">Total TVA</td>
                  <td className="p-2 text-right">{formatPrice(invoice.taxAmount)}</td>
                </tr>
                <tr>
                  <td className="border-r border-black p-2 font-bold">Total TTC</td>
                  <td className="p-2 text-right font-bold">{formatPrice(invoice.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-sm">
        <p className="mb-2">
          <span className="font-semibold">Arrêter le présent {documentConfig.label.toLowerCase()} à la somme de :</span>{" "}
          CINQ MILLE QUATRE CENT CINQUANTE DINARS 281 MILLIMES .
        </p>
      </div>
    </div>
  )
}
