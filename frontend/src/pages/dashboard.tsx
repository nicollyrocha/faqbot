import {
  MessageSquare,
  MessageSquareCheck,
  MessageSquareMore,
  MessagesSquare,
} from 'lucide-react'
import { Card } from '../components/Card'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CustomBarChart } from '../components/BarChart'
import { DonutChart } from '../components/DonutChart'
import { TimeSeriesChart } from '../components/TimeSeriesChart'
import { Table } from '../components/Table'
import { Skeleton } from '../components/Skeleton'

type Interaction = {
  id: number
  sessionId: string
  question: string
  response: string | null
  matchedFaqId: number | null
  foundAnswer: boolean
  createdAt: string
}

type Faq = {
  id: number
  question: string
  category: string
}

export const DashboardPage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

  const interactionsQuery = useQuery({
    queryKey: ['dashboard-interactions', apiBaseUrl],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/interactions`)

      if (!response.ok) {
        throw new Error('Falha ao consultar interações')
      }

      return (await response.json()) as Interaction[]
    },
  })

  const faqsQuery = useQuery({
    queryKey: ['dashboard-faqs', apiBaseUrl],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/faq`)

      if (!response.ok) {
        throw new Error('Falha ao consultar FAQs')
      }

      return (await response.json()) as Faq[]
    },
  })

  const interactions = useMemo(
    () => interactionsQuery.data ?? [],
    [interactionsQuery.data],
  )
  const faqs = useMemo(() => faqsQuery.data ?? [], [faqsQuery.data])
  const isLoading = interactionsQuery.isLoading || faqsQuery.isLoading
  const errorMessage =
    (interactionsQuery.error as Error | null)?.message ??
    (faqsQuery.error as Error | null)?.message ??
    null

  const respondidas = interactions.filter(
    (interaction) => interaction.matchedFaqId !== null,
  ).length

  const naoRespondidas = interactions.filter(
    (interaction) => interaction.matchedFaqId === null,
  ).length

  const taxaResolucao =
    interactions.length > 0 ? (respondidas / interactions.length) * 100 : 0

  const perguntasDetectadas = useMemo(() => {
    const matchedCounts = interactions.reduce<Record<number, number>>(
      (accumulator, interaction) => {
        if (interaction.matchedFaqId === null) {
          return accumulator
        }

        accumulator[interaction.matchedFaqId] =
          (accumulator[interaction.matchedFaqId] ?? 0) + 1

        return accumulator
      },
      {},
    )

    return Object.entries(matchedCounts)
      .map(([faqId, value]) => {
        const faq = faqs.find((item) => item.id === Number(faqId))

        return {
          name: faq?.question ?? `FAQ ${faqId}`,
          value,
        }
      })
      .sort((left, right) => right.value - left.value)
  }, [faqs, interactions])

  const questionsPerCategory = useMemo(() => {
    const faqsById = new Map(faqs.map((faq) => [faq.id, faq]))

    const categoryCounts = interactions.reduce<Record<string, number>>(
      (accumulator, interaction) => {
        if (interaction.matchedFaqId === null) {
          return accumulator
        }

        const faq = faqsById.get(interaction.matchedFaqId)

        if (!faq) {
          return accumulator
        }

        const category = faq.category
        accumulator[category] = (accumulator[category] ?? 0) + 1

        return accumulator
      },
      {},
    )

    return Object.entries(categoryCounts).map(([category, value]) => ({
      name: category,
      value,
    }))
  }, [faqs, interactions])

  const frequentQuestionsRows = useMemo(
    () =>
      perguntasDetectadas.map((item, index) => [
        `${index + 1}- ${item.name}`,
        String(item.value),
      ]),
    [perguntasDetectadas],
  )

  const timeSeries = useMemo(() => {
    const getDateKey = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }

    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })

    if (interactions.length === 0) {
      return []
    }

    const sortedDates = interactions
      .map((interaction) => new Date(interaction.createdAt))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((left, right) => left.getTime() - right.getTime())

    if (sortedDates.length === 0) {
      return []
    }

    const startDate = new Date(sortedDates[0])
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(sortedDates[sortedDates.length - 1])
    endDate.setHours(23, 59, 59, 999)

    const counts = interactions.reduce<Record<string, number>>(
      (accumulator, interaction) => {
        const createdAt = new Date(interaction.createdAt)

        if (
          Number.isNaN(createdAt.getTime()) ||
          createdAt < startDate ||
          createdAt > endDate
        ) {
          return accumulator
        }

        const key = getDateKey(createdAt)
        accumulator[key] = (accumulator[key] ?? 0) + 1

        return accumulator
      },
      {},
    )

    const totalDays = Math.max(
      1,
      Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1,
    )

    return Array.from({ length: totalDays }, (_, index) => {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + index)
      const dateKey = getDateKey(currentDate)

      return {
        date: dateKey,
        label: formatter.format(currentDate),
        total: counts[dateKey] ?? 0,
      }
    })
  }, [interactions])

  if (isLoading) {
    return (
      <div className="flex flex-col px-4 py-6 pt-20 text-white sm:px-6 lg:px-8 lg:py-10">
        <Skeleton className="mb-3 h-8 w-40" />
        <Skeleton className="mb-4 h-5 w-72" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-3xl" />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_0.5fr]">
          <Skeleton className="h-90 rounded-3xl" />
          <Skeleton className="h-90 rounded-3xl" />
        </div>

        <Skeleton className="mt-6 h-90 rounded-3xl" />
        <Skeleton className="mt-6 h-70 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col px-4 md:py-6 pt-20 pb-10 text-white sm:px-6 lg:px-8 lg:py-10">
      {errorMessage && (
        <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {errorMessage}
        </div>
      )}

      <div className="text-2xl font-bold text-white sm:text-3xl">Dashboard</div>
      <div className="mb-4 text-sm font-light text-gray-400 sm:text-base">
        Acompanhe as principais métricas do chatbot.
      </div>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="group relative overflow-hidden border border-white/10 bg-linear-to-br from-[#0f172a] via-[#122b5c] to-[#1e3a8a] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.28)] transition-transform duration-200 hover:-translate-y-1">
            <div className="absolute inset-y-0 right-0 w-24 bg-white/5 blur-2xl" />
            <div className="relative flex gap-4 items-start">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10 backdrop-blur-sm">
                <MessageSquareMore size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                  Total de consultas
                </div>
                <div className="text-3xl font-semibold leading-none text-white">
                  {interactions.length}
                </div>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden border border-white/10 bg-linear-to-br from-[#111827] via-[#2e1065] to-[#4c1d95] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.28)] transition-transform duration-200 hover:-translate-y-1">
            <div className="absolute inset-y-0 right-0 w-24 bg-white/5 blur-2xl" />
            <div className="relative flex gap-4 items-start">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10 backdrop-blur-sm">
                <MessagesSquare size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-200/80">
                  Perguntas respondidas
                </div>
                <div className="text-3xl font-semibold leading-none text-white">
                  {respondidas}
                </div>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden border border-white/10 bg-linear-to-br from-[#111827] via-[#7c2d12] to-[#9a3412] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.28)] transition-transform duration-200 hover:-translate-y-1">
            <div className="absolute inset-y-0 right-0 w-24 bg-white/5 blur-2xl" />
            <div className="relative flex gap-4 items-start">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10 backdrop-blur-sm">
                <MessageSquare size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-200/80">
                  Perguntas não respondidas
                </div>
                <div className="text-3xl font-semibold leading-none text-white">
                  {naoRespondidas}
                </div>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden border border-white/10 bg-linear-to-br from-[#111827] via-[#14532d] to-[#166534] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.28)] transition-transform duration-200 hover:-translate-y-1">
            <div className="absolute inset-y-0 right-0 w-24 bg-white/5 blur-2xl" />
            <div className="relative flex gap-4 items-start">
              <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10 backdrop-blur-sm">
                <MessageSquareCheck size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
                  Taxa de resolução
                </div>
                <div className="text-3xl font-semibold leading-none text-white">
                  {taxaResolucao.toFixed(2)}%
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_0.5fr]">
          <CustomBarChart
            data={perguntasDetectadas}
            title="Perguntas Detectadas na Base"
          />

          <DonutChart
            data={questionsPerCategory}
            title="Categorias mais respondidas"
          />
        </div>

        <TimeSeriesChart
          data={timeSeries}
          title="Evolução das consultas ao longo do tempo"
        />

        <Card className="w-full overflow-hidden border border-white/10 bg-linear-to-br from-[#0f172a] via-[#10234d] to-[#030712] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.28)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                Painel de perguntas
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                Perguntas mais frequentes
              </div>
            </div>
            <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
              {frequentQuestionsRows.length} registros
            </div>
          </div>
          <Table
            rows={frequentQuestionsRows}
            headers={['Pergunta', 'Quantidade']}
          />
        </Card>
      </div>
    </div>
  )
}
