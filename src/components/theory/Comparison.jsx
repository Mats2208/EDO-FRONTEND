import { Scale, TrendingUp, Clock, Award, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../shared/Card'
import MathFormula from '../shared/MathFormula'
import Button from '../shared/Button'

/**
 * Página: Comparación Euler vs RK4
 */
export default function Comparison() {
  return (
    <div className="space-y-8">
      {/* Introducción */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Scale className="w-8 h-8 text-purple-600" />
          Comparación: Euler vs RK4
        </h2>
        <p className="text-lg text-gray-600">
          Una comparación detallada entre los dos métodos más importantes para resolver EDOs numéricamente.
        </p>
      </div>

      {/* Tabla comparativa general */}
      <Card title="Comparación Rápida">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">Aspecto</th>
                <th className="border border-gray-300 px-4 py-3 text-center bg-orange-50">
                  <div className="flex items-center justify-center gap-2">
                    <span>Euler</span>
                  </div>
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center bg-blue-50">
                  <div className="flex items-center justify-center gap-2">
                    <span>RK4</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Fórmula</td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <MathFormula>{`y_{n+1} = y_n + h f(t_n, y_n)`}</MathFormula>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <MathFormula>{`y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)`}</MathFormula>
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Orden del método</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-orange-700">
                  <strong>1er orden</strong>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-blue-700">
                  <strong>4to orden</strong>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Error local</td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <MathFormula>{`O(h^2)`}</MathFormula>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <MathFormula>{`O(h^5)`}</MathFormula>
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Error global</td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <MathFormula>{`O(h)`}</MathFormula>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <MathFormula>{`O(h^4)`}</MathFormula>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Evaluaciones de f por paso</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-green-700">
                  <strong>1</strong>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-yellow-700">
                  <strong>4</strong>
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Complejidad de implementación</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-green-700">Simple</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-yellow-700">Moderada</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Precisión típica</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-red-700">Baja</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-green-700">Alta</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Precisión vs Costo */}
      <Card title="Precisión vs Costo Computacional">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Escenario 1: Mismo tamaño de paso
            </h4>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-900 mb-2">Euler con h = 0.1</p>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• 1 evaluación por paso</li>
                <li>• Error moderado</li>
                <li>• Más rápido</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">RK4 con h = 0.1</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 4 evaluaciones por paso</li>
                <li>• Error muy pequeño (100-1000× menor)</li>
                <li>• 4× más lento que Euler</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-900">
                <strong>Veredicto:</strong> RK4 es mucho más preciso con solo 4× el costo
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Escenario 2: Misma precisión objetivo
            </h4>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-900 mb-2">Euler con h = 0.001</p>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Necesita h muy pequeño</li>
                <li>• Muchos pasos (1000+)</li>
                <li>• Tiempo total: largo</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">RK4 con h = 0.1</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Puede usar h mayor</li>
                <li>• Pocos pasos (10-100)</li>
                <li>• Tiempo total: corto</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-900">
                <strong>Veredicto:</strong> RK4 es más rápido para la misma precisión
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Cuándo usar cada uno */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="¿Cuándo usar Euler?">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <Award className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-gray-900">Aprendizaje y enseñanza</h5>
                <p className="text-sm text-gray-600">
                  Excelente para entender conceptos básicos de métodos numéricos
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Award className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-gray-900">Prototipado rápido</h5>
                <p className="text-sm text-gray-600">
                  Cuando necesitas resultados aproximados rápidamente
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Award className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-gray-900">Problemas simples</h5>
                <p className="text-sm text-gray-600">
                  EDOs muy suaves donde la precisión no es crítica
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Award className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-gray-900">Recursos limitados</h5>
                <p className="text-sm text-gray-600">
                  Sistemas embebidos con poca memoria o poder de cómputo
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="¿Cuándo usar RK4?">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-gray-900">Aplicaciones prácticas</h5>
                <p className="text-sm text-gray-600">
                  Simulaciones en ingeniería, física, biología
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-gray-900">Precisión importante</h5>
                <p className="text-sm text-gray-600">
                  Cuando los errores numéricos pueden afectar conclusiones
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-gray-900">Intervalos largos</h5>
                <p className="text-sm text-gray-600">
                  Integraciones en intervalos grandes donde el error se acumula
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-gray-900">Producción</h5>
                <p className="text-sm text-gray-600">
                  Código en producción que requiere confiabilidad
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Ejemplo numérico comparativo */}
      <Card title="Comparación Numérica Concreta">
        <div className="space-y-4">
          <p className="text-gray-700">
            Ejemplo: <MathFormula>{`\\frac{dy}{dt} = y`}</MathFormula>, <MathFormula>{`y(0) = 1`}</MathFormula>, 
            resolver hasta <MathFormula>{`t = 2`}</MathFormula>. Solución exacta: <MathFormula>{`y(2) = e^2 \\approx 7.389`}</MathFormula>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2">Método</th>
                  <th className="border border-gray-300 px-3 py-2">h</th>
                  <th className="border border-gray-300 px-3 py-2">Pasos</th>
                  <th className="border border-gray-300 px-3 py-2">Evaluaciones</th>
                  <th className="border border-gray-300 px-3 py-2">y(2) aprox.</th>
                  <th className="border border-gray-300 px-3 py-2">Error absoluto</th>
                  <th className="border border-gray-300 px-3 py-2">Error relativo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-orange-50">
                  <td className="border border-gray-300 px-3 py-2 font-medium">Euler</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.2</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">10</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">10</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">6.192</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-red-600">1.197</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-red-600">16.2%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 px-3 py-2 font-medium">RK4</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.2</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">10</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">40</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">7.389</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-green-600">0.000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-green-600">0.001%</td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="border border-gray-300 px-3 py-2 font-medium">Euler</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.01</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">200</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">200</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">7.316</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-yellow-600">0.073</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-yellow-600">1.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-900">
                <strong>Euler con h=0.2:</strong> 10 evaluaciones, error del 16%
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>RK4 con h=0.2:</strong> 40 evaluaciones (4× más), error del 0.001%
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900">
              <strong>💡 Conclusión:</strong> Para obtener 1% de error, Euler necesita 200 evaluaciones, 
              mientras que RK4 logra 0.001% con solo 40 evaluaciones. RK4 es <strong>5× más eficiente</strong> 
              en este caso.
            </p>
          </div>
        </div>
      </Card>

      {/* Recomendación final */}
      <Card title="Recomendación General">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-3 text-lg">🎯 Regla de Oro</h4>
            <p className="text-blue-800 mb-4">
              <strong>Para aplicaciones prácticas y producción, usa RK4</strong>. Su superior precisión 
              y eficiencia lo hacen la opción predeterminada en la mayoría de los casos.
            </p>
            <p className="text-blue-800">
              Solo usa Euler para aprendizaje, prototipado rápido, o cuando las limitaciones 
              computacionales sean extremas y la precisión no sea crítica.
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Link to="/laboratory">
              <Button variant="primary" className="gap-2">
                <Zap className="w-5 h-5" />
                Compara ambos métodos en el Laboratorio
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
