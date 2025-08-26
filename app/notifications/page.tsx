"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { NotificationsPanel } from "@/components/notifications/notifications-panel"

export default function NotificationsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <NotificationsPanel />
      </div>
    </MainLayout>
  )
}
