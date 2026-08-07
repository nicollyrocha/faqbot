import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface TimeSeriesData {
  date: string
  label: string
  total: number
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[]
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
        Data
      </div>
      <div className="mt-1 text-sm font-medium text-white">{label}</div>
      <div className="mt-2 text-sm text-sky-300">
        Consultas: {payload[0]?.value ?? 0}
      </div>
    </div>
  )
}

export function TimeSeriesChart({ data, title }: TimeSeriesChartProps) {
  const hasData = data.some((item) => item.total > 0)

  return (
    <div className="mt-6 flex h-full min-h-[360px] w-full flex-col rounded-3xl border border-white/10 bg-linear-to-br from-[#0f172a] via-[#10234d] to-[#030712] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.35)] sm:min-h-[520px] sm:p-5">
      {title && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {title}
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Evolução do volume de consultas ao longo do tempo
            </p>
          </div>
          <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
            {data.length} dias
          </div>
        </div>
      )}

      <div className="h-72 w-full sm:h-80">
        {!hasData ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-sm text-slate-400">
            Ainda não há consultas suficientes para exibir a evolução temporal.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 12, left: 0, bottom: 24 }}
            >
              <defs>
                <linearGradient id="seriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(148, 163, 184, 0.14)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
                interval="preserveStartEnd"
                tickMargin={12}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                width={32}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#seriesGradient)"
                dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
