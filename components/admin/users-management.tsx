"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Users, Shield } from "lucide-react"
import { mockUsers } from "@/lib/mock-admin"
import type { User } from "@/types/auth"
import { CreateUserDialog } from "./create-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { ViewToggle } from "@/components/common/view-toggle"


export function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [view, setView] = useState<"table" | "grid" | "cards">("table")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "inventory_manager":
        return "secondary"
      case "commercial_manager":
        return "default"
      default:
        return "outline"
    }
  }

  const getRoleLabel = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "inventory_manager":
        return "Responsable Inventaire"
      case "commercial_manager":
        return "Responsable Commercial"
      default:
        return role
    }
  }

  const handleCreateUser = (newUser: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setUsers([...users, user])
    setShowCreateDialog(false)
  }

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? { ...updatedUser, updatedAt: new Date() } : user)))
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const roleOptions = [
    { value: "all", label: "Tous les rôles" },
    { value: "admin", label: "Administrateur" },
    { value: "inventory_manager", label: "Responsable Inventaire" },
    { value: "commercial_manager", label: "Responsable Commercial" },
  ]

  const UserCard = ({ user }: { user: User }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Date de création</p>
            <p className="font-medium">{user.createdAt.toLocaleDateString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Dernière modification</p>
            <p className="font-medium">{user.updatedAt.toLocaleDateString("fr-FR")}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => setEditingUser(user)} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteUser(user.id)}
            disabled={user.role === "admin" && users.filter((u) => u.role === "admin").length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nouvel utilisateur</span>
          <span className="sm:hidden">Nouveau</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total utilisateurs</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Administrateurs</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</p>
              </div>
              <Shield className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resp. Inventaire</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "inventory_manager").length}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resp. Commercial</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "commercial_manager").length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Utilisateurs ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {view === "table" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="hidden lg:table-cell">Date de création</TableHead>
                    <TableHead className="hidden lg:table-cell">Dernière modification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{user.email}</p>
                          <div className="lg:hidden text-xs text-muted-foreground mt-1">
                            Créé: {user.createdAt.toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.createdAt.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.updatedAt.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === "admin" && users.filter((u) => u.role === "admin").length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}

          {view === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateUserDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onCreateUser={handleCreateUser} />

      {editingUser && (
        <EditUserDialog
          open={!!editingUser}
          onOpenChange={() => setEditingUser(null)}
          user={editingUser}
          onEditUser={handleEditUser}
        />
      )}
    </div>
  )
}
