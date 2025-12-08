import { useState } from 'react'
import { LineChart, PlayCircle, RotateCcw, TrendingUp, Zap } from 'lucide-react'
import Card from '../shared/Card'
import MathFormula from '../shared/MathFormula'
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { euler } from '../../utils/solvers/euler'
import { rk4 } from '../../utils/solvers/rk4'

/**
 * Página: Visualización Interactiva
 */
export default function InteractiveVisualization() {
  const [selectedExample, setSelectedExample] = useState('exponential')
  const [stepSize, setStepSize] = useState(0.1)
  const [showEuler, setShowEuler] = useState(true)
  const [showRK4, setShowRK4] = useState(true)
  const [showExact, setShowExact] = useState(true)

  const examples = {
    exponential: {
      name: 'Crecimiento Exponencial',
      equation: "dy/dt = y",
      displayEq: "\\frac{dy}{dt} = y",
      f: (t, y) => y,
      exact: (t) => Math.exp(t),
      y0: 1,
      t0: 0,
      tf: 2,
      description: 'La población crece proporcionalmente a su tamaño actual',
      color: 'green'
    },
    decay: {
      name: 'Decaimiento Exponencial',
      equation: "dy/dt = -y",
      displayEq: "\\frac{dy}{dt} = -y",
      f: (t, y) => -y,
      exact: (t) => Math.exp(-t),
      y0: 1,
      t0: 0,
      tf: 3,
      description: 'Desintegración radiactiva o descarga de capacitor',
      color: 'blue'
    },
    quadratic: {
      name: 'Crecimiento Cuadrático',
      equation: "dy/dt = t²",
      displayEq: "\\frac{dy}{dt} = t^2",
      f: (t, y) => t * t,
      exact: (t) => (t * t * t) / 3,
      y0: 0,
      t0: 0,
      tf: 2,
      description: 'La tasa de cambio depende del tiempo al cuadrado',
      color: 'purple'
    },
    sine: {
      name: 'Oscilación Sinusoidal',
      equation: "dy/dt = cos(t)",
      displayEq: "\\frac{dy}{dt} = \\cos(t)",
      f: (t, y) => Math.cos(t),
      exact: (t) => Math.sin(t),
      y0: 0,
      t0: 0,
      tf: 6.28,
      description: 'Movimiento armónico simple',
      color: 'orange'
    },
    logistic: {
      name: 'Crecimiento Logístico',
      equation: "dy/dt = y(1-y)",
      displayEq: "\\frac{dy}{dt} = y(1-y)",
      f: (t, y) => y * (1 - y),
      exact: (t) => 1 / (1 + 9 * Math.exp(-t)),
      y0: 0.1,
      t0: 0,
      tf: 8,
      description: 'Población con capacidad de carga limitada',
      color: 'red'
    },
    cooling: {
      name: 'Ley de Enfriamiento de Newton',
      equation: "dT/dt = -0.5(T - 20)",
      displayEq: "\\frac{dT}{dt} = -0.5(T - 20)",
      f: (t, T) => -0.5 * (T - 20),
      exact: (t) => 20 + 80 * Math.exp(-0.5 * t),
      y0: 100,
      t0: 0,
      tf: 10,
      description: 'Objeto caliente enfriándose en ambiente a 20°C',
      color: 'cyan'
    }
  }

  const example = examples[selectedExample]

  // Generar datos para la gráfica
  const generateData = () => {
    const data = []

    // Calcular con los métodos numéricos
    const eulerResult = euler(example.f, example.t0, example.y0, example.tf, stepSize)
    const rk4Result = rk4(example.f, example.t0, example.y0, example.tf, stepSize)

    // Usar los puntos de tiempo de los métodos numéricos + puntos adicionales para suavidad
    const timePoints = new Set()

    // Agregar puntos de Euler y RK4
    eulerResult.t.forEach(t => timePoints.add(t))
    rk4Result.t.forEach(t => timePoints.add(t))

    // Agregar puntos intermedios para la curva exacta (más suave)
    const smoothPoints = 200
    for (let i = 0; i <= smoothPoints; i++) {
      const t = example.t0 + (example.tf - example.t0) * (i / smoothPoints)
      timePoints.add(t)
    }

    // Convertir a array y ordenar
    const sortedTimes = Array.from(timePoints).sort((a, b) => a - b)

    // Crear objeto de búsqueda rápida para Euler y RK4
    const eulerValues = new Map()
    const rk4Values = new Map()

    eulerResult.t.forEach((t, i) => {
      eulerValues.set(t, eulerResult.y[i])
    })

    rk4Result.t.forEach((t, i) => {
      rk4Values.set(t, rk4Result.y[i])
    })

    // Construir datos para la gráfica
    sortedTimes.forEach(t => {
      const point = {
        t: Number(t.toFixed(4))
      }

      // Solución exacta (siempre calculamos para curva suave)
      if (showExact) {
        point.Exacta = Number(example.exact(t).toFixed(6))
      }

      // Euler (solo en puntos calculados)
      if (showEuler && eulerValues.has(t)) {
        point.Euler = Number(eulerValues.get(t).toFixed(6))
      }

      // RK4 (solo en puntos calculados)
      if (showRK4 && rk4Values.has(t)) {
        point.RK4 = Number(rk4Values.get(t).toFixed(6))
      }

      data.push(point)
    })

    return data
  }

  // Calcular errores máximos y detalles
  const calculateErrors = () => {
    const eulerResult = euler(example.f, example.t0, example.y0, example.tf, stepSize)
    const rk4Result = rk4(example.f, example.t0, example.y0, example.tf, stepSize)

    let maxEulerError = 0
    let maxRK4Error = 0
    let maxEulerErrorAt = 0
    let maxRK4ErrorAt = 0
    let eulerValueAtMax = 0
    let rk4ValueAtMax = 0
    let exactValueAtEulerMax = 0
    let exactValueAtRK4Max = 0
    let sumEulerError = 0
    let sumRK4Error = 0

    const detailedErrors = []

    // Calcular errores en cada punto
    eulerResult.t.forEach((t, i) => {
      const exact = example.exact(t)
      const eulerError = Math.abs(eulerResult.y[i] - exact)
      const rk4Error = Math.abs(rk4Result.y[i] - exact)

      // Guardar detalles para la tabla
      detailedErrors.push({
        step: i,
        t: t,
        exact: exact,
        euler: eulerResult.y[i],
        eulerError: eulerError,
        rk4: rk4Result.y[i],
        rk4Error: rk4Error
      })

      // Acumular para promedio
      sumEulerError += eulerError
      sumRK4Error += rk4Error

      // Encontrar error máximo de Euler
      if (eulerError > maxEulerError) {
        maxEulerError = eulerError
        maxEulerErrorAt = t
        eulerValueAtMax = eulerResult.y[i]
        exactValueAtEulerMax = exact
      }

      // Encontrar error máximo de RK4
      if (rk4Error > maxRK4Error) {
        maxRK4Error = rk4Error
        maxRK4ErrorAt = t
        rk4ValueAtMax = rk4Result.y[i]
        exactValueAtRK4Max = exact
      }
    })

    const avgEulerError = sumEulerError / eulerResult.t.length
    const avgRK4Error = sumRK4Error / rk4Result.t.length

    return {
      maxEulerError,
      maxRK4Error,
      maxEulerErrorAt,
      maxRK4ErrorAt,
      eulerValueAtMax,
      rk4ValueAtMax,
      exactValueAtEulerMax,
      exactValueAtRK4Max,
      avgEulerError,
      avgRK4Error,
      detailedErrors
    }
  }

  const chartData = generateData()
  const errors = calculateErrors()

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const t = payload[0].payload.t
      const slope = example.f(t, payload[0].value)

      return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
          <p className="font-bold text-sm mb-2">t = {t.toFixed(4)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <strong>{entry.name}:</strong> {entry.value?.toFixed(6) || 'N/A'}
            </p>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2">
            <p className="text-xs text-gray-600">
              <strong>dy/dt:</strong> {slope.toFixed(6)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Introducción */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <LineChart className="w-8 h-8 text-purple-600" />
          Visualización Interactiva
        </h2>
        <p className="text-lg text-gray-600">
          Experimenta con diferentes ecuaciones diferenciales y observa cómo los métodos numéricos
          aproximan las soluciones. Ajusta el tamaño de paso y compara los resultados.
        </p>
      </div>

      {/* Selector de ejemplos */}
      <Card title="Selecciona una Ecuación">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(examples).map(([key, ex]) => (
            <button
              key={key}
              onClick={() => setSelectedExample(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedExample === key
                  ? `border-${ex.color}-500 bg-${ex.color}-50`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <h4 className={`font-semibold mb-1 ${selectedExample === key ? `text-${ex.color}-900` : 'text-gray-900'}`}>
                {ex.name}
              </h4>
              <div className="text-sm mb-2">
                <MathFormula>{ex.displayEq}</MathFormula>
              </div>
              <p className="text-xs text-gray-600">{ex.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Controles */}
      <Card title="Controles de Simulación">
        <div className="space-y-6">
          {/* Tamaño de paso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de paso (h): <span className="text-primary font-bold">{stepSize}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={stepSize}
              onChange={(e) => setStepSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.01 (más preciso)</span>
              <span>0.5 (más rápido)</span>
            </div>
          </div>

          {/* Toggles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Mostrar en el gráfico:</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showExact}
                  onChange={(e) => setShowExact(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span className="text-sm text-gray-700">Solución Exacta</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEuler}
                  onChange={(e) => setShowEuler(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span className="text-sm text-gray-700">Método de Euler</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRK4}
                  onChange={(e) => setShowRK4(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Método RK4</span>
              </label>
            </div>
          </div>

          {/* Botón reset */}
          <button
            onClick={() => {
              setStepSize(0.1)
              setShowEuler(true)
              setShowRK4(true)
              setShowExact(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            Resetear Controles
          </button>
        </div>
      </Card>

      {/* Info del ejemplo */}
      <Card title={`Ecuación: ${example.name}`}>
        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Ecuación diferencial:</h4>
            <div className="text-center text-lg">
              <MathFormula block>{example.displayEq}</MathFormula>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-700 font-medium mb-1">Condición inicial</div>
              <div className="text-sm">
                <MathFormula>{`y(${example.t0}) = ${example.y0}`}</MathFormula>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-xs text-purple-700 font-medium mb-1">Intervalo</div>
              <div className="text-sm">
                <MathFormula>{`[${example.t0}, ${example.tf}]`}</MathFormula>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs text-green-700 font-medium mb-1">Número de pasos</div>
              <div className="text-sm font-bold">
                {Math.floor((example.tf - example.t0) / stepSize)}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 italic">
            {example.description}
          </p>
        </div>
      </Card>

      {/* Gráfica */}
      <Card title="Gráfica Comparativa">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLine data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="t"
                label={{ value: 't', position: 'insideBottomRight', offset: -5 }}
                stroke="#6b7280"
              />
              <YAxis
                label={{ value: 'y', angle: -90, position: 'insideLeft' }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {showExact && (
                <Line
                  type="monotone"
                  dataKey="Exacta"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  name="Exacta"
                />
              )}

              {showEuler && (
                <Line
                  type="monotone"
                  dataKey="Euler"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  strokeDasharray="5 5"
                  name="Euler"
                  connectNulls={false}
                />
              )}

              {showRK4 && (
                <Line
                  type="monotone"
                  dataKey="RK4"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="RK4"
                  connectNulls={false}
                />
              )}
            </RechartsLine>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Análisis de errores */}
      <Card title="Análisis de Error - Debugger Educativo">
        <div className="space-y-6">
          {/* Explicación del cálculo de error */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">¿Cómo calculamos el error?</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>1. Error puntual:</strong> En cada punto <MathFormula>{`t_i`}</MathFormula>, calculamos:
              </p>
              <div className="bg-white border border-gray-200 rounded p-3 ml-4">
                <MathFormula block>
                  {`E_i = |y_{aproximada}(t_i) - y_{exacta}(t_i)|`}
                </MathFormula>
              </div>
              <p>
                <strong>2. Error máximo:</strong> Es el mayor error entre todos los puntos:
              </p>
              <div className="bg-white border border-gray-200 rounded p-3 ml-4">
                <MathFormula block>
                  {`E_{max} = \\max(E_0, E_1, E_2, ..., E_n)`}
                </MathFormula>
              </div>
            </div>
          </div>

          {/* Resumen de errores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 mb-1">Error Máximo - Euler</h4>
                  <div className="text-2xl font-bold text-orange-700 mb-2">
                    {errors.maxEulerError.toExponential(4)}
                  </div>
                  <div className="space-y-1 text-xs text-orange-800">
                    <p>Ocurre en t = {errors.maxEulerErrorAt.toFixed(4)}</p>
                    <p>Valor Euler: {errors.eulerValueAtMax.toFixed(6)}</p>
                    <p>Valor Exacto: {errors.exactValueAtEulerMax.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Error Máximo - RK4</h4>
                  <div className="text-2xl font-bold text-blue-700 mb-2">
                    {errors.maxRK4Error.toExponential(4)}
                  </div>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p>Ocurre en t = {errors.maxRK4ErrorAt.toFixed(4)}</p>
                    <p>Valor RK4: {errors.rk4ValueAtMax.toFixed(6)}</p>
                    <p>Valor Exacto: {errors.exactValueAtRK4Max.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparación */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-3">Comparación de Precisión</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded p-3 border border-purple-200">
                <div className="text-xs text-purple-700 font-medium mb-1">Factor de Mejora</div>
                <div className="text-2xl font-bold text-purple-700">
                  {(errors.maxEulerError / errors.maxRK4Error).toFixed(1)}x
                </div>
                <div className="text-xs text-purple-600 mt-1">RK4 es más preciso</div>
              </div>
              <div className="bg-white rounded p-3 border border-purple-200">
                <div className="text-xs text-purple-700 font-medium mb-1">Error Promedio - Euler</div>
                <div className="text-lg font-bold text-orange-600">
                  {errors.avgEulerError.toExponential(3)}
                </div>
                <div className="text-xs text-purple-600 mt-1">Promedio de todos los puntos</div>
              </div>
              <div className="bg-white rounded p-3 border border-purple-200">
                <div className="text-xs text-purple-700 font-medium mb-1">Error Promedio - RK4</div>
                <div className="text-lg font-bold text-blue-600">
                  {errors.avgRK4Error.toExponential(3)}
                </div>
                <div className="text-xs text-purple-600 mt-1">Promedio de todos los puntos</div>
              </div>
            </div>
            <p className="text-sm text-purple-800">
              Con h = {stepSize}, RK4 reduce el error máximo de{' '}
              <span className="font-mono font-bold">{errors.maxEulerError.toExponential(2)}</span> a{' '}
              <span className="font-mono font-bold">{errors.maxRK4Error.toExponential(2)}</span>
            </p>
          </div>

          {/* Desglose paso a paso (primeros 5 pasos) */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Desglose de Errores (Primeros 5 pasos)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Paso</th>
                    <th className="border border-gray-300 px-2 py-1">t</th>
                    <th className="border border-gray-300 px-2 py-1">Exacta</th>
                    <th className="border border-gray-300 px-2 py-1">Euler</th>
                    <th className="border border-gray-300 px-2 py-1">Error Euler</th>
                    <th className="border border-gray-300 px-2 py-1">RK4</th>
                    <th className="border border-gray-300 px-2 py-1">Error RK4</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.detailedErrors.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-2 py-1 text-center font-medium">{row.step}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">{row.t.toFixed(4)}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-green-700 font-medium">
                        {row.exact.toFixed(6)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-orange-600">
                        {row.euler.toFixed(6)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-red-600 font-mono">
                        {row.eulerError.toExponential(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-blue-600">
                        {row.rk4.toFixed(6)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-red-600 font-mono">
                        {row.rk4Error.toExponential(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 mt-2 italic">
              Mostrando los primeros 5 de {errors.detailedErrors.length} pasos totales
            </p>
          </div>

          {/* Interpretación */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Interpretación</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  El <strong>error crece con el tiempo</strong> porque los errores se acumulan en cada paso
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  RK4 tiene errores <strong>varios órdenes de magnitud menores</strong> que Euler
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  Reducir h (tamaño de paso) <strong>reduce los errores</strong>, pero RK4 sigue siendo superior
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Consejos */}
      <Card title="💡 Experimenta">
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-2 items-start">
            <PlayCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>
              <strong>Aumenta el tamaño de paso (h):</strong> Observa cómo el método de Euler se desvía
              rápidamente de la solución exacta, mientras que RK4 mantiene mejor precisión.
            </p>
          </div>
          <div className="flex gap-2 items-start">
            <PlayCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>
              <strong>Reduce el tamaño de paso:</strong> Ambos métodos mejoran, pero RK4 alcanza
              precisión excelente con menos pasos que Euler.
            </p>
          </div>
          <div className="flex gap-2 items-start">
            <PlayCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>
              <strong>Prueba diferentes ecuaciones:</strong> Nota que la ventaja de RK4 es más evidente
              en problemas con cambios rápidos (como el crecimiento logístico cerca del punto de inflexión).
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
