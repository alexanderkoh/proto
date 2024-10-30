'use client'

import React, { createContext, useContext, useState } from 'react'

interface ProteinContextType {
  proteinData: string | null
  setProteinData: (data: string | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ProteinContext = createContext<ProteinContextType | undefined>(undefined)

export function ProteinProvider({ children }: { children: React.ReactNode }) {
  const [proteinData, setProteinData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <ProteinContext.Provider value={{
      proteinData,
      setProteinData,
      isLoading,
      setIsLoading
    }}>
      {children}
    </ProteinContext.Provider>
  )
}

export function useProtein() {
  const context = useContext(ProteinContext)
  if (context === undefined) {
    throw new Error('useProtein must be used within a ProteinProvider')
  }
  return context
} 