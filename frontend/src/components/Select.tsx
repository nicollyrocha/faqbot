export const Select = ({
  options,
  value,
  onChange,
  label,
  required = false,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  label: string
  required?: boolean
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-white text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-white/50 rounded-lg p-2 text-white text-sm font-light bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled className="bg-gray-800 text-white">
          Selecione uma opção
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-gray-800 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
