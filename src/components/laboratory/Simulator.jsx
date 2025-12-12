import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import Card from '../shared/Card'
import EquationInput from './EquationInput'
import ParameterControls from './ParameterControls'
import ResultsChart from './ResultsChart'
import MetricsTable from './MetricsTable'
import StepsTable from './StepsTable'
import { parseEquation } from '../../utils/parser'
import { euler } from '../../utils/solvers/euler'
import { rk4 } from '../../utils/solvers/rk4'
import { getExactSolution } from '../../services/backendApi'

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
    exact: null,
    exactSource: null, // 'predefined' | 'backend' | null
    exactStatus: null, // 'found' | 'not_found' | 'error' | 'timeout' | 'connection_error'
    exactMessage: null,
    solutionLatex: null
  })

  const [isSimulating, setIsSimulating] = useState(false)
  const [error, setError] = useState(null)

  // Estado del stepper (qué paso está activo)
  const [currentStep, setCurrentStep] = useState(1)

  // Auto-scroll a resultados cuando aparezcan
  useEffect(() => {
    if (results.euler && results.rk4) {
      const resultsSection = document.getElementById('results-section')
      if (resultsSection) {
        setTimeout(() => {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      }
    }
  }, [results.euler, results.rk4])

  // Handler para cambiar ecuación
  const handleEquationChange = (newEquation) => {
    try {
      const func = parseEquation(newEquation, {
        variables: { independent: 'x', dependent: 'y' }
      })
      setEquation(newEquation)
      setParsedFunction(() => func)
      setError(null)
      setCurrentStep(2) // Avanzar al paso 2 cuando la ecuación es válida
    } catch (err) {
      setError(err.message)
      setParsedFunction(null)
      setCurrentStep(1) // Volver al paso 1 si hay error
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
    setCurrentStep(3) // Avanzar al paso 3 (simulando)

    try {
      const { t0, y0, tf, h } = parameters

      // PASO 1: Ejecutar métodos numéricos (Euler y RK4)
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

      // PASO 2: Intentar obtener solución exacta
      let exactResult = null
      let exactSource = null
      let exactStatus = null
      let exactMessage = null
      let solutionLatex = null

      // 2.1: Primero revisar si hay solución predefinida (hardcodeada)
      if (currentProblem && currentProblem.exactSolution) {
        const exactY = []
        const exactT = []

        for (let i = 0; i < rk4Result.t.length; i++) {
          const t = rk4Result.t[i]
          exactT.push(t)
          exactY.push(currentProblem.exactSolution(t, y0, t0))
        }

        exactResult = { t: exactT, y: exactY }
        exactSource = 'predefined'
        exactStatus = 'found'
        exactMessage = 'Solución exacta disponible (problema predefinido)'
        solutionLatex = currentProblem.exactFormula || null
      }
      // 2.2: Si no hay solución predefinida, intentar con el backend
      else {
        const backendResult = await getExactSolution(equation, t0, y0, tf, h)

        if (backendResult.status === 'found') {
          // Backend encontró solución exacta
          exactResult = {
            t: backendResult.grid,
            y: backendResult.exact
          }
          exactSource = 'backend'
          exactStatus = 'found'
          exactMessage = 'Solución exacta calculada con SymPy'
          solutionLatex = backendResult.solutionLatex
        } else {
          // Backend no encontró solución o hubo error
          exactResult = null
          exactSource = 'backend'
          exactStatus = backendResult.status
          exactMessage = backendResult.message
          solutionLatex = null
        }
      }

      // PASO 3: Actualizar resultados
      setResults({
        euler: eulerResult,
        rk4: rk4Result,
        exact: exactResult,
        exactSource,
        exactStatus,
        exactMessage,
        solutionLatex,
        eulerSteps,
        rk4Steps
      })

      setCurrentStep(4) // Avanzar al paso 4 (resultados)
    } catch (err) {
      setError(`Error en la simulación: ${err.message}`)
      setCurrentStep(2) // Volver al paso 2 si hay error
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper Visual */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Paso 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
              currentStep >= 1 ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-gray-300'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className={`text-xs mt-2 font-medium transition-colors ${
              currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              Ecuación
            </span>
          </div>

          {/* Línea conectora 1-2 */}
          <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
            currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
          }`} />

          {/* Paso 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
              currentStep >= 2 ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-gray-300'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <span className={`text-xs mt-2 font-medium transition-colors ${
              currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              Parámetros
            </span>
          </div>

          {/* Línea conectora 2-3 */}
          <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
            currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
          }`} />

          {/* Paso 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
              currentStep >= 3 ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-gray-300'
            }`}>
              {currentStep > 3 ? '✓' : '3'}
            </div>
            <span className={`text-xs mt-2 font-medium transition-colors ${
              currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              Simular
            </span>
          </div>

          {/* Línea conectora 3-4 */}
          <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
            currentStep >= 4 ? 'bg-green-600' : 'bg-gray-300'
          }`} />

          {/* Paso 4 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
              currentStep >= 4 ? 'bg-green-600 scale-110 shadow-lg' : 'bg-gray-300'
            }`}>
              {currentStep >= 4 ? '✓' : '4'}
            </div>
            <span className={`text-xs mt-2 font-medium transition-colors ${
              currentStep >= 4 ? 'text-green-600' : 'text-gray-400'
            }`}>
              Resultados
            </span>
          </div>
        </div>
      </div>

      {/* Información del problema actual */}
      {currentProblem && (
        <div className="transform transition-all duration-500 ease-out animate-fadeIn">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
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
        </div>
      )}

      {/* Input de ecuación */}
      <div className="transform transition-all duration-500 ease-out">
        <Card title="1. Define la Ecuación Diferencial" className="shadow-md hover:shadow-lg transition-shadow">
          <EquationInput
            equation={equation}
            onEquationChange={handleEquationChange}
            onLoadPredefined={handleLoadPredefined}
          />
        </Card>
      </div>

      {/* Controles de parámetros */}
      <div className="transform transition-all duration-500 ease-out">
        <Card title="2. Configura los Parámetros" className="shadow-md hover:shadow-lg transition-shadow">
          <ParameterControls
            parameters={parameters}
            onParametersChange={setParameters}
            onSimulate={handleSimulate}
            isSimulating={isSimulating}
          />
        </Card>
      </div>

      {/* Error si hay */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-fadeIn shadow-md">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-800 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Resultados */}
      {(results.euler || results.rk4) && (
        <div id="results-section" className="space-y-6 transform transition-all duration-700 ease-out animate-fadeIn">
          {/* Mensaje sobre solución exacta - SIEMPRE SE MUESTRA */}
          <div className={`rounded-lg p-4 flex items-start gap-3 shadow-md transition-all duration-500 ${
            results.exactStatus === 'found'
              ? 'bg-green-50 border-2 border-green-300'
              : results.exactStatus === 'not_found'
              ? 'bg-blue-50 border-2 border-blue-300'
              : results.exactStatus === 'timeout'
              ? 'bg-amber-50 border-2 border-amber-300'
              : 'bg-red-50 border-2 border-red-300'
          }`}>
            {results.exactStatus === 'found' && <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />}
            {results.exactStatus === 'not_found' && <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />}
            {results.exactStatus === 'timeout' && <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />}
            {(results.exactStatus === 'error' || results.exactStatus === 'connection_error') && <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`font-semibold ${
                  results.exactStatus === 'found' ? 'text-green-900' :
                  results.exactStatus === 'not_found' ? 'text-blue-900' :
                  results.exactStatus === 'timeout' ? 'text-amber-900' :
                  'text-red-900'
                }`}>
                  {results.exactStatus === 'found' && '✓ Solución Exacta Encontrada'}
                  {results.exactStatus === 'not_found' && 'ℹ️ Sin Solución Exacta'}
                  {results.exactStatus === 'timeout' && '⏱️ Tiempo Agotado'}
                  {(results.exactStatus === 'error' || results.exactStatus === 'connection_error') && '⚠️ Error en Backend'}
                </p>
                {results.exactSource === 'backend' && (
                  <Sparkles className="w-4 h-4 text-purple-600" title="Calculado con SymPy" />
                )}
              </div>

              <p className={`text-sm mt-1 ${
                results.exactStatus === 'found' ? 'text-green-800' :
                results.exactStatus === 'not_found' ? 'text-blue-800' :
                results.exactStatus === 'timeout' ? 'text-amber-800' :
                'text-red-800'
              }`}>
                {results.exactMessage}
              </p>

              {results.solutionLatex && results.exactStatus === 'found' && (
                <div className="mt-3 bg-white p-4 rounded-lg border-2 border-green-200 overflow-x-auto">
                  <BlockMath math={results.solutionLatex} />
                </div>
              )}
            </div>
          </div>

          <Card title="3. Resultados Gráficos" className="shadow-lg">
            <ResultsChart
              eulerData={results.euler}
              rk4Data={results.rk4}
              exactData={results.exact}
              showExact={!!results.exact}
            />
          </Card>

          <Card title="4. Análisis Comparativo" className="shadow-lg">
            <MetricsTable
              eulerData={results.euler}
              rk4Data={results.rk4}
              exactData={results.exact}
            />
          </Card>

          <Card title="5. Tabla Detallada de Pasos" className="shadow-lg">
            <StepsTable
              eulerSteps={results.eulerSteps}
              rk4Steps={results.rk4Steps}
            />
          </Card>
        </div>
      )}

      {/* Mensaje inicial si no hay resultados */}
      {!results.euler && !results.rk4 && !error && (
        <div className="text-center py-16 text-gray-500 animate-fadeIn">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🧮</div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Simulador de Ecuaciones Diferenciales
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Resuelve EDOs usando métodos numéricos (Euler, RK4) y obtén soluciones exactas cuando existan
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-2">Para comenzar:</p>
              <ol className="text-xs text-blue-800 text-left space-y-1">
                <li>1️⃣ Define tu ecuación diferencial</li>
                <li>2️⃣ Configura los parámetros</li>
                <li>3️⃣ Presiona "Simular"</li>
                <li>4️⃣ Analiza los resultados</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
