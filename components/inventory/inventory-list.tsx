"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, AlertTriangle, Package, Eye, Edit } from "lucide-react"
import { mockInventoryItems, mockCategories } from "@/lib/mock-data"
import type { InventoryItem } from "@/types/inventory"
import { AddItemDialog } from "./add-item-dialog"
import { EditItemDialog } from "./edit-item-dialog"
import { useAuth } from "@/contexts/auth-context"
import { ViewToggle } from "@/components/common/view-toggle"

export function InventoryList() {
  const { user } = useAuth()
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [view, setView] = useState<"table" | "grid" | "cards">("table")

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

  const InventoryCard = ({ item }: { item: InventoryItem }) => {
    const stockStatus = getStockStatus(item)
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              {item.description && <CardDescription className="mt-1">{item.description}</CardDescription>}
            </div>
            <Badge variant={stockStatus.color}>
              {stockStatus.status === "critical" ? "Critique" : stockStatus.status === "low" ? "Faible" : "Normal"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Catégorie</p>
              <p className="font-medium">{item.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fournisseur</p>
              <p className="font-medium">{item.supplier}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stock actuel</p>
              <p className="font-medium">
                {item.currentStock} {formatUnit(item.unit)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Seuil réappro</p>
              <p className="font-medium">
                {item.reorderLevel} {formatUnit(item.unit)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Prix unitaire</p>
              <p className="font-medium">€{item.unitPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valeur totale</p>
              <p className="font-medium">€{item.totalValue.toFixed(2)}</p>
            </div>
          </div>
          {canModifyInventory && (
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditingItem(item)} className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventaire</h1>
          <p className="text-muted-foreground">
            {isCommercialUser
              ? "Consultez la disponibilité des matériaux avant facturation"
              : "Gérez votre stock de matériaux de construction"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isCommercialUser && (
            <Badge variant="secondary" className="flex items-center">
              <Eye className="mr-1 h-3 w-3" />
              Consultation seule
            </Badge>
          )}
          {canModifyInventory && (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Ajouter un article</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          )}
        </div>
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
          <div className="flex flex-col lg:flex-row gap-4">
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
            <div className="flex flex-col sm:flex-row gap-4">
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
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Articles en stock ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {view === "table" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                    <TableHead className="hidden lg:table-cell">Fournisseur</TableHead>
                    <TableHead>Stock actuel</TableHead>
                    <TableHead className="hidden sm:table-cell">Seuil de réappro</TableHead>
                    <TableHead className="hidden md:table-cell">Prix unitaire</TableHead>
                    <TableHead className="hidden lg:table-cell">Valeur totale</TableHead>
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
                            {item.description && (
                              <p className="text-sm text-muted-foreground md:hidden">{item.description}</p>
                            )}
                            <div className="md:hidden text-xs text-muted-foreground mt-1">
                              {item.category} • {item.supplier}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                        <TableCell className="hidden lg:table-cell">{item.supplier}</TableCell>
                        <TableCell>
                          <div>
                            <p>
                              {item.currentStock} {formatUnit(item.unit)}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              Seuil: {item.reorderLevel} {formatUnit(item.unit)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {item.reorderLevel} {formatUnit(item.unit)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">€{item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="hidden lg:table-cell">€{item.totalValue.toFixed(2)}</TableCell>
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
                              <Edit className="h-4 w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Modifier</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <InventoryCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {view === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <InventoryCard key={item.id} item={item} />
              ))}
            </div>
          )}
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
