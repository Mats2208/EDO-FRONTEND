import { useState, useMemo, useCallback } from 'react'
import { LineChart, Info } from 'lucide-react'
import Card from '../shared/Card'
import MathFormula from '../shared/MathFormula'

// ============================================================================
// EJEMPLOS DE ECUACIONES
// ============================================================================
const EXAMPLES = {
  exponential: {
    name: 'Crecimiento Exponencial',
    displayEq: "\\frac{dy}{dx} = y",
    f: (x, y) => y,
    exact: (x, x0, y0) => y0 * Math.exp(x - x0),
    xMin: -2, xMax: 2,
    yMin: -2, yMax: 2
  },
  decay: {
    name: 'Decaimiento',
    displayEq: "\\frac{dy}{dx} = -y",
    f: (x, y) => -y,
    exact: (x, x0, y0) => y0 * Math.exp(-(x - x0)),
    xMin: -2, xMax: 2,
    yMin: -2, yMax: 2
  },
  linear: {
    name: 'Lineal',
    displayEq: "\\frac{dy}{dx} = x",
    f: (x, _y) => x,
    exact: (x, x0, y0) => y0 + 0.5 * (x * x - x0 * x0),
    xMin: -3, xMax: 3,
    yMin: -3, yMax: 3
  },
  quadratic: {
    name: 'Dependiente de y',
    displayEq: "\\frac{dy}{dx} = y^2",
    f: (x, y) => y * y,
    exact: (x, x0, y0) => y0 / (1 - y0 * (x - x0)),
    xMin: -2, xMax: 2,
    yMin: -3, yMax: 3
  },
  mixed: {
    name: 'Mixta',
    displayEq: "\\frac{dy}{dx} = x + y",
    f: (x, y) => x + y,
    exact: (x, x0, y0) => -1 - x + (y0 + 1 + x0) * Math.exp(x - x0),
    xMin: -2, xMax: 2,
    yMin: -3, yMax: 3
  },
  circular: {
    name: 'Circular',
    displayEq: "\\frac{dy}{dx} = -\\frac{x}{y}",
    f: (x, y) => y !== 0 ? -x / y : 0,
    exact: (x, x0, y0) => {
      const r2 = x0 * x0 + y0 * y0
      const val = r2 - x * x
      return val > 0 ? Math.sign(y0) * Math.sqrt(val) : NaN
    },
    xMin: -3, xMax: 3,
    yMin: -3, yMax: 3
  }
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function DirectionField() {
  const [selectedExample, setSelectedExample] = useState('exponential')
  const [density, setDensity] = useState(18)
  const [showSolution, setShowSolution] = useState(true)
  const [clickedPoint, setClickedPoint] = useState(null)

  const example = EXAMPLES[selectedExample]

  // Dimensiones del gráfico en coordenadas de viewBox
  const viewBoxSize = 100
  const padding = 8 // Padding para labels

  // Conversión de coordenadas matemáticas a SVG
  const toSvgX = useCallback((x) => {
    return padding + ((x - example.xMin) / (example.xMax - example.xMin)) * (viewBoxSize - 2 * padding)
  }, [example.xMin, example.xMax])

  const toSvgY = useCallback((y) => {
    return (viewBoxSize - padding) - ((y - example.yMin) / (example.yMax - example.yMin)) * (viewBoxSize - 2 * padding)
  }, [example.yMin, example.yMax])

  // Conversión inversa: SVG a matemáticas
  const toMathX = useCallback((svgX) => {
    return example.xMin + ((svgX - padding) / (viewBoxSize - 2 * padding)) * (example.xMax - example.xMin)
  }, [example.xMin, example.xMax])

  const toMathY = useCallback((svgY) => {
    return example.yMin + ((viewBoxSize - padding - svgY) / (viewBoxSize - 2 * padding)) * (example.yMax - example.yMin)
  }, [example.yMin, example.yMax])

  // Generar flechas del campo de direcciones
  const arrows = useMemo(() => {
    const result = []
    const gridX = density
    const gridY = density

    // Espaciado entre flechas
    const xStep = (example.xMax - example.xMin) / (gridX + 1)
    const yStep = (example.yMax - example.yMin) / (gridY + 1)

    // Tamaño máximo de las flechas en coordenadas matemáticas
    const maxArrowSize = Math.min(xStep, yStep) * 0.7

    for (let i = 1; i <= gridX; i++) {
      for (let j = 1; j <= gridY; j++) {
        const x = example.xMin + i * xStep
        const y = example.yMin + j * yStep

        try {
          const slope = example.f(x, y)
          
          if (!isFinite(slope) || Math.abs(slope) > 100) continue

          // Calcular componentes del vector normalizado
          // Vector dirección: (1, slope)
          const magnitude = Math.sqrt(1 + slope * slope)
          const dx = (1 / magnitude) * maxArrowSize
          const dy = (slope / magnitude) * maxArrowSize

          // Puntos en coordenadas matemáticas
          const x1 = x - dx / 2
          const y1 = y - dy / 2
          const x2 = x + dx / 2
          const y2 = y + dy / 2

          result.push({
            x1: toSvgX(x1),
            y1: toSvgY(y1),
            x2: toSvgX(x2),
            y2: toSvgY(y2),
            cx: toSvgX(x),
            cy: toSvgY(y)
          })
        } catch {
          continue
        }
      }
    }

    return result
  }, [example, density, toSvgX, toSvgY])

  // Generar curva solución
  const solutionPath = useMemo(() => {
    if (!showSolution || !clickedPoint) return null

    const { mathX: x0, mathY: y0 } = clickedPoint
    const points = []
    const numPoints = 300

    // Generar puntos de la solución exacta
    for (let i = 0; i <= numPoints; i++) {
      const x = example.xMin + (i / numPoints) * (example.xMax - example.xMin)
      
      try {
        const y = example.exact(x, x0, y0)
        
        if (isFinite(y) && y >= example.yMin - 1 && y <= example.yMax + 1) {
          points.push({ x, y, svgX: toSvgX(x), svgY: toSvgY(y) })
        }
      } catch {
        continue
      }
    }

    if (points.length < 2) return null

    // Construir path, cortando cuando hay discontinuidades
    let path = ''
    let lastY = null

    for (const point of points) {
      const isDiscontinuity = lastY !== null && Math.abs(point.y - lastY) > (example.yMax - example.yMin) * 0.3
      
      if (path === '' || isDiscontinuity) {
        path += `M ${point.svgX} ${point.svgY} `
      } else {
        path += `L ${point.svgX} ${point.svgY} `
      }
      
      lastY = point.y
    }

    return path
  }, [showSolution, clickedPoint, example, toSvgX, toSvgY])

  // Generar grid
  const gridLines = useMemo(() => {
    const lines = []
    const numLines = 6

    // Líneas verticales
    for (let i = 0; i <= numLines; i++) {
      const x = example.xMin + (i / numLines) * (example.xMax - example.xMin)
      lines.push({
        type: 'v',
        x1: toSvgX(x), y1: toSvgY(example.yMax),
        x2: toSvgX(x), y2: toSvgY(example.yMin),
        label: x.toFixed(1),
        labelX: toSvgX(x),
        labelY: viewBoxSize - 2
      })
    }

    // Líneas horizontales
    for (let i = 0; i <= numLines; i++) {
      const y = example.yMin + (i / numLines) * (example.yMax - example.yMin)
      lines.push({
        type: 'h',
        x1: toSvgX(example.xMin), y1: toSvgY(y),
        x2: toSvgX(example.xMax), y2: toSvgY(y),
        label: y.toFixed(1),
        labelX: 2,
        labelY: toSvgY(y)
      })
    }

    return lines
  }, [example, toSvgX, toSvgY])

  // Manejar click en el SVG
  const handleSvgClick = (e) => {
    if (!showSolution) return

    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    
    // Coordenadas relativas al SVG (0-100 en viewBox)
    const svgX = ((e.clientX - rect.left) / rect.width) * viewBoxSize
    const svgY = ((e.clientY - rect.top) / rect.height) * viewBoxSize

    // Convertir a coordenadas matemáticas
    const mathX = toMathX(svgX)
    const mathY = toMathY(svgY)

    // Verificar que esté dentro del área del gráfico
    if (mathX >= example.xMin && mathX <= example.xMax && 
        mathY >= example.yMin && mathY <= example.yMax) {
      setClickedPoint({ svgX, svgY, mathX, mathY })
    }
  }

  // Cambiar ejemplo
  const handleExampleChange = (key) => {
    setSelectedExample(key)
    setClickedPoint(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <LineChart className="w-8 h-8 text-indigo-600" />
          Campos de Direcciones
        </h2>
        <p className="text-lg text-gray-600">
          Visualiza cómo la pendiente de la solución varía en cada punto del plano.
          Cada flecha muestra la dirección que debe seguir la solución en ese punto.
        </p>
      </div>

      {/* Selector de ejemplos */}
      <Card title="Selecciona una Ecuación">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(EXAMPLES).map(([key, ex]) => (
            <button
              key={key}
              onClick={() => handleExampleChange(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedExample === key
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <h4 className={`font-semibold mb-2 ${selectedExample === key ? 'text-indigo-900' : 'text-gray-900'}`}>
                {ex.name}
              </h4>
              <div className="text-sm">
                <MathFormula>{ex.displayEq}</MathFormula>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Controles */}
      <Card title="Controles">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Densidad del campo: <span className="text-indigo-600 font-bold">{density}×{density}</span>
            </label>
            <input
              type="range"
              min="10"
              max="30"
              step="1"
              value={density}
              onChange={(e) => setDensity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Menos flechas</span>
              <span>Más flechas</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSolution}
                onChange={(e) => setShowSolution(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
              />
              <span className="text-sm text-gray-700">Mostrar curva solución al hacer clic</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Canvas del campo direccional */}
      <Card title={`Campo de Direcciones: ${example.name}`}>
        <div className="space-y-3">
          {/* Ecuación actual */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-center">
              <MathFormula block>{example.displayEq}</MathFormula>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
            <div className="flex gap-2 items-start">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Cómo usar:</strong> {showSolution 
                  ? 'Haz clic en cualquier punto del gráfico para ver la curva solución que pasa por ese punto.' 
                  : 'Activa "Mostrar curva solución" y haz clic en el gráfico para ver soluciones.'}
              </div>
            </div>
          </div>

          {/* Gráfico SVG */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <svg
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
              className="w-full cursor-crosshair"
              style={{ maxWidth: '700px', display: 'block', margin: '0 auto' }}
              onClick={handleSvgClick}
            >
              {/* Grid */}
              {gridLines.map((line, i) => (
                <g key={i}>
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={line.type === 'v' && Math.abs(toMathX(line.x1)) < 0.01 ? '#9ca3af' : '#e5e7eb'}
                    strokeWidth={line.type === 'v' && Math.abs(toMathX(line.x1)) < 0.01 ? 0.3 : 0.15}
                  />
                  {/* Labels */}
                  {line.type === 'v' && (
                    <text
                      x={line.labelX}
                      y={line.labelY}
                      textAnchor="middle"
                      fontSize="2.5"
                      fill="#6b7280"
                    >
                      {line.label}
                    </text>
                  )}
                  {line.type === 'h' && (
                    <text
                      x={line.labelX}
                      y={line.labelY + 0.8}
                      textAnchor="start"
                      fontSize="2.5"
                      fill="#6b7280"
                    >
                      {line.label}
                    </text>
                  )}
                </g>
              ))}

              {/* Eje X (y=0) */}
              <line
                x1={toSvgX(example.xMin)}
                y1={toSvgY(0)}
                x2={toSvgX(example.xMax)}
                y2={toSvgY(0)}
                stroke="#9ca3af"
                strokeWidth="0.3"
              />

              {/* Eje Y (x=0) */}
              <line
                x1={toSvgX(0)}
                y1={toSvgY(example.yMin)}
                x2={toSvgX(0)}
                y2={toSvgY(example.yMax)}
                stroke="#9ca3af"
                strokeWidth="0.3"
              />

              {/* Labels de ejes */}
              <text x={viewBoxSize - 5} y={toSvgY(0) - 2} fontSize="3" fill="#6b7280">x</text>
              <text x={toSvgX(0) + 2} y={padding + 3} fontSize="3" fill="#6b7280">y</text>

              {/* Flechas del campo de direcciones */}
              {arrows.map((arrow, i) => {
                const dx = arrow.x2 - arrow.x1
                const dy = arrow.y2 - arrow.y1
                const angle = Math.atan2(dy, dx)
                const headSize = 1.2

                return (
                  <g key={i}>
                    {/* Línea */}
                    <line
                      x1={arrow.x1}
                      y1={arrow.y1}
                      x2={arrow.x2}
                      y2={arrow.y2}
                      stroke="#6b7280"
                      strokeWidth="0.4"
                      strokeLinecap="round"
                    />
                    {/* Punta de flecha */}
                    <path
                      d={`
                        M ${arrow.x2} ${arrow.y2}
                        L ${arrow.x2 - headSize * Math.cos(angle - Math.PI/6)} ${arrow.y2 - headSize * Math.sin(angle - Math.PI/6)}
                        M ${arrow.x2} ${arrow.y2}
                        L ${arrow.x2 - headSize * Math.cos(angle + Math.PI/6)} ${arrow.y2 - headSize * Math.sin(angle + Math.PI/6)}
                      `}
                      stroke="#6b7280"
                      strokeWidth="0.4"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                )
              })}

              {/* Curva solución */}
              {solutionPath && (
                <path
                  d={solutionPath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              )}

              {/* Punto clickeado */}
              {clickedPoint && showSolution && (
                <circle
                  cx={clickedPoint.svgX}
                  cy={clickedPoint.svgY}
                  r="1.5"
                  fill="#3b82f6"
                  stroke="#fff"
                  strokeWidth="0.4"
                />
              )}
            </svg>
          </div>

          {/* Info del punto seleccionado */}
          {clickedPoint && showSolution && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Punto seleccionado:</strong> ({clickedPoint.mathX.toFixed(3)}, {clickedPoint.mathY.toFixed(3)})
                — La curva azul es la solución que pasa por este punto.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Explicación */}
      <Card title="¿Qué es un Campo de Direcciones?">
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Un <strong>campo de direcciones</strong> (o campo de pendientes) es una representación visual
            de una ecuación diferencial que muestra la pendiente de la solución en cada punto del plano.
          </p>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">Interpretación:</h4>
            <ul className="space-y-2 text-indigo-800">
              <li className="flex gap-2">
                <span>•</span>
                <span>Cada flecha representa la <strong>dirección</strong> que debe seguir la solución en ese punto</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>La <strong>inclinación</strong> de la flecha indica el valor de dy/dx en ese punto</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Las <strong>curvas solución</strong> son tangentes a las flechas en cada punto por donde pasan</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Diferentes condiciones iniciales generan diferentes curvas, pero todas siguen el campo</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">💡 Conexión con Métodos Numéricos:</h4>
            <p className="text-yellow-800">
              El <strong>método de Euler</strong> funciona siguiendo estas flechas: en cada paso, avanza
              en la dirección indicada por el campo. Por eso, cuando el paso h es muy grande, Euler
              se desvía de la curva real — ¡está siguiendo líneas rectas en lugar de la curva!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
