"use client"

import { useAuth } from "@/contexts/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { SettingsPanel } from "@/components/admin/settings-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()

  if (user?.role !== "admin") {
    return (
      <MainLayout>
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Accès restreint
            </CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder aux paramètres système.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Seuls les administrateurs peuvent modifier les paramètres du système.
            </p>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <SettingsPanel />
    </MainLayout>
  )
}
