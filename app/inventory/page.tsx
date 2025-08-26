"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { InventoryList } from "@/components/inventory/inventory-list"

export default function InventoryPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <InventoryList />
      </div>
    </MainLayout>
  )
}
