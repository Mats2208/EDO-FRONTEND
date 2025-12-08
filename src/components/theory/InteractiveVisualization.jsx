import { useState, useMemo } from 'react'
import { LineChart, PlayCircle, RotateCcw, TrendingUp, Zap, Compass, Info } from 'lucide-react'
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

  const example = EXAMPLES[selectedExample]

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

  // Funciones de conversión a coordenadas SVG (porcentaje)
  const toX = (t) => ((t - bounds.tMin) / (bounds.tMax - bounds.tMin)) * 100
  const toY = (y) => (1 - (y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * 100

  // Generar path para una serie de puntos
  const generatePath = (points, getT, getY) => {
    if (points.length === 0) return ''
    
    let path = `M ${toX(getT(points[0]))} ${toY(getY(points[0]))}`
    for (let i = 1; i < points.length; i++) {
      const t = getT(points[i])
      const y = getY(points[i])
      if (isFinite(y)) {
        path += ` L ${toX(t)} ${toY(y)}`
      }
    }
    return path
  }

  // Generar ticks para los ejes
  const generateTicks = (min, max, count = 5) => {
    const step = (max - min) / count
    const ticks = []
    for (let i = 0; i <= count; i++) {
      ticks.push(min + i * step)
    }
    return ticks
  }

  const tTicks = generateTicks(bounds.tMin, bounds.tMax, 5)
  const yTicks = generateTicks(bounds.yMin, bounds.yMax, 5)

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

      {/* Gráfica SVG */}
      <Card title="3. Gráfica Comparativa">
        <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Contenedor del gráfico con padding para labels */}
          <div className="relative" style={{ paddingLeft: '50px', paddingBottom: '40px', paddingRight: '20px', paddingTop: '20px' }}>
            {/* Área del gráfico */}
            <div className="relative" style={{ height: '400px' }}>
              {/* SVG principal */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                style={{ overflow: 'visible' }}
              >
                {/* Grid */}
                <g className="grid">
                  {/* Líneas verticales */}
                  {tTicks.map((t, i) => (
                    <line
                      key={`v-${i}`}
                      x1={`${toX(t)}%`}
                      y1="0%"
                      x2={`${toX(t)}%`}
                      y2="100%"
                      stroke="#e5e7eb"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  {/* Líneas horizontales */}
                  {yTicks.map((y, i) => (
                    <line
                      key={`h-${i}`}
                      x1="0%"
                      y1={`${toY(y)}%`}
                      x2="100%"
                      y2={`${toY(y)}%`}
                      stroke="#e5e7eb"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>

                {/* Ejes */}
                <line x1="0%" y1="100%" x2="100%" y2="100%" stroke="#9ca3af" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="0%" y1="0%" x2="0%" y2="100%" stroke="#9ca3af" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>

              {/* Campo de direcciones (capa separada) */}
              {showDirectionField && (
                <SVGDirectionField
                  f={example.f}
                  tMin={bounds.tMin}
                  tMax={bounds.tMax}
                  yMin={bounds.yMin}
                  yMax={bounds.yMax}
                  gridCountX={fieldDensity}
                  gridCountY={Math.round(fieldDensity * 0.8)}
                  arrowScale={0.6}
                  color="#9ca3af"
                  opacity={0.4}
                  strokeWidth={1}
                />
              )}

              {/* Curvas de solución */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                style={{ overflow: 'visible' }}
              >
                {/* Solución exacta */}
                {showExact && (
                  <path
                    d={generatePath(solutions.exact, p => p.t, p => p.y)}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                {/* Euler - línea */}
                {showEuler && (
                  <path
                    d={generatePath(
                      solutions.euler.t.map((t, i) => ({ t, y: solutions.euler.y[i] })),
                      p => p.t,
                      p => p.y
                    )}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeDasharray="5,3"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                {/* RK4 - línea */}
                {showRK4 && (
                  <path
                    d={generatePath(
                      solutions.rk4.t.map((t, i) => ({ t, y: solutions.rk4.y[i] })),
                      p => p.t,
                      p => p.y
                    )}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                {/* Euler - puntos */}
                {showEuler && solutions.euler.t.length <= 50 && solutions.euler.t.map((t, i) => (
                  <circle
                    key={`euler-${i}`}
                    cx={`${toX(t)}%`}
                    cy={`${toY(solutions.euler.y[i])}%`}
                    r="0.6"
                    fill="#f97316"
                    stroke="#fff"
                    strokeWidth="0.2"
                  />
                ))}

                {/* RK4 - puntos */}
                {showRK4 && solutions.rk4.t.length <= 50 && solutions.rk4.t.map((t, i) => (
                  <circle
                    key={`rk4-${i}`}
                    cx={`${toX(t)}%`}
                    cy={`${toY(solutions.rk4.y[i])}%`}
                    r="0.6"
                    fill="#3b82f6"
                    stroke="#fff"
                    strokeWidth="0.2"
                  />
                ))}
              </svg>
            </div>

            {/* Labels eje Y (izquierda) */}
            <div className="absolute left-0 top-0 bottom-0 w-[50px] flex flex-col justify-between py-[20px]" style={{ marginLeft: '-50px', height: '400px' }}>
              {yTicks.slice().reverse().map((y, i) => (
                <div key={i} className="text-xs text-gray-500 text-right pr-2">
                  {y.toFixed(1)}
                </div>
              ))}
            </div>

            {/* Labels eje X (abajo) */}
            <div className="absolute left-0 right-0 bottom-0 h-[40px] flex justify-between" style={{ marginBottom: '-40px', marginLeft: '50px', marginRight: '20px' }}>
              {tTicks.map((t, i) => (
                <div key={i} className="text-xs text-gray-500 text-center">
                  {t.toFixed(1)}
                </div>
              ))}
            </div>
          </div>

          {/* Label del eje Y */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
            y
          </div>

          {/* Label del eje X */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
            t
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {showExact && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Exacta</span>
            </div>
          )}
          {showEuler && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-orange-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f97316, #f97316 5px, transparent 5px, transparent 8px)' }}></div>
              <span className="text-sm text-gray-700">Euler</span>
            </div>
          )}
          {showRK4 && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-700">RK4</span>
            </div>
          )}
          {showDirectionField && (
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700">Campo de Direcciones</span>
            </div>
          )}
        </div>

        {showDirectionField && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-2">
            <Info size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Las flechas grises muestran la dirección del campo de pendientes en cada punto. 
              Las curvas solución siempre son tangentes a estas flechas.
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
