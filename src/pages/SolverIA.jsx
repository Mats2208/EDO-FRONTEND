import { useState, useRef } from 'react'
import { 
  Sparkles, 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Play,
  RefreshCw,
  Lightbulb,
  Zap,
  Bot,
  Settings
} from 'lucide-react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import Card from '../components/shared/Card'
import ResultsChart from '../components/laboratory/ResultsChart'
import MetricsTable from '../components/laboratory/MetricsTable'
import StepsTable from '../components/laboratory/StepsTable'
import { parseEquation } from '../utils/parser'
import { euler } from '../utils/solvers/euler'
import { rk4 } from '../utils/solvers/rk4'
import { getExactSolution } from '../services/backendApi'

/**
 * Página de Solver con IA - El usuario describe el problema y la IA lo resuelve
 */
export default function SolverIA() {
  // Estado del problema del usuario
  const [problemDescription, setProblemDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  
  // Estado de la respuesta de la IA
  const [aiResponse, setAiResponse] = useState(null)
  const [parsedProblem, setParsedProblem] = useState(null)
  const [parsedFunction, setParsedFunction] = useState(null)
  
  // Estado de parámetros (editables después del análisis)
  const [parameters, setParameters] = useState({
    t0: 0,
    y0: 1,
    tf: 5,
    h: 0.1
  })
  
  // Estado de simulación
  const [isSimulating, setIsSimulating] = useState(false)
  const [results, setResults] = useState(null)
  const [simulationError, setSimulationError] = useState(null)

  // Referencia para scroll
  const resultsRef = useRef(null)
  const textareaRef = useRef(null)

  // Ejemplos de problemas
  const exampleProblems = [
    {
      title: "Crecimiento Poblacional",
      description: "Tengo una población de bacterias que crece proporcionalmente a su tamaño actual. Si empiezo con 100 bacterias y quiero ver cómo crece en las próximas 5 horas, ¿cómo modelo esto?"
    },
    {
      title: "Enfriamiento de Café",
      description: "Mi café está a 90°C y la temperatura ambiente es 20°C. Se enfría proporcionalmente a la diferencia de temperatura con una constante de enfriamiento de 0.3. ¿Cuánto tiempo tarda en llegar a 40°C?"
    },
    {
      title: "Circuito RC",
      description: "Tengo un circuito RC con resistencia R=10Ω y capacitancia C=0.01F. Si aplico un voltaje constante de 12V, ¿cómo evoluciona la carga en el capacitor?"
    },
    {
      title: "Caída con Resistencia del Aire",
      description: "Un objeto de 5kg cae desde el reposo con resistencia del aire proporcional a la velocidad (k=0.2). Quiero analizar su velocidad durante los primeros 10 segundos."
    }
  ]

  // Función para analizar el problema con la IA
  const handleAnalyzeProblem = async () => {
    if (!problemDescription.trim()) return

    setIsAnalyzing(true)
    setAnalysisError(null)
    setAiResponse(null)
    setParsedProblem(null)
    setResults(null)

    try {
      // Crear un contexto específico para el análisis del problema
      const analysisContext = {
        problem_id: "ai-solver",
        problem_name: "Problema Personalizado con IA",
        category: "IA Solver",
        equation: "Por determinar",
        description: "Usuario solicitando análisis de problema"
      }

      const parameters = {
        t0: 0,
        y0: 1,
        tf: 5,
        h: 0.1
      }

      // Crear el mensaje para la IA con instrucciones específicas
      const message = `Como experto en ecuaciones diferenciales, analiza el siguiente problema y proporciona:

1. **Ecuación Diferencial**: La EDO en formato matemático (usa la variable 'y' para la función y 'x' para la variable independiente). Por ejemplo: "y", "-0.5*y", "2*x*y", etc.

2. **Parámetros Recomendados**:
   - x₀ (valor inicial de x)
   - y₀ (condición inicial)
   - xf (valor final de x)
   - h (tamaño de paso recomendado)

3. **Explicación**: Breve descripción del modelo matemático

4. **Tipo de EDO**: ¿Es lineal/no lineal? ¿De primer orden?

5. **Solución Exacta** (SOLO si es una EDO común con solución conocida):
   - Si reconoces el problema (crecimiento exponencial, enfriamiento de Newton, decaimiento, logístico, etc.)
   - Incluye "has_exact_solution": true
   - Proporciona la fórmula en formato LaTeX en "exact_solution_latex"

**FORMATO DE RESPUESTA REQUERIDO** (usa exactamente este formato JSON en un bloque de código):

\`\`\`json
{
  "equation": "ecuación aquí (ejemplo: y, -0.2*y, -0.12*(y - 22))",
  "parameters": {
    "t0": 0,
    "y0": 1,
    "tf": 5,
    "h": 0.1
  },
  "explanation": "Explicación del modelo",
  "type": "Tipo de EDO",
  "variable_meaning": {
    "x": "Qué representa x (tiempo, distancia, etc)",
    "y": "Qué representa y (población, temperatura, etc)"
  },
  "has_exact_solution": false,
  "exact_solution_latex": null
}
\`\`\`

**Ejemplos de soluciones exactas conocidas:**
- Crecimiento exponencial dy/dx = k*y → y(x) = y₀·e^(kx)
- Enfriamiento de Newton dy/dx = -k(y - T) → y(x) = T + (y₀ - T)·e^(-kx)
- Decaimiento exponencial dy/dx = -k*y → y(x) = y₀·e^(-kx)

**PROBLEMA DEL USUARIO:**
${problemDescription}

Recuerda: Debes devolver el JSON en un bloque de código como se muestra arriba.`

      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          problem_context: analysisContext,
          parameters: parameters,
          history: []
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error al analizar el problema')
      }

      setAiResponse(data.response)

      // Intentar extraer el JSON de la respuesta
      const jsonMatch = data.response.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        try {
          const problemData = JSON.parse(jsonMatch[1])
          setParsedProblem(problemData)
          
          // Actualizar los parámetros con los recomendados por la IA
          if (problemData.parameters) {
            setParameters(problemData.parameters)
          }
          
          // Parsear la función para el campo de direcciones
          try {
            const func = parseEquation(problemData.equation, {
              variables: { independent: 'x', dependent: 'y' }
            })
            setParsedFunction(() => func)
          } catch (parseErr) {
            console.warn('No se pudo parsear la ecuación para el campo de direcciones:', parseErr)
          }
        } catch (e) {
          console.error('Error parsing JSON:', e)
          setAnalysisError('La IA respondió pero no pudo generar el formato correcto. Por favor intenta de nuevo.')
        }
      } else {
        setAnalysisError('La IA respondió pero no incluyó el formato JSON esperado. Por favor intenta de nuevo.')
      }

    } catch (err) {
      setAnalysisError(err.message || 'Error de conexión con el servidor')
      console.error('Error analyzing problem:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Función para simular con los parámetros de la IA
  const handleSimulate = async () => {
    if (!parsedProblem) return

    setIsSimulating(true)
    setSimulationError(null)

    try {
      const { equation } = parsedProblem
      const { t0, y0, tf, h } = parameters // Usar los parámetros actuales (editables)
      
      // Parse la ecuación
      const func = parseEquation(equation, {
        variables: { independent: 'x', dependent: 'y' }
      })
      
      // Guardar la función parseada para el campo de direcciones
      setParsedFunction(() => func)
      
      // Resolver con Euler
      const eulerResult = euler(func, t0, y0, tf, h)
      
      // Resolver con RK4
      const rk4Result = rk4(func, t0, y0, tf, h)

      // Crear arrays de pasos para la tabla detallada
      const eulerSteps = eulerResult.t.map((t, i) => ({
        x: t,
        y: eulerResult.y[i]
      }))

      const rk4Steps = rk4Result.t.map((t, i) => ({
        x: t,
        y: rk4Result.y[i]
      }))

      // Intentar obtener solución exacta
      let exactResult = null
      let exactStatus = null
      let exactMessage = null
      let solutionLatex = null

      // Si la IA sugirió que existe solución exacta, intentar con el backend
      if (parsedProblem.has_exact_solution) {
        try {
          const exactResponse = await getExactSolution(equation, t0, y0, tf, h)
          if (exactResponse.exact && exactResponse.grid) {
            exactResult = {
              t: exactResponse.grid,
              y: exactResponse.exact,
              steps: exactResponse.grid.length,
              evaluations: 0 // Analítica no requiere evaluaciones
            }
            exactStatus = exactResponse.status
            exactMessage = exactResponse.message || 'Solución exacta calculada con SymPy'
            // Usar la solución LaTeX del backend si está disponible, sino la de la IA
            solutionLatex = exactResponse.solutionLatex || parsedProblem.exact_solution_latex
          } else {
            // Si el backend no pudo, pero la IA dijo que existe, mostrar mensaje
            exactStatus = 'not_found'
            exactMessage = 'La IA detectó que existe solución exacta, pero no se pudo calcular automáticamente'
            solutionLatex = parsedProblem.exact_solution_latex
          }
        } catch {
          exactStatus = 'error'
          exactMessage = 'Error al calcular la solución exacta'
          solutionLatex = parsedProblem.exact_solution_latex
        }
      } else {
        // La IA no detectó solución exacta, intentar de todos modos con backend
        try {
          const exactResponse = await getExactSolution(equation, t0, y0, tf, h)
          if (exactResponse.exact && exactResponse.grid) {
            exactResult = {
              t: exactResponse.grid,
              y: exactResponse.exact,
              steps: exactResponse.grid.length,
              evaluations: 0
            }
            exactStatus = exactResponse.status
            exactMessage = exactResponse.message || 'Solución exacta encontrada'
            solutionLatex = exactResponse.solutionLatex
          }
        } catch {
          exactStatus = 'not_found'
          exactMessage = 'No se encontró solución exacta para esta ecuación'
        }
      }

      setResults({
        euler: eulerResult,
        rk4: rk4Result,
        exact: exactResult,
        eulerSteps: eulerSteps,
        rk4Steps: rk4Steps,
        exactStatus,
        exactMessage,
        solutionLatex
      })

      // Debug: Verificar estructura de datos
      console.log('📊 Resultados de simulación:', {
        euler: {
          steps: eulerResult.steps,
          points: eulerResult.t.length,
          hasY: !!eulerResult.y
        },
        rk4: {
          steps: rk4Result.steps,
          points: rk4Result.t.length,
          hasY: !!rk4Result.y
        },
        exact: exactResult ? {
          steps: exactResult.steps,
          points: exactResult.t.length,
          hasY: !!exactResult.y,
          yLength: exactResult.y?.length
        } : 'null'
      })

      // Scroll a resultados
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)

    } catch (err) {
      setSimulationError(err.message || 'Error al simular')
      console.error('Simulation error:', err)
    } finally {
      setIsSimulating(false)
    }
  }

  // Cargar ejemplo
  const loadExample = (example) => {
    setProblemDescription(example.description)
    textareaRef.current?.focus()
  }

  // Reset todo
  const handleReset = () => {
    setProblemDescription('')
    setAiResponse(null)
    setParsedProblem(null)
    setParsedFunction(null)
    setResults(null)
    setAnalysisError(null)
    setSimulationError(null)
    setParameters({
      t0: 0,
      y0: 1,
      tf: 5,
      h: 0.1
    })
  }

  // Handler para cambios de parámetros
  const handleParameterChange = (name, value) => {
    setParameters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          Solver con IA
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Describe tu problema en lenguaje natural y deja que la IA determine la ecuación diferencial 
          y los parámetros óptimos para resolverlo.
        </p>
      </div>

      {/* Sección de Input del Problema */}
      <Card className="mb-8">
        <div className="flex items-start gap-3 mb-4">
          <Bot className="w-6 h-6 text-purple-600 mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              1. Describe tu problema
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Explica el problema físico, biológico, químico o matemático que quieres modelar. 
              Incluye valores iniciales, constantes y el contexto del problema.
            </p>

            <textarea
              ref={textareaRef}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Ejemplo: Tengo una población que crece exponencialmente. Empiezo con 100 individuos y la tasa de crecimiento es 0.5 por hora. Quiero ver cómo evoluciona en las próximas 10 horas..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm resize-none"
              disabled={isAnalyzing}
            />

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleAnalyzeProblem}
                disabled={!problemDescription.trim() || isAnalyzing}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analizar con IA
                  </>
                )}
              </button>

              {(aiResponse || results) && (
                <button
                  onClick={handleReset}
                  className="text-gray-600 hover:text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Nuevo Problema
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ejemplos */}
        {!aiResponse && !isAnalyzing && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Ejemplos de problemas:</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {exampleProblems.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="text-left p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
                >
                  <p className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-purple-700">
                    {example.title}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {example.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error de análisis */}
        {analysisError && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 mb-1">Error al analizar</p>
              <p className="text-sm text-red-800">{analysisError}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Respuesta de la IA */}
      {aiResponse && (
        <Card className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-start gap-3 mb-4">
            <Zap className="w-6 h-6 text-purple-600 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                2. Análisis de la IA
              </h2>
              
              {parsedProblem ? (
                <div className="space-y-4">
                  {/* Ecuación */}
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Ecuación Diferencial:</p>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <InlineMath>{`\\frac{dy}{dx} = ${parsedProblem.equation}`}</InlineMath>
                    </div>
                  </div>

                  {/* Parámetros */}
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700">Parámetros de Simulación:</p>
                      <span className="text-xs text-purple-600 flex items-center gap-1">
                        <Settings size={14} />
                        Ajustables
                      </span>
                    </div>
                    
                    {/* Grid de parámetros compacto */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">x₀</label>
                        <input
                          type="number"
                          step="0.1"
                          value={parameters.t0}
                          onChange={(e) => handleParameterChange('t0', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">y₀</label>
                        <input
                          type="number"
                          step="0.1"
                          value={parameters.y0}
                          onChange={(e) => handleParameterChange('y0', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">xf</label>
                        <input
                          type="number"
                          step="0.1"
                          value={parameters.tf}
                          onChange={(e) => handleParameterChange('tf', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">h (paso)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={parameters.h}
                          onChange={(e) => handleParameterChange('h', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Pasos estimados:</span> {Math.round((parameters.tf - parameters.t0) / parameters.h)}
                      </p>
                    </div>
                  </div>

                  {/* Explicación */}
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Explicación:</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{parsedProblem.explanation}</p>
                    {parsedProblem.variable_meaning && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Variables:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li><strong>x:</strong> {parsedProblem.variable_meaning.x}</li>
                          <li><strong>y:</strong> {parsedProblem.variable_meaning.y}</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Solución exacta conocida (si la IA la detectó) */}
                  {parsedProblem.has_exact_solution && parsedProblem.exact_solution_latex && (
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        ✨ Solución Exacta Conocida
                      </p>
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <BlockMath>{parsedProblem.exact_solution_latex}</BlockMath>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        La IA reconoció este tipo de EDO y proporcionó su solución analítica
                      </p>
                    </div>
                  )}

                  {/* Botón para simular */}
                  <div className="space-y-2">
                    <button
                      onClick={handleSimulate}
                      disabled={isSimulating}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-lg"
                    >
                      {isSimulating ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          Simulando...
                        </>
                      ) : (
                        <>
                          <Play size={24} />
                          {results ? 'Re-Simular' : 'Simular Ahora'}
                        </>
                      )}
                    </button>
                    {results && (
                      <p className="text-xs text-center text-gray-600">
                        💡 Puedes ajustar los parámetros arriba y volver a simular
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Error de simulación */}
      {simulationError && (
        <Card className="mb-8 bg-red-50 border-2 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900 mb-1">Error en la simulación</p>
              <p className="text-sm text-red-800">{simulationError}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Resultados */}
      {results && (
        <div ref={resultsRef}>
          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                3. Resultados de la Simulación
              </h2>
            </div>

            {/* Gráfico */}
            <div className="mb-6">
              <ResultsChart
                eulerData={results.euler}
                rk4Data={results.rk4}
                exactData={results.exact}
                parsedFunction={parsedFunction}
                title="Comparación de Métodos Numéricos"
              />
            </div>

            {/* Solución exacta calculada con valores numéricos */}
            {results.exact && results.solutionLatex && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-2">
                  ✅ Solución Exacta Calculada (con valores numéricos)
                </p>
                <div className="bg-white p-3 rounded border border-green-200 mb-3">
                  <BlockMath>{results.solutionLatex}</BlockMath>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2 rounded border border-green-200">
                    <span className="text-gray-600">Puntos calculados:</span>
                    <span className="font-bold text-green-800 ml-2">{results.exact.steps}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-200">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-bold text-green-800 ml-2">{results.exactMessage}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje cuando la IA detectó solución pero no se calculó */}
            {!results.exact && results.solutionLatex && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  ⚠️ Solución Exacta Conocida (sin valores calculados)
                </p>
                <div className="bg-white p-3 rounded border border-yellow-200 mb-2">
                  <BlockMath>{results.solutionLatex}</BlockMath>
                </div>
                <p className="text-sm text-yellow-800">{results.exactMessage}</p>
              </div>
            )}

            {/* Mensaje cuando no hay solución exacta */}
            {!results.exact && results.exactStatus === 'not_found' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900 mb-1">ℹ️ Sin Solución Exacta</p>
                <p className="text-sm text-yellow-800">{results.exactMessage}</p>
                <p className="text-xs text-yellow-700 mt-2">
                  Los métodos numéricos Euler y RK4 proporcionan aproximaciones válidas.
                </p>
              </div>
            )}

            {/* Métricas */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {results.exact ? 'Métricas de Error' : 'Métricas de Simulación'}
              </h3>
              <MetricsTable
                eulerData={results.euler}
                rk4Data={results.rk4}
                exactData={results.exact}
              />
              {!results.exact && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Nota:</strong> Sin solución exacta, no se pueden calcular errores absolutos. 
                    Las métricas mostradas comparan características computacionales de cada método.
                  </p>
                </div>
              )}
            </div>

            {/* Tabla de pasos */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Valores Detallados</h3>
              <StepsTable
                eulerSteps={results.eulerSteps}
                rk4Steps={results.rk4Steps}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Info Footer */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="text-center">
          <h3 className="font-bold text-gray-900 mb-2">¿Cómo funciona?</h3>
          <p className="text-sm text-gray-700 max-w-3xl mx-auto">
            Nuestro sistema usa IA avanzada (OpenRouter GPT-4) para analizar tu descripción en lenguaje natural,
            identificar las variables relevantes, determinar la ecuación diferencial apropiada y sugerir
            parámetros óptimos. Luego resolvemos numéricamente usando Euler y Runge-Kutta RK4, 
            intentando también encontrar la solución analítica cuando es posible.
          </p>
        </div>
      </Card>
    </div>
  )
}
