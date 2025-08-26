"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Clock, Package, AlertTriangle } from "lucide-react"
import { mockReservations } from "@/lib/mock-orders"
import type { Reservation } from "@/types/orders"

export function ReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "expired":
        return "destructive"
      case "fulfilled":
        return "default"
      case "cancelled":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: Reservation["status"]) => {
    switch (status) {
      case "active":
        return "Active"
      case "expired":
        return "Expirée"
      case "fulfilled":
        return "Honorée"
      case "cancelled":
        return "Annulée"
      default:
        return status
    }
  }

  const isExpiringSoon = (reservedUntil: Date) => {
    const now = new Date()
    const timeDiff = reservedUntil.getTime() - now.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff <= 2 && daysDiff > 0
  }

  const isExpired = (reservedUntil: Date) => {
    return new Date() > reservedUntil
  }

  const handleUpdateStatus = (reservationId: string, newStatus: Reservation["status"]) => {
    setReservations(
      reservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation,
      ),
    )
  }

  const activeReservations = reservations.filter((r) => r.status === "active")
  const expiringSoon = activeReservations.filter((r) => isExpiringSoon(r.reservedUntil))
  const expired = reservations.filter((r) => isExpired(r.reservedUntil) && r.status === "active")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Réservations</h1>
        <p className="text-muted-foreground">Gérez les réservations de stock pour vos clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Réservations actives</p>
                <p className="text-2xl font-bold">{activeReservations.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expirent bientôt</p>
                <p className="text-2xl font-bold">{expiringSoon.length}</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expirées</p>
                <p className="text-2xl font-bold">{expired.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Soon Alert */}
      {expiringSoon.length > 0 && (
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <Clock className="mr-2 h-5 w-5" />
              Réservations expirant bientôt ({expiringSoon.length})
            </CardTitle>
            <CardDescription>Ces réservations expirent dans les 2 prochains jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-medium">{reservation.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantité: {reservation.quantity} - Expire le{" "}
                      {reservation.reservedUntil.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Badge variant="secondary">Expire bientôt</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Toutes les réservations ({reservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Réservé jusqu'au</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => {
                  const expiring = isExpiringSoon(reservation.reservedUntil)
                  const expired = isExpired(reservation.reservedUntil)

                  return (
                    <TableRow key={reservation.id} className={expired ? "bg-destructive/5" : ""}>
                      <TableCell className="font-medium">{reservation.itemName}</TableCell>
                      <TableCell>{reservation.quantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {reservation.reservedUntil.toLocaleDateString("fr-FR")}
                          {expiring && <Clock className="h-4 w-4 text-accent" />}
                          {expired && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(expired ? "expired" : reservation.status)}>
                          {getStatusLabel(expired ? "expired" : reservation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{reservation.createdAt.toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>
                        {reservation.status === "active" && !expired && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(reservation.id, "fulfilled")}
                            >
                              Honorer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(reservation.id, "cancelled")}
                            >
                              Annuler
                            </Button>
                          </div>
                        )}
                        {expired && reservation.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(reservation.id, "expired")}
                          >
                            Marquer expirée
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
