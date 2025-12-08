import { ArrowUpCircle, ArrowDownCircle, Activity, Clock } from 'lucide-react'

/**
 * Componente para mostrar métricas y comparación de métodos
 */
export default function MetricsTable({ eulerData, rk4Data, exactData }) {
  if (!eulerData && !rk4Data) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
        <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>Ejecuta una simulación para ver las métricas</p>
      </div>
    )
  }

  // Calcular errores si hay solución exacta
  const calculateError = (data) => {
    if (!exactData || !data) return null
    
    const errors = data.y.map((y, i) => {
      const exactY = exactData.y[i]
      return exactY !== undefined ? Math.abs(y - exactY) : null
    }).filter(e => e !== null)

    if (errors.length === 0) return null

    return {
      maxError: Math.max(...errors),
      avgError: errors.reduce((a, b) => a + b, 0) / errors.length,
      finalError: errors[errors.length - 1]
    }
  }

  const eulerError = calculateError(eulerData)
  const rk4Error = calculateError(rk4Data)

  // Comparar eficiencia
  const compareEfficiency = () => {
    if (!eulerData || !rk4Data || !eulerError || !rk4Error) return null

    const eulerEfficiency = eulerError.maxError / eulerData.evaluations
    const rk4Efficiency = rk4Error.maxError / rk4Data.evaluations

    return {
      eulerEfficiency,
      rk4Efficiency,
      winner: rk4Efficiency < eulerEfficiency ? 'rk4' : 'euler',
      improvement: ((eulerEfficiency - rk4Efficiency) / eulerEfficiency * 100).toFixed(1)
    }
  }

  const efficiency = compareEfficiency()

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Métricas de Simulación</h3>

      {/* Tabla comparativa básica */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Métrica</th>
              {eulerData && <th className="border border-gray-300 px-4 py-2 text-center text-orange-700">Euler</th>}
              {rk4Data && <th className="border border-gray-300 px-4 py-2 text-center text-blue-700">RK4</th>}
            </tr>
          </thead>
          <tbody>
            {/* Pasos */}
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Pasos ejecutados</td>
              {eulerData && <td className="border border-gray-300 px-4 py-2 text-center">{eulerData.steps}</td>}
              {rk4Data && <td className="border border-gray-300 px-4 py-2 text-center">{rk4Data.steps}</td>}
            </tr>

            {/* Evaluaciones */}
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-medium">
                Evaluaciones de f(t,y)
                <span className="text-xs text-gray-500 block">Costo computacional</span>
              </td>
              {eulerData && (
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {eulerData.evaluations}
                  <span className="text-xs text-gray-500 block">(1 por paso)</span>
                </td>
              )}
              {rk4Data && (
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {rk4Data.evaluations}
                  <span className="text-xs text-gray-500 block">(4 por paso)</span>
                </td>
              )}
            </tr>

            {/* Valor final */}
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Valor final y(tf)</td>
              {eulerData && (
                <td className="border border-gray-300 px-4 py-2 text-center font-mono">
                  {eulerData.y[eulerData.y.length - 1].toFixed(6)}
                </td>
              )}
              {rk4Data && (
                <td className="border border-gray-300 px-4 py-2 text-center font-mono">
                  {rk4Data.y[rk4Data.y.length - 1].toFixed(6)}
                </td>
              )}
            </tr>

            {/* Solución exacta si existe */}
            {exactData && (
              <tr className="bg-green-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-green-800">
                  Solución exacta y(tf)
                </td>
                <td 
                  colSpan={[eulerData, rk4Data].filter(Boolean).length} 
                  className="border border-gray-300 px-4 py-2 text-center font-mono text-green-800"
                >
                  {exactData.y[exactData.y.length - 1].toFixed(6)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Análisis de errores (si hay solución exacta) */}
      {(eulerError || rk4Error) && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Análisis de Error
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eulerError && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-sm font-medium text-orange-900 mb-2">Euler</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error máximo:</span>
                    <span className="font-mono font-medium">{eulerError.maxError.toExponential(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error promedio:</span>
                    <span className="font-mono font-medium">{eulerError.avgError.toExponential(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error final:</span>
                    <span className="font-mono font-medium">{eulerError.finalError.toExponential(3)}</span>
                  </div>
                </div>
              </div>
            )}

            {rk4Error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">RK4</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error máximo:</span>
                    <span className="font-mono font-medium">{rk4Error.maxError.toExponential(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error promedio:</span>
                    <span className="font-mono font-medium">{rk4Error.avgError.toExponential(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error final:</span>
                    <span className="font-mono font-medium">{rk4Error.finalError.toExponential(3)}</span>
                  </div>
                </div>
              </div>
            )}

            {efficiency && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                  {efficiency.winner === 'rk4' ? (
                    <ArrowUpCircle className="w-4 h-4" />
                  ) : (
                    <ArrowDownCircle className="w-4 h-4" />
                  )}
                  Veredicto
                </div>
                <div className="text-sm space-y-2">
                  <p>
                    <strong className={efficiency.winner === 'rk4' ? 'text-blue-700' : 'text-orange-700'}>
                      {efficiency.winner === 'rk4' ? 'RK4' : 'Euler'}
                    </strong> es más eficiente
                  </p>
                  {efficiency.improvement > 0 && (
                    <p className="text-xs text-gray-600">
                      Mejora de {efficiency.improvement}% en precisión por evaluación
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conclusiones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">💡 Interpretación:</p>
            <ul className="space-y-1 text-blue-800">
              <li>• RK4 realiza 4× más evaluaciones por paso, pero es mucho más preciso</li>
              <li>• Para h pequeño, RK4 puede ser más eficiente que Euler con h más pequeño aún</li>
              {efficiency && efficiency.winner === 'rk4' && (
                <li>• En este caso, RK4 ofrece mejor relación precisión/costo</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
