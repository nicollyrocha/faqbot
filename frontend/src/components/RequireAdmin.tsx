import { Navigate, Outlet, useLocation } from 'react-router-dom'

export const RequireAdmin = () => {
  const location = useLocation()
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <Outlet />
}
