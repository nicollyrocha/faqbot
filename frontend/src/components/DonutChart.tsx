import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface DonutData {
  name: string
  value: number
}

interface DonutChartProps {
  data: DonutData[]
  title?: string
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value?: number }>
  label?: string
}) => {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
        Categoria
      </div>
      <div className="mt-1 max-w-56 text-sm font-medium text-white">
        {label}
      </div>
      <div className="mt-2 text-sm text-sky-300">
        Consultas: {payload[0]?.value ?? 0}
      </div>
    </div>
  )
}

export function DonutChart({ data, title }: DonutChartProps) {
  return (
    <div className="flex h-full min-h-[360px] w-full flex-col rounded-3xl border border-white/10 bg-linear-to-br from-[#0f172a] via-[#10234d] to-[#030712] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.35)] sm:min-h-[520px] sm:p-5">
      {title && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {title}
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Distribuição das categorias com perguntas respondidas
            </p>
          </div>
          <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
            {data.length} itens
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                color: '#cbd5e1',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
