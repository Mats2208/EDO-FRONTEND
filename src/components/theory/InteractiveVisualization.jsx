import { useState, useMemo, useEffect, useRef } from 'react'
import { LineChart, PlayCircle, RotateCcw, TrendingUp, Zap, Compass, Info } from 'lucide-react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../shared/Card'
import MathFormula from '../shared/MathFormula'
import SVGDirectionField from '../visualization/SVGDirectionField'
import { euler } from '../../utils/solvers/euler'
import { rk4 } from '../../utils/solvers/rk4'

// ============================================================================
// DATOS DE EJEMPLOS
// ============================================================================
const EXAMPLES = {
  exponential: {
    name: 'Crecimiento Exponencial',
    equation: "dy/dt = y",
    displayEq: "\\frac{dy}{dt} = y",
    f: (t, y) => y,
    exact: (t) => Math.exp(t),
    y0: 1,
    t0: 0,
    tf: 2,
    description: 'La población crece proporcionalmente a su tamaño actual'
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
    description: 'Desintegración radiactiva o descarga de capacitor'
  },
  quadratic: {
    name: 'Crecimiento Cuadrático',
    equation: "dy/dt = t²",
    displayEq: "\\frac{dy}{dt} = t^2",
    f: (t, _y) => t * t,
    exact: (t) => (t * t * t) / 3,
    y0: 0,
    t0: 0,
    tf: 2,
    description: 'La tasa de cambio depende del tiempo al cuadrado'
  },
  sine: {
    name: 'Oscilación Sinusoidal',
    equation: "dy/dt = cos(t)",
    displayEq: "\\frac{dy}{dt} = \\cos(t)",
    f: (t, _y) => Math.cos(t),
    exact: (t) => Math.sin(t),
    y0: 0,
    t0: 0,
    tf: 6.28,
    description: 'Movimiento armónico simple'
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
    description: 'Población con capacidad de carga limitada'
  },
  cooling: {
    name: 'Ley de Enfriamiento',
    equation: "dT/dt = -0.5(T - 20)",
    displayEq: "\\frac{dT}{dt} = -0.5(T - 20)",
    f: (t, T) => -0.5 * (T - 20),
    exact: (t) => 20 + 80 * Math.exp(-0.5 * t),
    y0: 100,
    t0: 0,
    tf: 10,
    description: 'Objeto caliente enfriándose en ambiente a 20°C'
  }
}

