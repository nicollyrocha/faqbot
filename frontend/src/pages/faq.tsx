import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TextInput } from '../components/TextInput'
import { Button } from '../components/Button'
import { Select } from '../components/Select'
import { Loader2, Trash2 } from 'lucide-react'
import { Table } from '../components/Table'
import { Skeleton } from '../components/Skeleton'

export const FaqPage = () => {
  const [questionAnswer, setQuestionAnswer] = useState<{
    question: string
    answer: string
  }>({ question: '', answer: '' })
  const [category, setCategory] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

  const {
    data: faqs = [],
    isLoading: isFaqsLoading,
    isError: isFaqsError,
    error: faqsError,
    refetch,
  } = useQuery({
    queryKey: ['faqs', apiBaseUrl],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/faq`)

      if (!response.ok) {
        throw new Error('Não foi possível carregar as FAQs.')
      }

      return (await response.json()) as {
        id: number
        question: string
        answer: string
        category: string
      }[]
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    setActionError(null)
    e.preventDefault()
    const response = await fetch(`${apiBaseUrl}/faq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: questionAnswer.question,
        answer: questionAnswer.answer,
        category,
      }),
    })

    if (!response.ok) {
      setLoading(false)
      setActionError('Erro ao enviar a pergunta e resposta.')
      return
    }

    setQuestionAnswer({ question: '', answer: '' })
    setCategory('')
    await refetch()
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    const response = await fetch(`${apiBaseUrl}/faq/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      setActionError('Erro ao deletar a pergunta.')
      return
    }

    await refetch()
  }

  const faqsToTableRows = faqs.map((faq) => [
    faq.question,
    faq.category,
    faq.answer,
  ])

  const actionButtons = faqs.map((faq) => (
    <button
      key={faq.id}
      type="button"
      onClick={() => handleDelete(faq.id)}
      className="rounded-md p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
      aria-label={`Excluir ${faq.question}`}
    >
      <Trash2 size={16} />
    </button>
  ))

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:mt-6 mt-20">
      <div className="flex flex-col gap-3 p-5 border border-white/60 rounded-xl m-4 w-11/12 md:w-6/12">
        <h1 className="text-xl text-white font-semibold">Nova pergunta</h1>
        {actionError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {actionError}
          </div>
        )}
        <form
          className="flex flex-col gap-3"
          onSubmit={async (e) => handleSubmit(e)}
        >
          <TextInput
            required
            label="Pergunta"
            value={questionAnswer.question}
            onChange={(e) =>
              setQuestionAnswer({ ...questionAnswer, question: e })
            }
            placeholder="Digite a pergunta"
          />
          <TextInput
            required
            label="Resposta"
            value={questionAnswer.answer}
            onChange={(e) =>
              setQuestionAnswer({ ...questionAnswer, answer: e })
            }
            placeholder="Digite a resposta"
          />

          <Select
            label="Categoria"
            required
            options={[
              { value: 'conta', label: 'Conta' },
              { value: 'cadastro', label: 'Cadastro' },
              { value: 'financeiro', label: 'Financeiro' },
              { value: 'suporte', label: 'Suporte' },
            ]}
            value={category}
            onChange={(e) => setCategory(e)}
          />
          <Button disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Salvar pergunta'}
          </Button>
        </form>
      </div>

      <div className="rounded-xl w-11/12 md:w-6/12 mt-4 md:pr-3">
        {isFaqsError ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {(faqsError as Error)?.message ??
              'Não foi possível carregar as FAQs.'}
          </div>
        ) : isFaqsLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <Skeleton className="mb-4 h-8 w-48" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <Table
            headers={['Pergunta', 'Categoria', 'Resposta']}
            rows={faqsToTableRows}
            actions={actionButtons}
          />
        )}
      </div>
    </div>
  )
}
