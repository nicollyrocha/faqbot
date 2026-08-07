export const Button = ({
  onClick,
  children,
  className,
  disabled,
}: {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer ${className || ''} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-200 disabled:bg-slate-200`}
    >
      {children}
    </button>
  )
}
