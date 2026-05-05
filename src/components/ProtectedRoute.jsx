import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL ?? 'https://oraculo-app.cl'

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated, fetchMe, setToken } = useAuth()
  const [checking, setChecking] = useState(true)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    async function init() {
      // Capturar token SSO desde URL (?token=...)
      const params = new URLSearchParams(window.location.search)
      const tokenFromUrl = params.get('token')
      if (tokenFromUrl) {
        setToken(tokenFromUrl)
        params.delete('token')
        const clean = params.toString()
        window.history.replaceState({}, '', window.location.pathname + (clean ? `?${clean}` : ''))
      }

      // Siempre validar token contra servidor (igual que gastos-v2)
      const ok = await fetchMe()
      if (!ok) {
        const returnTo = encodeURIComponent(window.location.origin)
        window.location.href = `${PORTAL_URL}/login?redirect=${returnTo}`
        return
      }
      setChecking(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (!checking && user && user.profile !== 'Super Administrador') {
      setForbidden(true)
    }
  }, [checking, user])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <span className="text-4xl">🔒</span>
        <h1 className="text-lg font-semibold text-slate-200">Acceso restringido</h1>
        <p className="text-sm text-slate-500">Esta aplicación es solo para administradores.</p>
        <a href={PORTAL_URL} className="text-sm text-sky-400 hover:text-sky-300 transition">
          Volver al portal
        </a>
      </div>
    )
  }

  return isAuthenticated ? children : null
}
