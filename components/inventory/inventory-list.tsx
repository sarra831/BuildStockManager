"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, AlertTriangle, Package, Eye } from "lucide-react"
import { mockInventoryItems, mockCategories } from "@/lib/mock-data"
import type { InventoryItem } from "@/types/inventory"
import { AddItemDialog } from "./add-item-dialog"
import { EditItemDialog } from "./edit-item-dialog"
import { useAuth } from "@/contexts/auth-context"

export function InventoryList() {
  const { user } = useAuth()
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const canModifyInventory = user?.role === "admin" || user?.role === "inventory_manager"
  const isCommercialUser = user?.role === "commercial_manager"

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const lowStockItems = items.filter((item) => item.currentStock <= item.reorderLevel)

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.reorderLevel * 0.5) {
      return { status: "critical", color: "destructive" as const }
    } else if (item.currentStock <= item.reorderLevel) {
      return { status: "low", color: "secondary" as const }
    }
    return { status: "normal", color: "default" as const }
  }

  const formatUnit = (unit: string) => {
    const units = {
      kg: "kg",
      tonnes: "t",
      m3: "m³",
      m2: "m²",
      pieces: "pcs",
      sacs: "sacs",
      litres: "L",
    }
    return units[unit as keyof typeof units] || unit
  }

  const handleAddItem = (newItem: Omit<InventoryItem, "id" | "createdAt" | "lastUpdated" | "totalValue">) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      totalValue: newItem.currentStock * newItem.unitPrice,
      createdAt: new Date(),
      lastUpdated: new Date(),
    }
    setItems([...items, item])
    setShowAddDialog(false)
  }

  const handleEditItem = (updatedItem: InventoryItem) => {
    setItems(
      items.map((item) =>
        item.id === updatedItem.id
          ? { ...updatedItem, totalValue: updatedItem.currentStock * updatedItem.unitPrice, lastUpdated: new Date() }
          : item,
      ),
    )
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventaire</h1>
          <p className="text-muted-foreground">
            {isCommercialUser
              ? "Consultez la disponibilité des matériaux avant facturation"
              : "Gérez votre stock de matériaux de construction"}
          </p>
        </div>
        {canModifyInventory && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un article
          </Button>
        )}
        {isCommercialUser && (
          <Badge variant="secondary" className="flex items-center">
            <Eye className="mr-1 h-3 w-3" />
            Consultation seule
          </Badge>
        )}
      </div>

      {/* Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alertes Stock ({lowStockItems.length})
            </CardTitle>
            <CardDescription>
              {isCommercialUser
                ? "Articles avec stock faible - vérifiez la disponibilité avant facturation"
                : "Articles nécessitant un réapprovisionnement"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((item) => {
                const stockStatus = getStockStatus(item)
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.currentStock} {formatUnit(item.unit)} restant(s)
                      </p>
                    </div>
                    <Badge variant={stockStatus.color}>
                      {stockStatus.status === "critical" ? "Critique" : "Faible"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Articles en stock ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Stock actuel</TableHead>
                  <TableHead>Seuil de réappro</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Valeur totale</TableHead>
                  <TableHead>Statut</TableHead>
                  {canModifyInventory && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item)
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>
                        {item.currentStock} {formatUnit(item.unit)}
                      </TableCell>
                      <TableCell>
                        {item.reorderLevel} {formatUnit(item.unit)}
                      </TableCell>
                      <TableCell>€{item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>€{item.totalValue.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color}>
                          {stockStatus.status === "critical"
                            ? "Critique"
                            : stockStatus.status === "low"
                              ? "Faible"
                              : "Normal"}
                        </Badge>
                      </TableCell>
                      {canModifyInventory && (
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                            Modifier
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {canModifyInventory && (
        <>
          <AddItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAddItem={handleAddItem} />

          {editingItem && (
            <EditItemDialog
              open={!!editingItem}
              onOpenChange={() => setEditingItem(null)}
              item={editingItem}
              onEditItem={handleEditItem}
            />
          )}
        </>
      )}
    </div>
  )
}
