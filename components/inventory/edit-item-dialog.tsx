"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { mockCategories, mockSuppliers } from "@/lib/mock-data"
import type { InventoryItem } from "@/types/inventory"

interface EditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem
  onEditItem: (item: InventoryItem) => void
}

export function EditItemDialog({ open, onOpenChange, item, onEditItem }: EditItemDialogProps) {
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

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || "",
        category: item.category,
        supplier: item.supplier,
        unit: item.unit,
        currentStock: item.currentStock,
        reorderLevel: item.reorderLevel,
        unitPrice: item.unitPrice,
      })
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEditItem({
      ...item,
      ...formData,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'article</DialogTitle>
          <DialogDescription>Modifiez les informations de l'article dans votre inventaire.</DialogDescription>
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
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                value={formData.supplier}
                onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un fournisseur" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit">Sauvegarder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
