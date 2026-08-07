export const Table = ({
  headers,
  rows,
  actions,
}: {
  headers: string[]
  rows: string[][]
  actions?: React.ReactNode[]
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-white/8 via-white/5 to-white/3 shadow-[0_20px_60px_rgba(2,6,23,0.24)] backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="min-w-160 w-full border-collapse text-sm text-white md:min-w-0">
          <thead>
            <tr className="border-b border-white/10 bg-white/10/60">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70"
                >
                  {header}
                </th>
              ))}
              {actions && <th className="px-5 py-4 text-right" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex % 2 === 0
                    ? 'bg-white/3 transition-colors hover:bg-white/8'
                    : 'bg-transparent transition-colors hover:bg-white/6'
                }
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-t border-white/10 px-5 py-4 text-sm text-white/90"
                  >
                    {cell}
                  </td>
                ))}
                {actions && (
                  <td className="border-t border-white/10 px-5 py-4 text-right">
                    {actions[rowIndex]}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
