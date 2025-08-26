"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { InvoicesList } from "@/components/invoicing/invoices-list"

export default function InvoicingPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <InvoicesList />
      </div>
    </MainLayout>
  )
}
