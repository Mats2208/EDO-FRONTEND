import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Componente para mostrar todos los pasos de la simulación con scroll interno
 */
export default function StepsTable({ eulerSteps, rk4Steps }) {
  const [expandedMethod, setExpandedMethod] = useState('euler')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const steps = expandedMethod === 'euler' ? eulerSteps : rk4Steps
  const methodName = expandedMethod === 'euler' ? 'Euler' : 'RK4'

  if (!steps || steps.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header colapsable */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-semibold text-gray-800">
          📊 Detalle de Pasos ({steps.length} pasos)
        </h3>
        <button className="text-gray-600 hover:text-gray-800">
          {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Contenido */}
      {!isCollapsed && (
        <div className="border-t border-gray-200">
          {/* Selector de método */}
          <div className="flex gap-2 p-4 bg-gray-50 border-b border-gray-200">
            <button
              onClick={() => setExpandedMethod('euler')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                expandedMethod === 'euler'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Euler ({eulerSteps?.length || 0} pasos)
            </button>
            <button
              onClick={() => setExpandedMethod('rk4')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                expandedMethod === 'rk4'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              RK4 ({rk4Steps?.length || 0} pasos)
            </button>
          </div>

          {/* Tabla con scroll */}
          <div className="overflow-auto" style={{ maxHeight: '400px' }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 border-b-2 border-gray-300 shadow-sm z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-300">
                    Paso
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-300">
                    x (independiente)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    y (dependiente)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {steps.map((step, index) => (
                  <tr 
                    key={index}
                    className={`hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">
                      {index}
                    </td>
                    <td className="px-4 py-3 text-gray-700 border-r border-gray-200 font-mono">
                      {typeof step.x === 'number' ? step.x.toFixed(6) : step.x}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-mono">
                      {typeof step.y === 'number' ? step.y.toFixed(6) : step.y}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer con resumen */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>
                <strong>Método {methodName}:</strong> {steps.length} iteraciones desde x = {steps[0].x.toFixed(2)} hasta x = {steps[steps.length - 1].x.toFixed(2)}
              </span>
              <span className="font-mono text-blue-600">
                Valor final: y({steps[steps.length - 1].x.toFixed(2)}) = {steps[steps.length - 1].y.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
