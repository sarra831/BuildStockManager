"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CurrencySettings {
  code: string
  symbol: string
  name: string
  position: "before" | "after"
}

const currencies: Record<string, CurrencySettings> = {
  TND: { code: "TND", symbol: "د.ت", name: "Dinar Tunisien", position: "after" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", position: "after" },
  USD: { code: "USD", symbol: "$", name: "Dollar US", position: "before" },
}

interface CurrencyContextType {
  currency: CurrencySettings
  setCurrency: (currencyCode: string) => void
  formatPrice: (amount: number) => string
  currencies: Record<string, CurrencySettings>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<string>("TND")

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("buildstock-currency")
    if (savedCurrency && currencies[savedCurrency]) {
      setCurrentCurrency(savedCurrency)
    }
  }, [])

  const setCurrency = (currencyCode: string) => {
    if (currencies[currencyCode]) {
      setCurrentCurrency(currencyCode)
      localStorage.setItem("buildstock-currency", currencyCode)
    }
  }

  const formatPrice = (amount: number): string => {
    const currency = currencies[currentCurrency]
    const formattedAmount = amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })

    return currency.position === "before"
      ? `${currency.symbol}${formattedAmount}`
      : `${formattedAmount} ${currency.symbol}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency: currencies[currentCurrency],
        setCurrency,
        formatPrice,
        currencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
