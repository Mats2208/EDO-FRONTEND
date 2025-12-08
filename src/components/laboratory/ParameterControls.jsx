import { useState } from 'react'
import Input from '../shared/Input'
import Slider from '../shared/Slider'
import Button from '../shared/Button'
import { PlayCircle, RotateCcw } from 'lucide-react'

/**
 * Componente para controlar parámetros de simulación
 */
export default function ParameterControls({ 
  parameters, 
  onParametersChange, 
  onSimulate,
  isSimulating = false 
}) {
  const [localParams, setLocalParams] = useState(parameters)

  const handleChange = (key, value) => {
    const updated = { ...localParams, [key]: parseFloat(value) || 0 }
    setLocalParams(updated)
    onParametersChange(updated)
  }

  const handleReset = () => {
    const defaults = {
      t0: 0,
      y0: 1,
      tf: 5,
      h: 0.1
    }
    setLocalParams(defaults)
    onParametersChange(defaults)
  }

  // Validaciones
  const isValid = () => {
    return (
      localParams.t0 < localParams.tf &&
      localParams.h > 0 &&
      localParams.h <= (localParams.tf - localParams.t0)
    )
  }

  const getSteps = () => {
    if (!isValid()) return 0
    return Math.ceil((localParams.tf - localParams.t0) / localParams.h)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* x0 - Valor inicial de x */}
        <div>
          <Input
            label="x₀ (Valor inicial de x)"
            type="number"
            step="0.1"
            value={localParams.t0}
            onChange={(e) => handleChange('t0', e.target.value)}
          />
        </div>

        {/* y0 - Condición inicial */}
        <div>
          <Input
            label="y₀ (Condición inicial)"
            type="number"
            step="0.1"
            value={localParams.y0}
            onChange={(e) => handleChange('y0', e.target.value)}
          />
        </div>

        {/* xf - Valor final de x */}
        <div>
          <Input
            label="xf (Valor final de x)"
            type="number"
            step="0.1"
            value={localParams.tf}
            onChange={(e) => handleChange('tf', e.target.value)}
          />
          {localParams.tf <= localParams.t0 && (
            <p className="text-xs text-red-600 mt-1">
              xf debe ser mayor que x₀
            </p>
          )}
        </div>

        {/* h - Tamaño de paso (con slider) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            h (Tamaño de paso)
          </label>
          <Slider
            min={0.001}
            max={1}
            step={0.001}
            value={localParams.h}
            onChange={(value) => handleChange('h', value)}
            showValue={true}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Más preciso (lento)</span>
            <span>Menos preciso (rápido)</span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Intervalo:</span>
            <div className="font-medium">
              [{localParams.t0}, {localParams.tf}]
            </div>
          </div>
          <div>
            <span className="text-gray-600">Longitud:</span>
            <div className="font-medium">
              {(localParams.tf - localParams.t0).toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Pasos estimados:</span>
            <div className="font-medium">
              {getSteps()}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Tamaño de paso:</span>
            <div className="font-medium">
              h = {localParams.h.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Advertencia si hay muchos pasos */}
        {getSteps() > 10000 && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            ⚠️ Más de 10,000 pasos. La simulación puede ser lenta.
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3">
        <Button
          onClick={onSimulate}
          disabled={!isValid() || isSimulating}
          variant="primary"
          className="flex-1"
        >
          <PlayCircle className="w-5 h-5" />
          {isSimulating ? 'Simulando...' : 'Simular'}
        </Button>
        <Button
          onClick={handleReset}
          variant="secondary"
        >
          <RotateCcw className="w-5 h-5" />
          Resetear
        </Button>
      </div>
    </div>
  )
}
