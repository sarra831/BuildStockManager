"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { OrdersList } from "@/components/orders/orders-list"

export default function OrdersPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <OrdersList />
      </div>
    </MainLayout>
  )
}
