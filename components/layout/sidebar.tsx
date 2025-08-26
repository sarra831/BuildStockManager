"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const userNavigation = navigation[user.role] || []

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <Building2 className="h-8 w-8 text-sidebar-accent" />
        <span className="ml-2 text-lg font-semibold text-sidebar-foreground">BuildStock</span>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="mb-4 px-3">
          <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
            {user.role === "admin" && "Administrateur"}
            {user.role === "inventory_manager" && "Responsable Inventaire"}
            {user.role === "commercial_manager" && "Responsable Commercial"}
          </p>
          <p className="text-sm font-medium text-sidebar-foreground mt-1 truncate">{user.name}</p>
        </div>

        <nav className="space-y-1">
          {userNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-sm",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-primary text-sm"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Déconnexion</span>
        </Button>
      </div>
    </div>
  )
}
