"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import {
  Building2,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Clock,
  Shield,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = {
  admin: [
    { name: "Tableau de bord", href: "/", icon: BarChart3 },
    { name: "Inventaire", href: "/inventory", icon: Package },
    { name: "Commandes", href: "/orders", icon: ShoppingCart },
    { name: "Réservations", href: "/reservations", icon: Clock },
    { name: "Facturation", href: "/invoicing", icon: FileText },
    { name: "Rapports", href: "/reports", icon: BarChart3 },
    { name: "Utilisateurs", href: "/users", icon: Users },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Journal d'audit", href: "/audit", icon: Shield },
    { name: "Paramètres", href: "/settings", icon: Settings },
  ],
  inventory_manager: [
    { name: "Tableau de bord", href: "/", icon: BarChart3 },
    { name: "Inventaire", href: "/inventory", icon: Package },
    { name: "Commandes", href: "/orders", icon: ShoppingCart },
    { name: "Réservations", href: "/reservations", icon: Clock },
    { name: "Rapports", href: "/reports", icon: BarChart3 },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ],
  commercial_manager: [
    { name: "Tableau de bord", href: "/", icon: BarChart3 },
    { name: "Inventaire", href: "/inventory", icon: Package },
    { name: "Commandes", href: "/orders", icon: ShoppingCart },
    { name: "Réservations", href: "/reservations", icon: Clock },
    { name: "Facturation", href: "/invoicing", icon: FileText },
    { name: "Rapports", href: "/reports", icon: BarChart3 },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ],
}

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const userNavigation = navigation[user.role] || []

  const handleLinkClick = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center text-left">
            <Building2 className="h-6 w-6 text-primary mr-2" />
            BuildStock Manager
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 px-3 py-4">
          <div className="mb-4 px-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {user.role === "admin" && "Administrateur"}
              {user.role === "inventory_manager" && "Responsable Inventaire"}
              {user.role === "commercial_manager" && "Responsable Commercial"}
            </p>
            <p className="text-sm font-medium text-foreground mt-1">{user.name}</p>
          </div>

          <nav className="space-y-1">
            {userNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={handleLinkClick}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-accent"
            onClick={() => {
              logout()
              onOpenChange(false)
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
