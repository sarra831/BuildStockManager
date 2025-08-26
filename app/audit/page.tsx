"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { AuditLogComponent } from "@/components/audit/audit-log"

export default function AuditPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <AuditLogComponent />
      </div>
    </MainLayout>
  )
}
