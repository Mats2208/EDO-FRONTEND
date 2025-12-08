/**
 * Botón reutilizable con variantes
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-ms hover:shadow-ms-md transition-all',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500 border border-neutral-200 transition-all',
    danger: 'bg-error text-white hover:bg-error-light focus:ring-error shadow-ms transition-all',
    success: 'bg-success text-white hover:bg-success-light focus:ring-success shadow-ms transition-all',
    warning: 'bg-warning text-white hover:bg-warning-light focus:ring-warning shadow-ms transition-all',
    outline: 'border-2 border-primary text-primary hover:bg-neutral-100 focus:ring-primary transition-all',
    academic: 'bg-academic text-white hover:bg-academic-light focus:ring-academic shadow-ms hover:shadow-ms-md transition-all',
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
