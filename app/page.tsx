"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/contexts/auth-context"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, FileText, TrendingUp } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()

  // Show admin dashboard for admin users
  if (user?.role === "admin") {
    return (
      <MainLayout>
        <div className="p-6">
          <AdminDashboard />
        </div>
      </MainLayout>
    )
  }

  // Regular dashboard for other users
  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2">Bienvenue, {user?.name}. Voici un aperçu de votre activité.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles en stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes actives</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+5% par rapport au mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">-8% par rapport au mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€45,231</div>
              <p className="text-xs text-muted-foreground">+18% par rapport au mois dernier</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Les dernières actions effectuées dans le système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouveau stock ajouté</p>
                    <p className="text-xs text-muted-foreground">Ciment Portland - 50 sacs</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 2h</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Commande livrée</p>
                    <p className="text-xs text-muted-foreground">CMD-2024-001 - Client Dupont</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 4h</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Facture générée</p>
                    <p className="text-xs text-muted-foreground">FAC-2024-156 - €2,450</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 6h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertes stock</CardTitle>
              <CardDescription>Articles nécessitant une attention particulière</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-destructive">Stock faible</p>
                    <p className="text-xs text-muted-foreground">Briques rouges - 15 restantes</p>
                  </div>
                  <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">Critique</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-accent">Stock faible</p>
                    <p className="text-xs text-muted-foreground">Sable fin - 2.5 tonnes</p>
                  </div>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Attention</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
