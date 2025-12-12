import { useState, useEffect, useRef, useMemo } from 'react'
import { Compass } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import SVGDirectionField from '../visualization/SVGDirectionField'

// Tooltip personalizado (declarado fuera del componente)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 mb-2">
          t = {payload[0].payload.t.toFixed(4)}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toFixed(6)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

/**
 * Componente para mostrar gráficos de resultados de las simulaciones
 * @param {Object} parsedFunction - Función parseada f(x, y) para el campo de direcciones (opcional)
 */
export default function ResultsChart({ eulerData, rk4Data, exactData, showExact = true, parsedFunction = null }) {
  const [showDirectionField, setShowDirectionField] = useState(true)
  const [overlayRect, setOverlayRect] = useState(null)
  const chartContainerRef = useRef(null)
  const chartMargin = { top: 10, right: 30, left: 20, bottom: 30 }

  // Combinar los datos para Recharts
  const chartData = []

  if (eulerData && eulerData.t && eulerData.y) {
    eulerData.t.forEach((t, i) => {
      const existing = chartData.find(d => Math.abs(d.t - t) < 0.0001)
      if (existing) {
        existing.euler = eulerData.y[i]
      } else {
        chartData.push({
          t: t,
          euler: eulerData.y[i]
        })
      }
    })
  }

  if (rk4Data && rk4Data.t && rk4Data.y) {
    rk4Data.t.forEach((t, i) => {
      const existing = chartData.find(d => Math.abs(d.t - t) < 0.0001)
      if (existing) {
        existing.rk4 = rk4Data.y[i]
      } else {
        chartData.push({
          t: t,
          rk4: rk4Data.y[i]
        })
      }
    })
  }

  if (exactData && exactData.t && exactData.y && showExact) {
    exactData.t.forEach((t, i) => {
      const existing = chartData.find(d => Math.abs(d.t - t) < 0.0001)
      if (existing) {
        existing.exact = exactData.y[i]
      } else {
        chartData.push({
          t: t,
          exact: exactData.y[i]
        })
      }
    })
  }

  // Ordenar por tiempo
  chartData.sort((a, b) => a.t - b.t)

  // Calcular límites del gráfico para el campo de direcciones
  const bounds = useMemo(() => {
    if (chartData.length === 0) return null

    const allYValues = chartData.map(d => [d.euler, d.rk4, d.exact]).flat().filter(v => v !== undefined && isFinite(v))
    const allTValues = chartData.map(d => d.t).filter(v => v !== undefined && isFinite(v))

    if (allYValues.length === 0 || allTValues.length === 0) return null

    const yMin = Math.min(...allYValues)
    const yMax = Math.max(...allYValues)
    const tMin = Math.min(...allTValues)
    const tMax = Math.max(...allTValues)

    const yPadding = (yMax - yMin) * 0.1
    const tPadding = (tMax - tMin) * 0.05

    return {
      tMin: tMin - tPadding,
      tMax: tMax + tPadding,
      yMin: yMin - yPadding,
      yMax: yMax + yPadding
    }
  }, [chartData])

  // Calcular overlay rect para el campo de direcciones
  useEffect(() => {
    if (!chartContainerRef.current || !showDirectionField || !parsedFunction) return

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

      const cartesianGrid = wrapper.querySelector('.recharts-cartesian-grid')
      const parentRect = chartContainerRef.current.getBoundingClientRect()

      if (cartesianGrid) {
        const gridRect = cartesianGrid.getBoundingClientRect()
        setOverlayRect({
          top: gridRect.top - parentRect.top,
          left: gridRect.left - parentRect.left,
          width: gridRect.width,
          height: gridRect.height
        })
      } else {
        const wrapperRect = wrapper.getBoundingClientRect()
        setOverlayRect({
          top: wrapperRect.top - parentRect.top + chartMargin.top,
          left: wrapperRect.left - parentRect.left + chartMargin.left,
          width: wrapperRect.width - chartMargin.left - chartMargin.right,
          height: wrapperRect.height - chartMargin.top - chartMargin.bottom
        })
      }
    }

    const timeoutId = setTimeout(updateOverlayRect, 50)

    const resizeObserver = new window.ResizeObserver(updateOverlayRect)
    resizeObserver.observe(wrapper)
    window.addEventListener('resize', updateOverlayRect)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateOverlayRect)
    }
  }, [chartData, bounds, showDirectionField, parsedFunction, chartMargin.left, chartMargin.right, chartMargin.top, chartMargin.bottom])

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Sin datos para graficar</p>
          <p className="text-sm mt-2">Ejecuta una simulación para ver los resultados</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Resultados de la Simulación</h3>
        <div className="flex gap-4 text-sm items-center flex-wrap">
          {eulerData && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-medium">Euler ({eulerData.steps} pasos)</span>
            </div>
          )}
          {rk4Data && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium">RK4 ({rk4Data.steps} pasos)</span>
            </div>
          )}
          {exactData && showExact && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Exacta</span>
            </div>
          )}
          {parsedFunction && bounds && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDirectionField}
                onChange={(e) => setShowDirectionField(e.target.checked)}
                className="w-4 h-4 text-gray-600 rounded accent-gray-600"
              />
              <span className="flex items-center gap-1">
                <Compass size={14} className="text-gray-500" />
                Campo de Direcciones
              </span>
            </label>
          )}
        </div>
      </div>

      <div
        ref={chartContainerRef}
        className="relative w-full"
        style={{ height: 400 }}
      >
        {showDirectionField && parsedFunction && bounds && overlayRect && (
          <div className="pointer-events-none absolute" style={overlayRect}>
            <SVGDirectionField
              f={parsedFunction}
              tMin={bounds.tMin}
              tMax={bounds.tMax}
              yMin={bounds.yMin}
              yMax={bounds.yMax}
              gridCountX={15}
              gridCountY={12}
              arrowScale={0.85}
              color="#9ca3af"
              opacity={0.35}
              strokeWidth={1}
            />
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="t"
              label={{ value: 't (tiempo)', position: 'insideBottom', offset: -5 }}
              stroke="#6b7280"
            />
            <YAxis
              label={{ value: 'y', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
            />

            {eulerData && (
              <Line
                type="monotone"
                dataKey="euler"
                stroke="#f97316"
                strokeWidth={2}
                dot={chartData.length <= 50}
                name="Euler"
                connectNulls
                isAnimationActive={false}
              />
            )}

            {rk4Data && (
              <Line
                type="monotone"
                dataKey="rk4"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={chartData.length <= 50}
                name="RK4"
                connectNulls
                isAnimationActive={false}
              />
            )}

            {exactData && showExact && (
              <Line
                type="monotone"
                dataKey="exact"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Solución Exacta"
                connectNulls
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Gráfico interactivo: pasa el cursor sobre las líneas para ver valores exactos
        {showDirectionField && parsedFunction && (
          <span className="block mt-1">Las flechas grises muestran la pendiente en cada punto del campo</span>
        )}
      </div>
    </div>
  )
}
