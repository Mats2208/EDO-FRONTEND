import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, BookOpen, Settings, BarChart3, AlertCircle, CheckCircle2, XCircle, Clock, Sparkles, RefreshCw } from 'lucide-react'
import {
  Atom,
  Leaf,
  FlaskConical,
  Cog,
  TrendingUp,
  Globe,
  Cloud,
  Users
} from 'lucide-react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { getCategoryById } from '../data/applicationCategories'
import { getProblemById } from '../data/categoryProblems'
import { parseEquation } from '../utils/parser'
import { euler } from '../utils/solvers/euler'
import { rk4 } from '../utils/solvers/rk4'
import { getExactSolution } from '../services/backendApi'
import Card from '../components/shared/Card'
import ResultsChart from '../components/laboratory/ResultsChart'
import MetricsTable from '../components/laboratory/MetricsTable'
import StepsTable from '../components/laboratory/StepsTable'
import ChatBox from '../components/chat/ChatBox'

// Mapeo de iconos
const iconMap = {
  Atom,
  Leaf,
  FlaskConical,
  Cog,
  TrendingUp,
  Globe,
  Cloud,
  Users,
}

export default function ProblemDetail() {
  const { categoryId, problemId } = useParams()
  const navigate = useNavigate()
  const category = getCategoryById(categoryId)
  const problem = getProblemById(categoryId, problemId)

  // Estado de parámetros (personalizables)
  const [parameters, setParameters] = useState(
    problem ? problem.parameters : { t0: 0, y0: 1, tf: 5, h: 0.1 }
  )

  // Estado de resultados
  const [results, setResults] = useState(null)
  const [parsedFunction, setParsedFunction] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [error, setError] = useState(null)

  // Auto-simular al cargar
  useEffect(() => {
    if (problem) {
      handleSimulate()
    }
  }, [problemId])

  // Si no existe el problema o categoría
  if (!category || !problem) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Problema no encontrado</h2>
          <p className="text-neutral-600 mb-6">
            El problema que buscas no existe o fue movido.
          </p>
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-colors rounded-lg"
          >
            <ArrowLeft size={20} />
            Volver al Hub de Problemas
          </Link>
        </Card>
      </div>
    )
  }

  const IconComponent = iconMap[category.icon] || Atom

  const handleSimulate = async () => {
    setIsSimulating(true)
    setError(null)

    try {
      // Parse equation
      const func = parseEquation(problem.equation, {
        variables: { independent: 'x', dependent: 'y' }
      })
      setParsedFunction(() => func)

      const { t0, y0, tf, h } = parameters

      // Ejecutar métodos numéricos
      const eulerResult = euler(func, t0, y0, tf, h)
      const rk4Result = rk4(func, t0, y0, tf, h)

      // Generar pasos para tabla detallada
      const eulerSteps = eulerResult.t.map((t, i) => ({
        x: t,
        y: eulerResult.y[i]
      }))

      const rk4Steps = rk4Result.t.map((t, i) => ({
        x: t,
        y: rk4Result.y[i]
      }))

      // Intentar solución exacta
      let exactResult = null
      let exactStatus = null
      let exactMessage = null
      let solutionLatex = null
      let exactSource = null

      // Primero verificar si hay solución predefinida
      if (problem.exactSolution && problem.hasExactSolution) {
        const exactY = []
        const exactT = []

        for (let i = 0; i < rk4Result.t.length; i++) {
          const t = rk4Result.t[i]
          exactT.push(t)
          exactY.push(problem.exactSolution(t, y0, t0))
        }

        exactResult = { t: exactT, y: exactY }
        exactSource = 'predefined'
        exactStatus = 'found'
        exactMessage = 'Solución exacta disponible (problema predefinido)'
        solutionLatex = problem.exactFormula
      }
      // Si no, intentar con backend
      else {
        const backendResult = await getExactSolution(problem.equation, t0, y0, tf, h)

        if (backendResult.status === 'found') {
          exactResult = {
            t: backendResult.grid,
            y: backendResult.exact
          }
          exactSource = 'backend'
          exactStatus = 'found'
          exactMessage = 'Solución exacta calculada con SymPy'
          solutionLatex = backendResult.solutionLatex
        } else {
          exactStatus = backendResult.status
          exactMessage = backendResult.message
        }
      }

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

      // Auto-scroll a resultados
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section')
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)

    } catch (err) {
      setError(`Error en la simulación: ${err.message}`)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleReset = () => {
    setParameters(problem.parameters)
    handleSimulate()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/problems" className="text-primary hover:text-primary-dark transition-colors">
            Problemas
          </Link>
          <span className="text-neutral-400">/</span>
          <Link to={`/problems/${categoryId}`} className="text-primary hover:text-primary-dark transition-colors">
            {category.name}
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-600">{problem.name}</span>
        </div>
      </div>

      {/* Header del problema */}
      <div className="max-w-7xl mx-auto mb-8">
        <Card padding="none" className="overflow-hidden shadow-xl">
          <div className={`${category.color} p-8 text-white`}>
            <div className="flex items-start gap-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <IconComponent size={48} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{problem.name}</h1>
                    <p className="text-lg text-white text-opacity-90">
                      {problem.description}
                    </p>
                  </div>
                  {problem.hasExactSolution && (
                    <div className="bg-white bg-opacity-20 px-3 py-2 rounded-lg flex items-center gap-2">
                      <CheckCircle2 size={20} />
                      <span className="text-sm font-semibold">Solución Exacta Disponible</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full font-semibold">
                    {category.name}
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full font-semibold">
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Columna izquierda: Teoría y Contexto */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ecuación */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-neutral-800">Ecuación Diferencial</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
              <BlockMath math={`\\frac{dy}{dx} = ${problem.equationLatex || problem.equation}`} />
            </div>
          </Card>

          {/* Contexto */}
          <Card>
            <h3 className="text-xl font-bold text-neutral-800 mb-3">Contexto del Problema</h3>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-neutral-700 leading-relaxed">
                {problem.context}
              </p>
            </div>
          </Card>

          {/* Teoría (si existe) */}
          {problem.theory && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-academic" size={24} />
                <h2 className="text-2xl font-bold text-neutral-800">Fundamento Teórico</h2>
              </div>

              {problem.theory.origin && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">Origen de la Ecuación</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {problem.theory.origin}
                  </p>
                </div>
              )}

              {problem.theory.derivation && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">Derivación Matemática</h3>
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    {problem.theory.derivation.map((step, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        {step.latex ? (
                          <BlockMath math={step.latex} />
                        ) : (
                          <p className="text-neutral-700">{step.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {problem.theory.applications && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">Aplicaciones Prácticas</h3>
                  <ul className="space-y-2">
                    {problem.theory.applications.map((app, index) => (
                      <li key={index} className="flex items-start gap-2 text-neutral-700">
                        <span className="text-primary mt-1">•</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {/* Resultados */}
          {results && (
            <div id="results-section" className="space-y-6">
              {/* Mensaje de solución exacta */}
              <Card className={`${
                results.exactStatus === 'found'
                  ? 'bg-green-50 border-2 border-green-300'
                  : results.exactStatus === 'not_found'
                  ? 'bg-blue-50 border-2 border-blue-300'
                  : results.exactStatus === 'timeout'
                  ? 'bg-amber-50 border-2 border-amber-300'
                  : 'bg-red-50 border-2 border-red-300'
              }`}>
                <div className="flex items-start gap-3">
                  {results.exactStatus === 'found' && <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />}
                  {results.exactStatus === 'not_found' && <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />}
                  {results.exactStatus === 'timeout' && <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />}
                  {(results.exactStatus === 'error' || results.exactStatus === 'connection_error') && <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
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

                    <p className={`text-sm ${
                      results.exactStatus === 'found' ? 'text-green-800' :
                      results.exactStatus === 'not_found' ? 'text-blue-800' :
                      results.exactStatus === 'timeout' ? 'text-amber-800' :
                      'text-red-800'
                    }`}>
                      {results.exactMessage}
                    </p>

                    {results.solutionLatex && results.exactStatus === 'found' && (
                      <div className="mt-3 bg-white p-4 rounded-lg border-2 border-green-200">
                        <BlockMath math={results.solutionLatex} />
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Gráfico */}
              <Card>
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Resultados Gráficos</h3>
                <ResultsChart
                  eulerData={results.euler}
                  rk4Data={results.rk4}
                  exactData={results.exact}
                  showExact={!!results.exact}
                  parsedFunction={parsedFunction}
                />
              </Card>

              {/* Métricas */}
              <Card>
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Análisis Comparativo</h3>
                <MetricsTable
                  eulerData={results.euler}
                  rk4Data={results.rk4}
                  exactData={results.exact}
                />
              </Card>

              {/* Tabla de pasos */}
              <Card>
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Tabla Detallada de Pasos</h3>
                <StepsTable
                  eulerSteps={results.eulerSteps}
                  rk4Steps={results.rk4Steps}
                />
              </Card>
            </div>
          )}

          {/* Error */}
          {error && (
            <Card className="bg-red-50 border-2 border-red-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-800 mt-1">{error}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Columna derecha: Controles */}
        <div className="space-y-6">
          {/* Parámetros */}
          <Card className="sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="text-primary" size={24} />
              <h3 className="text-xl font-bold text-neutral-800">Parámetros de Simulación</h3>
            </div>

            <div className="space-y-4">
              {/* x0 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Valor Inicial (x₀)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={parameters.t0}
                  onChange={(e) => setParameters({ ...parameters, t0: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* y0 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Condición Inicial (y₀)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={parameters.y0}
                  onChange={(e) => setParameters({ ...parameters, y0: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* xf */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Valor Final (x_f)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={parameters.tf}
                  onChange={(e) => setParameters({ ...parameters, tf: e.target.value === '' ? 1 : parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* h */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Tamaño de Paso (h)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  max="1"
                  value={parameters.h}
                  onChange={(e) => setParameters({ ...parameters, h: e.target.value === '' ? 0.1 : parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
                <p className="text-xs text-neutral-600 mt-1">
                  Valores menores dan mayor precisión (mín: 0.001, máx: 1)
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Simulando...
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      Simular
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-neutral-200 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-300 transition-colors flex items-center justify-center"
                  title="Restaurar parámetros originales"
                >
                  <RefreshCw size={20} />
                </button>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  <strong>Tip:</strong> Prueba diferentes valores de parámetros para ver cómo cambia el comportamiento de la solución.
                </p>
              </div>
            </div>
          </Card>

          {/* Información adicional */}
          <Card>
            <h4 className="text-sm font-bold text-neutral-800 mb-3">Sobre este problema</h4>
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Categoría:</span>
                <span className="font-semibold">{category.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Dificultad:</span>
                <span className="font-semibold">{problem.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span>Solución exacta:</span>
                <span className="font-semibold">{problem.hasExactSolution ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Botón volver */}
      <div className="max-w-7xl mx-auto mt-8">
        <Link
          to={`/problems/${categoryId}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Volver a {category.name}
        </Link>
      </div>

      {/* Chat con IA */}
      <ChatBox
        problemContext={{
          problem_id: problemId,
          problem_name: problem.name,
          category: category.name,
          equation: problem.equation,
          description: problem.description,
          theory: problem.theory || null
        }}
        parameters={{
          t0: parameters.t0,
          y0: parameters.y0,
          tf: parameters.tf,
          h: parameters.h
        }}
      />
    </div>
  )
}
