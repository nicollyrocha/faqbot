import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-4 z-50 rounded-xl border border-white/10 bg-slate-900/90 p-3 text-white shadow-lg shadow-black/30 backdrop-blur md:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
      )}

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/55 md:hidden"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="h-screen flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
