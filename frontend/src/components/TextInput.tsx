export const TextInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-white/50 rounded-lg p-2 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
    />
  )
}
