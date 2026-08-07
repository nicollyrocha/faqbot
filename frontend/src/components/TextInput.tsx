export const TextInput = ({
  value,
  onChange,
  placeholder,
  className = '',
  label,
  required = false,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
  label?: string
  required?: boolean
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-white text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      <input
        required={required}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border border-white/50 rounded-lg p-2 text-white text-sm font-light bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        placeholder={placeholder}
      />
    </div>
  )
}
