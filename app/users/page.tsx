"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { UsersManagement } from "@/components/admin/users-management"

export default function UsersPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <UsersManagement />
      </div>
    </MainLayout>
  )
}
