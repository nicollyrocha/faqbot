export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`border border-white/50 rounded-lg shadow-md p-4 text-white ${className || ''}`}
    >
      {children}
    </div>
  )
}
