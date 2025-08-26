export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "inventory_manager" | "commercial_manager"
  createdAt: Date
  updatedAt: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}
