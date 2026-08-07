export const TextArea = ({
  value,
  onChange,
  placeholder,
  onkeyDown,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  onkeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-white/50 rounded-lg p-2 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-32 resize-none"
      placeholder={placeholder}
      onKeyDown={onkeyDown}
    />
  )
}
