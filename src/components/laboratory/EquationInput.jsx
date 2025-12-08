import { useState, useRef, useEffect } from 'react'
import { AlertCircle, CheckCircle2, HelpCircle, Info } from 'lucide-react'
import { MathfieldElement } from 'mathlive'
import Button from '../shared/Button'
import { parseEquation, analyzeEquation } from '../../utils/parser'
import { predefinedProblems } from '../../data/predefinedProblems'

/**
 * Componente para input de ecuaciones con validación y ejemplos predefinidos
 * Usa MathLive que emite LaTeX, luego se convierte a expresión matemática
 */
export default function EquationInput({ equation, onEquationChange, onLoadPredefined }) {
  const [localEquation, setLocalEquation] = useState(equation)
  const [isValid, setIsValid] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const mathfieldRef = useRef(null)

  // Inicializar MathLive (solo una vez al montar)
  useEffect(() => {
    const mf = mathfieldRef.current
    if (mf) {
      // Configurar opciones del teclado virtual
      mf.mathVirtualKeyboardPolicy = 'auto'

      // Listener para cambios - MathLive emite LaTeX
      mf.addEventListener('input', (evt) => {
        setLocalEquation(evt.target.value)
      })
    }
  }, [])

  // Actualizar el valor cuando cambia externamente
  useEffect(() => {
    if (mathfieldRef.current && mathfieldRef.current.value !== localEquation) {
      mathfieldRef.current.value = localEquation
    }
  }, [localEquation])

  const handleValidate = () => {
    try {
      // Analizar ecuación (convierte LaTeX a math internamente)
      const eqAnalysis = analyzeEquation(localEquation)
      
      // Parsear y crear función evaluable
      const func = parseEquation(localEquation, { 
        variables: { independent: 'x', dependent: 'y' }
      })
      
      // Probar con valores dummy para verificar que funciona
      func(0, 1)
      
      setIsValid(true)
      setErrorMessage('')
      setAnalysis(eqAnalysis)
      onEquationChange(localEquation)
    } catch (error) {
      setIsValid(false)
      setErrorMessage(error.message)
      setAnalysis(null)
    }
  }

  const handlePredefinedSelect = (problemId) => {
    const problem = predefinedProblems.find(p => p.id === problemId)
    if (problem) {
      setLocalEquation(problem.equation)
      setIsValid(true)
      setErrorMessage('')
      onLoadPredefined(problem)
    }
  }

  return (
    <div className="space-y-4">
      {/* Input de ecuación */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Ecuación Diferencial: dy/dx = f(x, y)
          </label>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
          >
            <HelpCircle className="w-4 h-4" />
            Ayuda
          </button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 border-2 border-gray-300 rounded-lg p-3 bg-white hover:border-blue-400 focus-within:border-blue-500 transition-colors">
            <math-field
              ref={mathfieldRef}
              style={{
                fontSize: '18px',
                padding: '8px',
                border: 'none',
                width: '100%',
                minHeight: '50px'
              }}
            >
              {localEquation}
            </math-field>
          </div>
          <Button onClick={handleValidate} variant="primary" className="self-start">
            Validar
          </Button>
        </div>

        {/* Feedback de validación */}
        {isValid !== null && (
          <div className="mt-2 space-y-2">
            <div className={`p-3 rounded-lg flex items-start gap-2 ${
              isValid 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {isValid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">✓ Ecuación válida</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Error en la ecuación:</p>
                    <p className="mt-1">{errorMessage}</p>
                  </div>
                </>
              )}
            </div>

            {/* Análisis de la ecuación */}
            {isValid && analysis && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900 space-y-1">
                    <p><strong>Tipo:</strong> {analysis.type}</p>
                    {analysis.normalized !== localEquation && (
                      <p><strong>Normalizada:</strong> <code className="bg-white px-2 py-0.5 rounded border border-blue-300">{analysis.normalized}</code></p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.isLinear && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Lineal</span>
                      )}
                      {!analysis.isLinear && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">No Lineal</span>
                      )}
                      {analysis.hasTimeDependent && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Dependiente de x</span>
                      )}
                      {analysis.hasTrigonometric && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs font-medium">Trigonométrica</span>
                      )}
                      {analysis.hasExponential && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">Exponencial</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ayuda */}
      {showHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">💡 Guía de Sintaxis</h4>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <p className="font-medium mb-1">Variables:</p>
              <p><code className="bg-white px-2 py-1 rounded border border-blue-200">x</code> = variable independiente</p>
              <p><code className="bg-white px-2 py-1 rounded border border-blue-200">y</code> = variable dependiente (dy/dx = f(x, y))</p>
            </div>
            <div>
              <p className="font-medium mb-1">Operadores:</p>
              <p className="space-x-2">
                <code className="bg-white px-2 py-1 rounded border border-blue-200">+</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">-</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">*</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">/</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">^</code> (potencia)
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Funciones trigonométricas:</p>
              <p className="space-x-2">
                <code className="bg-white px-2 py-1 rounded border border-blue-200">sin(x)</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">cos(x)</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">tan(x)</code>
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Otras funciones:</p>
              <p className="space-x-2">
                <code className="bg-white px-2 py-1 rounded border border-blue-200">exp(x)</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">log(x)</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">sqrt(x)</code>
                <code className="bg-white px-2 py-1 rounded border border-blue-200">abs(x)</code>
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Constantes:</p>
              <p className="space-x-2">
                <code className="bg-white px-2 py-1 rounded border border-blue-200">pi</code> (π ≈ 3.14159)
                <code className="bg-white px-2 py-1 rounded border border-blue-200">e</code> (≈ 2.71828)
              </p>
            </div>
            <div className="bg-white border border-blue-300 rounded p-2 mt-2">
              <p className="font-medium text-blue-900 mb-1">Ejemplos (con multiplicación implícita):</p>
              <ul className="space-y-1 text-xs">
                <li>• <code className="bg-blue-100 px-1 rounded">y</code> o <code className="bg-blue-100 px-1 rounded">1y</code> → Crecimiento exponencial</li>
                <li>• <code className="bg-blue-100 px-1 rounded">-y</code> → Decaimiento exponencial</li>
                <li>• <code className="bg-blue-100 px-1 rounded">2x + y</code> o <code className="bg-blue-100 px-1 rounded">2*x + y</code> → Lineal</li>
                <li>• <code className="bg-blue-100 px-1 rounded">xy</code> o <code className="bg-blue-100 px-1 rounded">x*y</code> → Producto de variables</li>
                <li>• <code className="bg-blue-100 px-1 rounded">sin(x)y</code> o <code className="bg-blue-100 px-1 rounded">sin(x)*y</code> → Oscilación</li>
                <li>• <code className="bg-blue-100 px-1 rounded">y^2 - x</code> → No lineal</li>
                <li>• <code className="bg-blue-100 px-1 rounded">2(x+1)</code> → Con paréntesis implícito</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Problemas predefinidos */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">O elige un problema predefinido:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {predefinedProblems.slice(0, 6).map((problem) => (
            <button
              key={problem.id}
              onClick={() => handlePredefinedSelect(problem.id)}
              className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-sm text-gray-900">{problem.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                dy/dt = <code className="bg-gray-100 px-1 rounded">{problem.equation}</code>
              </div>
              <div className="text-xs text-blue-600 mt-1">{problem.category}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
