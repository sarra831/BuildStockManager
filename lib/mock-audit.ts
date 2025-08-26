import type { AuditLog, Notification, SystemAlert } from "@/types/audit"

export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-1",
    userId: "user-1",
    userName: "Marie Dubois",
    userRole: "admin",
    action: "CREATE",
    entity: "USER",
    entityId: "user-4",
    details: "Création d'un nouvel utilisateur: Jean Martin (commercial_manager)",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    ipAddress: "192.168.1.100",
    severity: "info",
  },
  {
    id: "audit-2",
    userId: "user-2",
    userName: "Pierre Martin",
    userRole: "inventory_manager",
    action: "UPDATE",
    entity: "INVENTORY",
    entityId: "item-1",
    details: "Mise à jour du stock: Ciment Portland - Nouveau stock: 120 tonnes",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    ipAddress: "192.168.1.101",
    severity: "info",
  },
  {
    id: "audit-3",
    userId: "user-3",
    userName: "Sophie Leroy",
    userRole: "commercial_manager",
    action: "CREATE",
    entity: "INVOICE",
    entityId: "inv-1",
    details: "Création d'une nouvelle facture pour Construction ABC - Montant: €2,450.00",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    ipAddress: "192.168.1.102",
    severity: "info",
  },
  {
    id: "audit-4",
    userId: "user-2",
    userName: "Pierre Martin",
    userRole: "inventory_manager",
    action: "ALERT",
    entity: "INVENTORY",
    entityId: "item-5",
    details: "Alerte stock faible: Briques creuses - Stock actuel: 800 pcs (Seuil: 1000 pcs)",
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    ipAddress: "192.168.1.101",
    severity: "warning",
  },
  {
    id: "audit-5",
    userId: "user-1",
    userName: "Marie Dubois",
    userRole: "admin",
    action: "LOGIN",
    entity: "SYSTEM",
    details: "Connexion réussie au système",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    ipAddress: "192.168.1.100",
    severity: "info",
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "warning",
    title: "Stock faible",
    message: "8 articles ont un stock inférieur au seuil de réapprovisionnement",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
    actionUrl: "/inventory",
    priority: "high",
  },
  {
    id: "notif-2",
    type: "error",
    title: "Facture en retard",
    message: "La facture #INV-2024-001 est en retard de paiement (7 jours)",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: "/invoicing",
    priority: "critical",
  },
  {
    id: "notif-3",
    type: "success",
    title: "Commande livrée",
    message: "La commande #CMD-2024-045 a été marquée comme livrée",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
    actionUrl: "/orders",
    priority: "medium",
  },
  {
    id: "notif-4",
    type: "info",
    title: "Nouveau utilisateur",
    message: "Un nouvel utilisateur a été ajouté au système",
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    read: true,
    actionUrl: "/users",
    priority: "low",
  },
]

export const mockSystemAlerts: SystemAlert[] = [
  {
    id: "alert-1",
    type: "low_stock",
    title: "Stock critique",
    description: "Plusieurs articles ont atteint un niveau de stock critique",
    severity: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    resolved: false,
  },
  {
    id: "alert-2",
    type: "overdue_invoice",
    title: "Factures en retard",
    description: "3 factures sont en retard de paiement",
    severity: "error",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    resolved: false,
  },
  {
    id: "alert-3",
    type: "system_error",
    title: "Erreur système",
    description: "Erreur lors de la synchronisation des données",
    severity: "critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    resolved: true,
    resolvedBy: "Marie Dubois",
    resolvedAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
]
