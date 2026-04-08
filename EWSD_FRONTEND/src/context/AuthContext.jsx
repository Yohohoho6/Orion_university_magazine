import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { useGetCurrentUser } from '@/features/auth/hooks/useGetCurrentUser'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { data, isPending } = useGetCurrentUser()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [lastLogin, setLastLogin] = useState(null)
  const [welcomeMessage, setWelcomeMessage] = useState(null)

  useEffect(() => {
    if (!isPending) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      setUser(data?.user)
      
      // Always sync is_new_user from backend to localStorage
      if (data?.meta?.is_new_user) {
        setWelcomeMessage("Welcome to our platform! We're excited to have you here.")
        setLastLogin(null)
        localStorage.setItem("is_new_user", "true")
      } else {
        setWelcomeMessage(null)
        setLastLogin(data?.meta?.last_login)
        localStorage.setItem("is_new_user", "false")
      }
    }
  }, [isPending, data])

  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    lastLogin,
    setLastLogin,
    welcomeMessage,
    setWelcomeMessage
  }), [user, loading, lastLogin, welcomeMessage])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
