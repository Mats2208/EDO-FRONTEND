import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
 */
export default function ResultsChart({ eulerData, rk4Data, exactData, showExact = true }) {
  
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
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="text-xs text-gray-500 text-center">
        Gráfico interactivo: pasa el cursor sobre las líneas para ver valores exactos
      </div>
    </div>
  )
}
