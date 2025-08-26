export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  entity: string
  entityId?: string
  details: string
  timestamp: Date
  ipAddress?: string
  severity: "info" | "warning" | "error" | "critical"
}

export interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId?: string
  actionUrl?: string
  priority: "low" | "medium" | "high" | "critical"
}

export interface SystemAlert {
  id: string
  type: "low_stock" | "overdue_invoice" | "system_error" | "security_alert"
  title: string
  description: string
  severity: "info" | "warning" | "error" | "critical"
  timestamp: Date
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
}
