/**
 * Card contenedor reutilizable
 */
export default function Card({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'md',
  ...props 
}) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  }
  
  const paddingClass = paddings[padding]
  const classes = `bg-white shadow-ms border border-neutral-200 ${paddingClass} ${className}`

  return (
    <div className={classes} {...props}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-semibold text-neutral-800 mb-1">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
