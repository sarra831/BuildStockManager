"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <ReportsDashboard />
      </div>
    </MainLayout>
  )
}
