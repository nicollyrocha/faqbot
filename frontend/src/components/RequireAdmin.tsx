import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export const RequireAdmin = () => {
  const location = useLocation()
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
  const adminToken = localStorage.getItem('adminToken')

  const sessionQuery = useQuery({
    queryKey: ['admin-session', apiBaseUrl, adminToken],
    enabled: Boolean(adminToken),
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/auth/admin/me`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Sessão de administrador inválida')
      }

      return (await response.json()) as { authenticated: boolean }
    },
    retry: false,
  })

  if (!adminToken) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  if (sessionQuery.isError) {
    localStorage.removeItem('adminToken')

    return <Navigate to="/" replace state={{ from: location }} />
  }

  if (sessionQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-300">
        Validando acesso de administrador...
      </div>
    )
  }

  return <Outlet />
}
