import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface GlobalContextProps {
  isAuth: boolean
  setAuth: () => void
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setAuth] = useState<boolean>(false)

  return (
    <GlobalContext.Provider value={{ isAuth, setAuth }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}
