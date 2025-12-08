import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Card from '../shared/Card'
import EquationInput from './EquationInput'
import ParameterControls from './ParameterControls'
import ResultsChart from './ResultsChart'
import MetricsTable from './MetricsTable'
import StepsTable from './StepsTable'
import { parseEquation } from '../../utils/parser'
import { euler } from '../../utils/solvers/euler'
import { rk4 } from '../../utils/solvers/rk4'

/**
 * Componente principal del simulador de EDOs
 */
export default function Simulator() {
  // Estado de la ecuación
  const [equation, setEquation] = useState('y')
  const [parsedFunction, setParsedFunction] = useState(null)
  const [currentProblem, setCurrentProblem] = useState(null)

  // Estado de parámetros (usando x en lugar de t)
  const [parameters, setParameters] = useState({
    t0: 0,  // x0 internamente
    y0: 1,
    tf: 5,  // xf internamente
    h: 0.1
  })

  // Estado de resultados
  const [results, setResults] = useState({
    euler: null,
    rk4: null,
    exact: null
  })

  const [isSimulating, setIsSimulating] = useState(false)
  const [error, setError] = useState(null)

  // Handler para cambiar ecuación
  const handleEquationChange = (newEquation) => {
    try {
      const func = parseEquation(newEquation, {
        variables: { independent: 'x', dependent: 'y' }
      })
      setEquation(newEquation)
      setParsedFunction(() => func)
      setError(null)
    } catch (err) {
      setError(err.message)
      setParsedFunction(null)
    }
  }

  // Handler para cargar problema predefinido
  const handleLoadPredefined = (problem) => {
    setCurrentProblem(problem)
    setEquation(problem.equation)
    setParameters(problem.parameters)
    
    try {
      const func = parseEquation(problem.equation, {
        variables: { independent: 'x', dependent: 'y' },
        normalize: true
      })
      setParsedFunction(() => func)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  // Handler para simular
  const handleSimulate = async () => {
    if (!parsedFunction) {
      setError('Por favor, valida la ecuación primero')
      return
    }

    setIsSimulating(true)
    setError(null)

    try {
      // Pequeño delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 100))

      const { t0, y0, tf, h } = parameters

      // Ejecutar ambos métodos
      const eulerResult = euler(parsedFunction, t0, y0, tf, h)
      const rk4Result = rk4(parsedFunction, t0, y0, tf, h)

      // Generar arrays de pasos para la tabla detallada
      const eulerSteps = eulerResult.t.map((t, i) => ({
        x: t,
        y: eulerResult.y[i]
      }))

      const rk4Steps = rk4Result.t.map((t, i) => ({
        x: t,
        y: rk4Result.y[i]
      }))

      // Calcular solución exacta si existe
      let exactResult = null
      if (currentProblem && currentProblem.exactSolution) {
        const exactY = []
        const exactT = []
        
        // Usar los mismos puntos que RK4 para comparación justa
        for (let i = 0; i < rk4Result.t.length; i++) {
          const t = rk4Result.t[i]
          exactT.push(t)
          exactY.push(currentProblem.exactSolution(t, y0, t0))
        }

        exactResult = {
          t: exactT,
          y: exactY
        }
      }

      setResults({
        euler: eulerResult,
        rk4: rk4Result,
        exact: exactResult,
        eulerSteps: eulerSteps,
        rk4Steps: rk4Steps
      })
    } catch (err) {
      setError(`Error en la simulación: ${err.message}`)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Información del problema actual */}
      {currentProblem && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-900">
              {currentProblem.name}
            </h3>
            <p className="text-sm text-blue-800">{currentProblem.description}</p>
            {currentProblem.context && (
              <p className="text-xs text-blue-600 bg-white/50 p-2 rounded">
                📚 Contexto: {currentProblem.context}
              </p>
            )}
            {currentProblem.exactFormula && (
              <p className="text-xs text-blue-600 bg-white/50 p-2 rounded font-mono">
                ✓ Solución exacta disponible: {currentProblem.exactFormula}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Input de ecuación */}
      <Card title="1. Define la Ecuación Diferencial">
        <EquationInput
          equation={equation}
          onEquationChange={handleEquationChange}
          onLoadPredefined={handleLoadPredefined}
        />
      </Card>

      {/* Controles de parámetros */}
      <Card title="2. Configura los Parámetros">
        <ParameterControls
          parameters={parameters}
          onParametersChange={setParameters}
          onSimulate={handleSimulate}
          isSimulating={isSimulating}
        />
      </Card>

      {/* Error si hay */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-800 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Resultados */}
      {(results.euler || results.rk4) && (
        <>
          <Card title="3. Resultados Gráficos">
            <ResultsChart
              eulerData={results.euler}
              rk4Data={results.rk4}
              exactData={results.exact}
              showExact={!!results.exact}
            />
          </Card>

          <Card title="4. Análisis Comparativo">
            <MetricsTable
              eulerData={results.euler}
              rk4Data={results.rk4}
              exactData={results.exact}
            />
          </Card>

          <StepsTable
            eulerSteps={results.eulerSteps}
            rk4Steps={results.rk4Steps}
          />
        </>
      )}

      {/* Mensaje inicial si no hay resultados */}
      {!results.euler && !results.rk4 && !error && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">👆 Configura tu ecuación y parámetros arriba</p>
          <p className="text-sm mt-2">Luego presiona "Simular" para ver los resultados</p>
        </div>
      )}
    </div>
  )
}
