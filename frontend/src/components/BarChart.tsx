import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  name: string
  value: number
}

interface BarChartProps {
  data: ChartData[]
  title?: string
}

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
        Pergunta
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

export const CustomBarChart = ({ data, title }: BarChartProps) => {
  return (
    <div className="flex h-full min-h-[360px] w-full flex-col rounded-3xl border border-white/10 bg-linear-to-br from-[#0f172a] via-[#10234d] to-[#030712] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.35)] sm:min-h-[520px] sm:p-5">
      {title && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {title}
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Distribuição das perguntas enviadas pelos usuários
            </p>
          </div>
          <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
            {data.length} itens
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={64}
            margin={{ top: 8, right: 12, left: 0, bottom: 24 }}
          >
            <CartesianGrid
              stroke="rgba(148, 163, 184, 0.14)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#cbd5e1', fontSize: 11, textAnchor: 'middle' }}
              interval={0}
              angle={0}
              textAnchor="middle"
              tickMargin={16}
              height={84}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={24}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
            />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              fill="url(#barGradient)"
            />

            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
