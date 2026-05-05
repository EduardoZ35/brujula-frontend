import { createContext, useContext, useState, useCallback } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('oraculo_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('oraculo_token')
    if (!token) return false
    setLoading(true)
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
      localStorage.setItem('oraculo_user', JSON.stringify(data.user))
      return true
    } catch {
      setUser(null)
      localStorage.removeItem('oraculo_token')
      localStorage.removeItem('oraculo_user')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  function setToken(token) {
    localStorage.setItem('oraculo_token', token)
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('oraculo_token')
    localStorage.removeItem('oraculo_user')
    window.location.href = import.meta.env.VITE_PORTAL_URL ?? 'https://oraculo-app.cl'
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, fetchMe, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
