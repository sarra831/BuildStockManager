"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Users,
  Package,
  ShoppingCart,
  FileText,
  TrendingUp,
  AlertTriangle,
  Activity,
  Settings,
  Database,
} from "lucide-react"
import { mockSystemStats, mockAuditLogs } from "@/lib/mock-admin"

export function AdminDashboard() {
  const stats = mockSystemStats
  const recentLogs = mockAuditLogs.slice(0, 5)

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "default"
      case "UPDATE":
        return "secondary"
      case "DELETE":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "CREATE":
        return "Création"
      case "UPDATE":
        return "Modification"
      case "DELETE":
        return "Suppression"
      default:
        return action
    }
  }

  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case "inventory_item":
        return "Article"
      case "order":
        return "Commande"
      case "invoice":
        return "Facture"
      case "user":
        return "Utilisateur"
      case "system_settings":
        return "Paramètres"
      default:
        return entity
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground">Vue d'ensemble du système et gestion des utilisateurs</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground">{stats.activeUsers} actifs</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Articles</p>
                <p className="text-2xl font-bold">{stats.totalInventoryItems}</p>
                <p className="text-xs text-muted-foreground">{stats.lowStockItems} en stock faible</p>
              </div>
              <Package className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-xs text-muted-foreground">{stats.pendingOrders} en attente</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Factures</p>
                <p className="text-2xl font-bold">{stats.totalInvoices}</p>
                <p className="text-xs text-muted-foreground">{stats.overdueInvoices} en retard</p>
              </div>
              <FileText className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Chiffre d'affaires
            </CardTitle>
            <CardDescription>Performance financière</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">
                  €{stats.totalRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ce mois</p>
                <p className="text-xl font-semibold">
                  €{stats.monthlyRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alertes système
            </CardTitle>
            <CardDescription>Points d'attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-destructive">Stock faible</p>
                  <p className="text-xs text-muted-foreground">{stats.lowStockItems} articles concernés</p>
                </div>
                <Badge variant="destructive">Critique</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-accent">Factures en retard</p>
                  <p className="text-xs text-muted-foreground">{stats.overdueInvoices} factures impayées</p>
                </div>
                <Badge variant="secondary">Attention</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Actions rapides
          </CardTitle>
          <CardDescription>Raccourcis vers les fonctions d'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Users className="h-6 w-6 mb-2" />
              Gérer les utilisateurs
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Settings className="h-6 w-6 mb-2" />
              Paramètres système
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Database className="h-6 w-6 mb-2" />
              Sauvegarde
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Activité récente
          </CardTitle>
          <CardDescription>Dernières actions effectuées dans le système</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entité</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{log.userName}</p>
                      <p className="text-xs text-muted-foreground">{log.userRole}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionColor(log.action)}>{getActionLabel(log.action)}</Badge>
                  </TableCell>
                  <TableCell>{getEntityLabel(log.entity)}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{log.timestamp.toLocaleDateString("fr-FR")}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
