import { Calculator, TrendingUp, Zap } from 'lucide-react'
import Simulator from '../components/laboratory/Simulator'

export default function Laboratory() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Calculator className="w-10 h-10 text-blue-600" />
          Laboratorio Interactivo
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Experimenta con ecuaciones diferenciales ordinarias y compara los métodos de Euler y Runge-Kutta de orden 4 (RK4) en tiempo real.
        </p>
      </div>

      {/* Features destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-900 mb-2">
            <Calculator className="w-5 h-5" />
            <h3 className="font-semibold">Ecuaciones Personalizadas</h3>
          </div>
          <p className="text-sm text-blue-800">
            Define tus propias EDOs o elige entre problemas clásicos predefinidos
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 text-green-900 mb-2">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold">Comparación Visual</h3>
          </div>
          <p className="text-sm text-green-800">
            Visualiza gráficamente las diferencias entre métodos y la solución exacta
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 text-orange-900 mb-2">
            <Zap className="w-5 h-5" />
            <h3 className="font-semibold">Análisis en Tiempo Real</h3>
          </div>
          <p className="text-sm text-orange-800">
            Obtén métricas instantáneas de precisión, pasos y eficiencia computacional
          </p>
        </div>
      </div>

      {/* Simulador */}
      <Simulator />
    </div>
  )
}
