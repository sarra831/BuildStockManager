"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"
import { mockNotifications, mockSystemAlerts } from "@/lib/mock-audit"
import type { Notification, SystemAlert } from "@/types/audit"
import Link from "next/link"

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockSystemAlerts)

  const unreadCount = notifications.filter((n) => !n.read).length
  const unresolvedAlerts = alerts.filter((a) => !a.resolved)

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const resolveAlert = (id: string) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id
          ? {
              ...a,
              resolved: true,
              resolvedBy: "Utilisateur actuel",
              resolvedAt: new Date(),
            }
          : a,
      ),
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
      default:
        return "default"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `Il y a ${minutes} min`
    } else if (hours < 24) {
      return `Il y a ${hours}h`
    } else {
      return `Il y a ${days}j`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Gérez vos alertes et notifications système</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {unreadCount} non lue{unreadCount !== 1 ? "s" : ""}
          </Badge>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Tout marquer lu
            </Button>
          )}
        </div>
      </div>

      {/* System Alerts */}
      {unresolvedAlerts.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alertes système ({unresolvedAlerts.length})
            </CardTitle>
            <CardDescription>Alertes nécessitant une attention immédiate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unresolvedAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getAlertSeverityColor(alert.severity) as any}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{alert.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(alert.timestamp)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                    Résoudre
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    !notification.read ? "bg-muted/50" : "bg-background"
                  }`}
                >
                  <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {notification.title}
                      </span>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <Link href={notification.actionUrl}>
                            <Button variant="outline" size="sm">
                              Voir
                            </Button>
                          </Link>
                        )}
                        {!notification.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
