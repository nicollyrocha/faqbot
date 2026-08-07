import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import MainLayout from './layouts/MainLayout'
import { FaqPage } from './pages/faq'
import { DashboardPage } from './pages/dashboard'
import { RequireAdmin } from './components/RequireAdmin'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route element={<RequireAdmin />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
