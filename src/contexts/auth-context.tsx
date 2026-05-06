import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'

import { auth } from '../firebase/config'

type AuthContextValue = {
  user: User | null
  loading: boolean
  firstName: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

const getFirstName = (user: User | null) => {
  const source = user?.displayName?.trim() || user?.email?.trim() || ''

  if (!source) {
    return ''
  }

  return source.split(' ')[0]
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firstName: getFirstName(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
