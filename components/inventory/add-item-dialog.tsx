"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { mockCategories, mockSuppliers } from "@/lib/mock-data"
import { AddNewCategoryDialog } from "@/components/common/add-new-category-dialog"
import { AddNewSupplierDialog } from "@/components/common/add-new-supplier-dialog"
import type { InventoryItem, Category, Supplier } from "@/types/inventory"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: Omit<InventoryItem, "id" | "createdAt" | "lastUpdated" | "totalValue">) => void
}

export function AddItemDialog({ open, onOpenChange, onAddItem }: AddItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    supplier: "",
    unit: "pieces" as const,
    currentStock: 0,
    reorderLevel: 0,
    unitPrice: 0,
  })

  const [categories, setCategories] = useState(mockCategories)
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false)
  const [showAddSupplierDialog, setShowAddSupplierDialog] = useState(false)

  const handleAddCategory = (newCategory: Omit<Category, "id">) => {
    const categoryWithId: Category = {
      ...newCategory,
      id: Date.now().toString(),
    }
    setCategories([...categories, categoryWithId])
    setFormData({ ...formData, category: categoryWithId.name })
  }

  const handleAddSupplier = (newSupplier: Omit<Supplier, "id">) => {
    const supplierWithId: Supplier = {
      ...newSupplier,
      id: Date.now().toString(),
    }
    setSuppliers([...suppliers, supplierWithId])
    setFormData({ ...formData, supplier: supplierWithId.name })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddItem(formData)
    setFormData({
      name: "",
      description: "",
      category: "",
      supplier: "",
      unit: "pieces",
      currentStock: 0,
      reorderLevel: 0,
      unitPrice: 0,
    })
  }

  const units = [
    { value: "kg", label: "Kilogrammes (kg)" },
    { value: "tonnes", label: "Tonnes (t)" },
    { value: "m3", label: "Mètres cubes (m³)" },
    { value: "m2", label: "Mètres carrés (m²)" },
    { value: "pieces", label: "Pièces (pcs)" },
    { value: "sacs", label: "Sacs" },
    { value: "litres", label: "Litres (L)" },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel article</DialogTitle>
            <DialogDescription>
              Ajoutez un nouvel article à votre inventaire avec tous les détails nécessaires.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'article *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Ciment Portland"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAddCategoryDialog(true)}
                    title="Ajouter une nouvelle catégorie"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée de l'article..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Fournisseur *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.supplier}
                    onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                    required
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.name}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAddSupplierDialog(true)}
                    title="Ajouter un nouveau fournisseur"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unité de mesure *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value: any) => setFormData({ ...formData, unit: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Stock actuel *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Seuil de réappro *</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Prix unitaire (€) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter l'article</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AddNewCategoryDialog
        open={showAddCategoryDialog}
        onOpenChange={setShowAddCategoryDialog}
        onAddCategory={handleAddCategory}
      />

      <AddNewSupplierDialog
        open={showAddSupplierDialog}
        onOpenChange={setShowAddSupplierDialog}
        onAddSupplier={handleAddSupplier}
      />
    </>
  )
}
