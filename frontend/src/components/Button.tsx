export const Button = ({
  onClick,
  children,
  className,
}: {
  onClick: () => void
  children: React.ReactNode
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer ${className || ''}`}
    >
      {children}
    </button>
  )
}
