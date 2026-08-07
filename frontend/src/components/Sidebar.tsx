import {
  BotMessageSquare,
  ChartColumn,
  CircleQuestionMark,
  X,
  MessageCircleMore,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate()
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto bg-gray-800 p-4 pt-8 text-white shadow-2xl shadow-black/40 transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3 md:block">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <BotMessageSquare color="#6959CD" /> FAQBOT
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10 md:hidden"
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      <ul className="space-y-2">
        <li>
          <button
            type="button"
            className="py-2 px-4 rounded hover:bg-gray-700 flex gap-2 items-center"
            onClick={() => handleNavigation('/')}
          >
            <MessageCircleMore size={20} />
            Chat
          </button>
        </li>
        {isAdmin && (
          <li>
            <button
              type="button"
              className="py-2 px-4 rounded hover:bg-gray-700 flex gap-2 items-center"
              onClick={() => handleNavigation('/dashboard')}
            >
              <ChartColumn size={20} />
              Dashboard
            </button>
          </li>
        )}
        {isAdmin && (
          <li>
            <button
              type="button"
              className="py-2 px-4 rounded hover:bg-gray-700 flex gap-2 items-center"
              onClick={() => handleNavigation('/faq')}
            >
              <CircleQuestionMark size={20} />
              FAQ
            </button>
          </li>
        )}
      </ul>
    </aside>
  )
}