// ============================================================================
// COMPONENTE TOOLTIP PERSONALIZADO
// ============================================================================
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 text-xs">
      <div className="font-bold text-gray-900 mb-2 border-b pb-1">
        t = {label?.toFixed(4)}
      </div>
      <div className="space-y-1.5">
        {data.exact !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-green-500 rounded"></span>
              <span className="text-green-700 font-medium">Exacta:</span>
            </span>
            <span className="font-mono text-green-900">{data.exact.toFixed(6)}</span>
          </div>
        )}
        {data.euler !== undefined && (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-orange-500 rounded"></span>
                <span className="text-orange-700 font-medium">Euler:</span>
              </span>
              <span className="font-mono text-orange-900">{data.euler.toFixed(6)}</span>
            </div>
            {data.eulerError !== undefined && (
              <div className="flex items-center justify-between gap-3 ml-4">
                <span className="text-red-600 text-[10px]">Error:</span>
                <span className="font-mono text-red-700 text-[10px]">{data.eulerError.toExponential(2)}</span>
              </div>
            )}
          </>
        )}
        {data.rk4 !== undefined && (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-500 rounded"></span>
                <span className="text-blue-700 font-medium">RK4:</span>
              </span>
              <span className="font-mono text-blue-900">{data.rk4.toFixed(6)}</span>
            </div>
            {data.rk4Error !== undefined && (
              <div className="flex items-center justify-between gap-3 ml-4">
                <span className="text-red-600 text-[10px]">Error:</span>
                <span className="font-mono text-red-700 text-[10px]">{data.rk4Error.toExponential(2)}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function InteractiveVisualization() {
  // Estado
  const [selectedExample, setSelectedExample] = useState('exponential')
  const [stepSize, setStepSize] = useState(0.1)
  const [showEuler, setShowEuler] = useState(true)
  const [showRK4, setShowRK4] = useState(true)
  const [showExact, setShowExact] = useState(true)
  const [showDirectionField, setShowDirectionField] = useState(true)
  const [fieldDensity, setFieldDensity] = useState(15)
  const [overlayRect, setOverlayRect] = useState(null)

  const example = EXAMPLES[selectedExample]
  const chartMargin = { top: 10, right: 30, left: 10, bottom: 30 }
  const chartContainerRef = useRef(null)

  // Calcular soluciones numéricas
  const solutions = useMemo(() => {
    const eulerResult = euler(example.f, example.t0, example.y0, example.tf, stepSize)
    const rk4Result = rk4(example.f, example.t0, example.y0, example.tf, stepSize)

    // Generar puntos para la solución exacta (más densos para curva suave)
    const exactPoints = []
    const numExactPoints = 200
    for (let i = 0; i <= numExactPoints; i++) {
      const t = example.t0 + (example.tf - example.t0) * (i / numExactPoints)
      exactPoints.push({ t, y: example.exact(t) })
    }

    return { euler: eulerResult, rk4: rk4Result, exact: exactPoints }
  }, [example, stepSize])

  // Preparar datos para Recharts
  const chartData = useMemo(() => {
    const data = []
    const maxPoints = Math.max(solutions.euler.t.length, solutions.rk4.t.length)

    // Usar el conjunto más grande como base
    for (let i = 0; i < maxPoints; i++) {
      const point = {
        t: solutions.euler.t[i] || solutions.rk4.t[i],
      }

      if (i < solutions.euler.t.length) {
        point.euler = solutions.euler.y[i]
        point.eulerError = Math.abs(solutions.euler.y[i] - example.exact(solutions.euler.t[i]))
      }

      if (i < solutions.rk4.t.length) {
        point.rk4 = solutions.rk4.y[i]
        point.rk4Error = Math.abs(solutions.rk4.y[i] - example.exact(solutions.rk4.t[i]))
      }

      point.exact = example.exact(point.t)

      data.push(point)
    }

    // Agregar puntos de la solución exacta para curva suave
    const exactDense = []
    const numPoints = 200
    for (let i = 0; i <= numPoints; i++) {
      const t = example.t0 + (example.tf - example.t0) * (i / numPoints)
      exactDense.push({
        t,
        exact: example.exact(t)
      })
    }

    return { data, exactDense }
  }, [solutions, example])

  // Calcular límites del gráfico
  const bounds = useMemo(() => {
    const allYValues = [
      ...solutions.exact.map(p => p.y),
      ...solutions.euler.y,
      ...solutions.rk4.y
    ].filter(v => isFinite(v))
    
    const yMin = Math.min(...allYValues)
    const yMax = Math.max(...allYValues)
    const yPadding = (yMax - yMin) * 0.1
    
    return {
      tMin: example.t0,
      tMax: example.tf,
      yMin: yMin - yPadding,
      yMax: yMax + yPadding
    }
  }, [solutions, example])

  // Calcular errores
  const errors = useMemo(() => {
    let maxEulerError = 0, maxRK4Error = 0
    let maxEulerAt = 0, maxRK4At = 0
    let sumEulerError = 0, sumRK4Error = 0
    const details = []

    solutions.euler.t.forEach((t, i) => {
      const exact = example.exact(t)
      const eulerError = Math.abs(solutions.euler.y[i] - exact)
      const rk4Error = Math.abs(solutions.rk4.y[i] - exact)
      
      sumEulerError += eulerError
      sumRK4Error += rk4Error
      
      if (eulerError > maxEulerError) {
        maxEulerError = eulerError
        maxEulerAt = t
      }
      if (rk4Error > maxRK4Error) {
        maxRK4Error = rk4Error
        maxRK4At = t
      }
      
      details.push({
        step: i, t, exact,
        euler: solutions.euler.y[i], eulerError,
        rk4: solutions.rk4.y[i], rk4Error
      })
    })

    return {
      maxEuler: maxEulerError,
      maxRK4: maxRK4Error,
      maxEulerAt,
      maxRK4At,
      avgEuler: sumEulerError / solutions.euler.t.length,
      avgRK4: sumRK4Error / solutions.rk4.t.length,
      factor: maxEulerError / maxRK4Error,
      details
    }
  }, [solutions, example])

  useEffect(() => {
    if (!chartContainerRef.current) return
    const wrapper = chartContainerRef.current.querySelector('.recharts-wrapper')
    if (!wrapper) return
    if (typeof window === 'undefined' || typeof window.ResizeObserver === 'undefined') {
      setOverlayRect({
        top: chartMargin.top,
        left: chartMargin.left,
        width: chartContainerRef.current.clientWidth - (chartMargin.left + chartMargin.right),
        height: chartContainerRef.current.clientHeight - (chartMargin.top + chartMargin.bottom)
      })
      return
    }

    const updateOverlayRect = () => {
      if (!chartContainerRef.current || !wrapper) return
      
      // Buscar el área de trazado real del gráfico (cartesian grid o surface)
      const cartesianGrid = wrapper.querySelector('.recharts-cartesian-grid')
      const parentRect = chartContainerRef.current.getBoundingClientRect()
      
      if (cartesianGrid) {
        // Usar las dimensiones del grid cartesiano que representa el área de datos real
        const gridRect = cartesianGrid.getBoundingClientRect()
        setOverlayRect({
          top: gridRect.top - parentRect.top,
          left: gridRect.left - parentRect.left,
          width: gridRect.width,
          height: gridRect.height
        })
      } else {
        // Fallback: usar el wrapper con los márgenes
        const wrapperRect = wrapper.getBoundingClientRect()
        setOverlayRect({
          top: wrapperRect.top - parentRect.top + chartMargin.top,
          left: wrapperRect.left - parentRect.left + chartMargin.left,
          width: wrapperRect.width - chartMargin.left - chartMargin.right,
          height: wrapperRect.height - chartMargin.top - chartMargin.bottom
        })
      }
    }

    // Pequeño delay para asegurar que Recharts haya renderizado
    const timeoutId = setTimeout(updateOverlayRect, 50)
    
    const resizeObserver = new window.ResizeObserver(updateOverlayRect)
    resizeObserver.observe(wrapper)
    window.addEventListener('resize', updateOverlayRect)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateOverlayRect)
    }
  }, [chartData, bounds, showDirectionField, fieldDensity, chartMargin.left, chartMargin.right, chartMargin.top, chartMargin.bottom])


  // Reset controles
  const handleReset = () => {
    setStepSize(0.1)
    setShowEuler(true)
    setShowRK4(true)
    setShowExact(true)
    setShowDirectionField(true)
    setFieldDensity(15)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
          <LineChart className="w-8 h-8 text-purple-600" />
          Visualización Interactiva
        </h2>
        <p className="text-lg text-gray-600">
          Experimenta con diferentes ecuaciones y observa cómo los métodos numéricos aproximan las soluciones.
        </p>
      </div>

      {/* Selector de ecuaciones */}
      <Card title="1. Selecciona una Ecuación">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(EXAMPLES).map(([key, ex]) => (
            <button
              key={key}
              onClick={() => setSelectedExample(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedExample === key
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <h4 className={`font-semibold mb-1 ${selectedExample === key ? 'text-indigo-900' : 'text-gray-900'}`}>
                {ex.name}
              </h4>
              <div className="text-sm mb-2">
                <MathFormula>{ex.displayEq}</MathFormula>
              </div>
              <p className="text-xs text-gray-500">{ex.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Controles */}
      <Card title="2. Configura la Simulación">
        <div className="space-y-6">
          {/* Tamaño de paso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de paso (h): <span className="text-indigo-600 font-bold">{stepSize}</span>
              <span className="text-gray-500 ml-2">
                ({Math.floor((example.tf - example.t0) / stepSize)} pasos)
              </span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={stepSize}
              onChange={(e) => setStepSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.01 (más preciso)</span>
              <span>0.5 (menos preciso)</span>
            </div>
          </div>

          {/* Densidad del campo */}
          {showDirectionField && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Densidad del campo: <span className="text-indigo-600 font-bold">{fieldDensity}×{fieldDensity}</span>
              </label>
              <input
                type="range"
                min="8"
                max="25"
                step="1"
                value={fieldDensity}
                onChange={(e) => setFieldDensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          )}

          {/* Toggles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Mostrar:</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showExact}
                  onChange={(e) => setShowExact(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded accent-green-600"
                />
                <span className="text-sm flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-green-500 rounded"></span>
                  Solución Exacta
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEuler}
                  onChange={(e) => setShowEuler(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded accent-orange-600"
                />
                <span className="text-sm flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-orange-500 rounded"></span>
                  Euler
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRK4}
                  onChange={(e) => setShowRK4(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded accent-blue-600"
                />
                <span className="text-sm flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-blue-500 rounded"></span>
                  RK4
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDirectionField}
                  onChange={(e) => setShowDirectionField(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded accent-gray-600"
                />
                <span className="text-sm flex items-center gap-1">
                  <Compass size={14} className="text-gray-500" />
                  Campo de Direcciones
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
          >
            <RotateCcw size={16} />
            Resetear
          </button>
        </div>
      </Card>

      {/* Info del problema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div className="text-xs text-indigo-700 font-medium mb-1">Ecuación</div>
          <MathFormula>{example.displayEq}</MathFormula>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-700 font-medium mb-1">Condición inicial</div>
          <MathFormula>{`y(${example.t0}) = ${example.y0}`}</MathFormula>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-xs text-purple-700 font-medium mb-1">Intervalo</div>
          <MathFormula>{`t \\in [${example.t0}, ${example.tf}]`}</MathFormula>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-700 font-medium mb-1">Pasos</div>
          <div className="font-bold text-green-900">{Math.floor((example.tf - example.t0) / stepSize)}</div>
        </div>
      </div>

      {/* Gráfica con Recharts */}
      <Card title="3. Gráfica Comparativa">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div
            ref={chartContainerRef}
            className="relative w-full"
            style={{ height: 500 }}
          >
            {showDirectionField && overlayRect && (
              <div className="pointer-events-none absolute" style={overlayRect}>
                <SVGDirectionField
                  f={example.f}
                  tMin={bounds.tMin}
                  tMax={bounds.tMax}
                  yMin={bounds.yMin}
                  yMax={bounds.yMax}
                  gridCountX={fieldDensity}
                  gridCountY={Math.max(6, Math.round(fieldDensity * 0.8))}
                  arrowScale={0.85}
                  color="#9ca3af"
                  opacity={0.35}
                  strokeWidth={1}
                />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                margin={chartMargin}
              >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="t"
                type="number"
                domain={[bounds.tMin, bounds.tMax]}
                label={{ value: 't', position: 'insideBottom', offset: -5, style: { fontWeight: 600 } }}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toFixed(2)}
                allowDataOverflow={false}
              />
              <YAxis
                type="number"
                domain={[bounds.yMin, bounds.yMax]}
                label={{ value: 'y', angle: -90, position: 'insideLeft', style: { fontWeight: 600 } }}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toFixed(2)}
                allowDataOverflow={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />

              {/* Solución exacta - curva suave */}
              {showExact && (
                <Line
                  data={chartData.exactDense}
                  dataKey="exact"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  name="Exacta"
                  isAnimationActive={false}
                />
              )}

              {/* Euler */}
              {showEuler && (
                <Line
                  data={chartData.data}
                  dataKey="euler"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ fill: '#f97316', r: chartData.data.length <= 50 ? 3 : 0 }}
                  name="Euler"
                  isAnimationActive={false}
                />
              )}

              {/* RK4 */}
              {showRK4 && (
                <Line
                  data={chartData.data}
                  dataKey="rk4"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: chartData.data.length <= 50 ? 3 : 0 }}
                  name="RK4"
                  isAnimationActive={false}
                />
              )}
            </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info sobre el campo de direcciones */}
        {showDirectionField && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-2">
            <Info size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Las flechas grises en el fondo muestran el <strong>campo de direcciones</strong>: la dirección de la pendiente en cada punto.
              Las curvas solución siempre son tangentes a estas flechas. Pasa el mouse sobre la gráfica para ver valores exactos y errores.
            </p>
          </div>
        )}
      </Card>

      {/* Análisis de errores */}
      <Card title="4. Análisis de Error">
        <div className="space-y-6">
          {/* Resumen de errores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900">Error Máximo - Euler</h4>
                  <div className="text-2xl font-bold text-orange-700 my-1">
                    {errors.maxEuler.toExponential(3)}
                  </div>
                  <p className="text-xs text-orange-700">
                    en t = {errors.maxEulerAt.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900">Error Máximo - RK4</h4>
                  <div className="text-2xl font-bold text-blue-700 my-1">
                    {errors.maxRK4.toExponential(3)}
                  </div>
                  <p className="text-xs text-blue-700">
                    en t = {errors.maxRK4At.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Factor de mejora */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-purple-700 font-medium mb-1">Factor de Mejora</div>
                <div className="text-3xl font-bold text-purple-700">
                  {isFinite(errors.factor) ? errors.factor.toFixed(0) : '∞'}×
                </div>
                <div className="text-xs text-purple-600">RK4 más preciso</div>
              </div>
              <div>
                <div className="text-xs text-purple-700 font-medium mb-1">Error Promedio Euler</div>
                <div className="text-xl font-bold text-orange-600">
                  {errors.avgEuler.toExponential(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-700 font-medium mb-1">Error Promedio RK4</div>
                <div className="text-xl font-bold text-blue-600">
                  {errors.avgRK4.toExponential(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de pasos */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Primeros 5 pasos</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-2 py-1.5">Paso</th>
                    <th className="border border-gray-300 px-2 py-1.5">t</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-green-700">Exacta</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-orange-700">Euler</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-red-700">Error</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-blue-700">RK4</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-red-700">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.details.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-2 py-1 text-center font-medium">{row.step}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">{row.t.toFixed(3)}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-green-700">{row.exact.toFixed(6)}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-orange-600">{row.euler.toFixed(6)}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-red-600 font-mono">{row.eulerError.toExponential(2)}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-blue-600">{row.rk4.toFixed(6)}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-red-600 font-mono">{row.rk4Error.toExponential(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      {/* Consejos */}
      <Card title="💡 Experimenta">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex gap-2 items-start">
            <PlayCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Aumenta h:</strong>
              <p className="text-gray-600">Observa cómo Euler se desvía más que RK4</p>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <PlayCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Reduce h:</strong>
              <p className="text-gray-600">RK4 alcanza precisión excelente con menos pasos</p>
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <PlayCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Cambia la ecuación:</strong>
              <p className="text-gray-600">Prueba el crecimiento logístico para ver diferencias</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}


