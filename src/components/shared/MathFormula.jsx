import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

/**
 * Componente wrapper para renderizar fórmulas matemáticas con KaTeX
 * Uso:
 *   <MathFormula>y = x^2</MathFormula> (inline)
 *   <MathFormula block>y = x^2</MathFormula> (bloque)
 */
export default function MathFormula({ children, block = false, className = '' }) {
  const formula = typeof children === 'string' ? children : String(children)

  if (block) {
    return (
      <div className={`my-4 overflow-x-auto ${className}`}>
        <BlockMath math={formula} />
      </div>
    )
  }

  return (
    <span className={`inline-block ${className}`}>
      <InlineMath math={formula} />
    </span>
  )
}

/**
 * Componente para múltiples fórmulas en bloque con título
 */
export function MathBlock({ title, children, className = '' }) {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 ${className}`}>
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
      )}
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  )
}
