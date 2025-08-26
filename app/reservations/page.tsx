"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { ReservationsList } from "@/components/orders/reservations-list"

export default function ReservationsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <ReservationsList />
      </div>
    </MainLayout>
  )
}
