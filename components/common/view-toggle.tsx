"use client"

import { Button } from "@/components/ui/button"
import { Grid3X3, List, LayoutGrid } from "lucide-react"

interface ViewToggleProps {
  view: "table" | "grid" | "cards"
  onViewChange: (view: "table" | "grid" | "cards") => void
  className?: string
}

export function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
  return (
    <div className={`flex items-center border rounded-lg p-1 ${className}`}>
      <Button
        variant={view === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="h-8 px-3"
      >
        <List className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Tableau</span>
      </Button>
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="h-8 px-3"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Grille</span>
      </Button>
      <Button
        variant={view === "cards" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("cards")}
        className="h-8 px-3"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Cartes</span>
      </Button>
    </div>
  )
}
