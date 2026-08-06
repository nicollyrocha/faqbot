import { BotMessageSquare, ChartColumn, MessageCircleMore } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Sidebar = () => {
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 pt-8">
      <h2 className="text-xl font-bold mb-4 flex gap-2 items-center">
        <BotMessageSquare color="#6959CD" /> FAQBOT
      </h2>
      <ul className="space-y-2">
        <li>
          <a
            href="#"
            className="py-2 px-4 rounded hover:bg-gray-700 flex gap-2 items-center"
            onClick={() => handleNavigation('/')}
          >
            <MessageCircleMore size={20} />
            Chat
          </a>
        </li>
        <li>
          <a
            href="#"
            className="py-2 px-4 rounded hover:bg-gray-700 flex gap-2 items-center"
            onClick={() => handleNavigation('/dashboard')}
          >
            <ChartColumn size={20} />
            Dashboard
          </a>
        </li>
      </ul>
    </div>
  )
}
