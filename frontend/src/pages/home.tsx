import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import type { Message } from '../types/message'
import { TextArea } from '../components/TextArea'
import { MessageItem } from '../components/MessageItem'
import { Modal } from '../components/Modal'
import { Skeleton } from '../components/Skeleton'
import { TextInput } from '../components/TextInput'

export const Home = () => {
  const [msg, setMsg] = useState('')
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const [adminAccessKey, setAdminAccessKey] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(
    () => localStorage.getItem('adminToken') === null,
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [sendError, setSendError] = useState<string | null>(null)
  const [adminError, setAdminError] = useState<string | null>(null)

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

  const [sessionId] = useState(() => {
    let storedSessionId = localStorage.getItem('sessionId')

    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID()
      localStorage.setItem('sessionId', storedSessionId)
    }

    return storedSessionId
  })

  const handleAdminLogin = async () => {
    setAdminError(null)

    if (!adminAccessKey.trim()) {
      setAdminError('Informe a chave de acesso.')
      return
    }

    const response = await fetch(`${apiBaseUrl}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessKey: adminAccessKey,
      }),
    })

    if (!response.ok) {
      const errorData = (await response.json().catch(() => null)) as {
        message?: string
      } | null

      setAdminError(errorData?.message ?? 'Chave inválida.')
      return
    }

    const data = (await response.json()) as { token: string }
    localStorage.setItem('adminToken', data.token)
    window.location.reload()
  }

  const {
    data: historyData = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    error: historyError,
  } = useQuery({
    queryKey: ['interaction-history', apiBaseUrl, sessionId],
    queryFn: async () => {
      const response = await fetch(
        `${apiBaseUrl}/interactions?sessionId=${encodeURIComponent(sessionId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Falha ao consultar o histórico de mensagens')
      }

      return (await response.json()) as Array<{
        question?: string
        response?: string
        createdAt?: string
      }>
    },
  })

  const greetingMessage = useMemo(
    () => ({
      id: 'greeting-message',
      text: 'Olá! 👋 Como posso te ajudar?',
      sender: 'bot' as const,
      date: new Date(),
    }),
    [],
  )

  const formattedHistory = useMemo(() => {
    return historyData.flatMap((item, index) => {
      const createdAt = item.createdAt ? new Date(item.createdAt) : new Date()
      const questionMessage: Message | null = item.question
        ? {
            id: `history-question-${index}`,
            text: item.question,
            sender: 'user',
            date: createdAt,
          }
        : null

      const responseMessage: Message | null = item.response
        ? {
            id: `history-response-${index}`,
            text: item.response,
            sender: 'bot',
            date: createdAt,
          }
        : null

      return [questionMessage, responseMessage].filter(
        (message): message is Message => message !== null,
      )
    })
  }, [historyData])

  const visibleMessages = useMemo(() => {
    if (formattedHistory.length > 0) {
      return [...formattedHistory, ...messages]
    }

    return [greetingMessage, ...messages]
  }, [formattedHistory, greetingMessage, messages])

  const timelineItems = useMemo(() => {
    const sortedMessages = [...visibleMessages].sort((left, right) => {
      const leftTime = left.date ? new Date(left.date).getTime() : 0
      const rightTime = right.date ? new Date(right.date).getTime() : 0

      return leftTime - rightTime
    })

    const today = new Date()
    const items: Array<
      | { type: 'separator'; id: string; label: string }
      | { type: 'message'; id: string; message: Message }
    > = []
    let lastGroupKey = ''

    const getGroupLabel = (date: Date) => {
      const current = new Date(date)
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      )
      const yesterdayStart = new Date(todayStart)
      yesterdayStart.setDate(yesterdayStart.getDate() - 1)
      const messageStart = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
      )

      if (messageStart.getTime() === todayStart.getTime()) {
        return 'HOJE'
      }

      if (messageStart.getTime() === yesterdayStart.getTime()) {
        return 'ONTEM'
      }

      return new Intl.DateTimeFormat('pt-BR').format(current)
    }

    for (const message of sortedMessages) {
      const messageDate = message.date ? new Date(message.date) : today
      const groupKey = messageDate.toDateString()

      if (groupKey !== lastGroupKey) {
        items.push({
          type: 'separator',
          id: `separator-${groupKey}`,
          label: getGroupLabel(messageDate),
        })
        lastGroupKey = groupKey
      }

      items.push({
        type: 'message',
        id: message.id,
        message,
      })
    }

    return items
  }, [visibleMessages])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleMessages])

  const sendMessage = async () => {
    if (!msg.trim()) return

    setSendError(null)

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: msg,
      sender: 'user',
      date: new Date(),
    }

    const currentMessage = msg.trim()
    setMessages((prev) => [...prev, userMessage])
    setMsg('')

    try {
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          question: currentMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao consultar o chatbot')
      }

      const data = await response.json()

      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: data.answer,
        sender: 'bot',
        date: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      setSendError('Não foi possível enviar sua mensagem agora.')
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: 'Desculpe, não consegui responder agora.',
        sender: 'bot',
        date: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden px-3 pt-20 pb-5 md:pb-0 text-white md:px-8 md:pt-10">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Você é um administrador?"
      >
        <div className="flex flex-col gap-4">
          <TextInput
            label="Chave de acesso"
            value={adminAccessKey}
            onChange={setAdminAccessKey}
            placeholder="Digite a chave de administrador"
            type="password"
            required
          />

          {adminError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {adminError}
            </div>
          )}

          <div className="flex gap-5">
            <Button onClick={handleAdminLogin}>Acessar área admin</Button>
            <Button
              className="bg-red-500 hover:bg-red-700"
              onClick={() => setIsModalOpen(false)}
            >
              Continuar como usuário
            </Button>
          </div>
        </div>
      </Modal>

      <div className="text-2xl font-bold text-white sm:text-3xl">Chatbot</div>

      <div className="text-md font-light text-gray-400 mb-4">
        Tire suas dúvidas com nosso assistente virtual.
      </div>

      <Card className="flex w-full h-11/12 md:h-8/12 flex-col md:w-5xl md:flex-none md:self-center">
        <div className="flex h-full min-h-0 w-full flex-col gap-4">
          {isHistoryError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {(historyError as Error)?.message ??
                'Não foi possível carregar o histórico do chat.'}
            </div>
          )}

          <div className="chat-scroll flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto pr-2 md:h-96 md:flex-none">
            {isHistoryLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-8 w-28 self-center" />
                <Skeleton className="h-16 w-4/5 self-start" />
                <Skeleton className="h-16 w-4/5 self-end" />
                <Skeleton className="h-12 w-3/5 self-start" />
                <Skeleton className="h-16 w-4/5 self-end" />
              </div>
            ) : (
              timelineItems.map((item) =>
                item.type === 'separator' ? (
                  <div key={item.id} className="flex items-center gap-3 py-2">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                      {item.label}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                ) : (
                  <MessageItem key={item.id} message={item.message} />
                ),
              )
            )}
            <div ref={chatEndRef} />
          </div>

          {sendError && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {sendError}
            </div>
          )}

          <div className="flex gap-2 w-full">
            <TextArea
              placeholder="Digite sua pergunta..."
              value={msg}
              onChange={(e) => setMsg(e)}
              onkeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />

            <Button onClick={sendMessage}>Enviar</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
