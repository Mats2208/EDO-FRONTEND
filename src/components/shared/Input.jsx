/**
 * Input numérico con label y validación
 */
export default function Input({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  error,
  min,
  max,
  step,
  placeholder,
  className = '',
  ...props 
}) {
  const inputClasses = `w-full px-3 py-2 border focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-error focus:border-error focus:ring-error-lighter'
      : 'border-neutral-200 focus:border-primary focus:ring-primary-lighter'
  } ${className}`

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
}
