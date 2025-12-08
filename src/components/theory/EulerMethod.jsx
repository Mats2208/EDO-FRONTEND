import { Target, TrendingUp, AlertTriangle } from 'lucide-react'
import Card from '../shared/Card'
import MathFormula, { MathBlock } from '../shared/MathFormula'

/**
 * Página: Método de Euler
 */
export default function EulerMethod() {
  return (
    <div className="space-y-8">
      {/* Introducción */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Target className="w-8 h-8 text-orange-600" />
          Método de Euler
        </h2>
        <p className="text-lg text-gray-600">
          El método más simple y directo para resolver numéricamente ecuaciones diferenciales ordinarias.
          Desarrollado por Leonhard Euler en el siglo XVIII.
        </p>
      </div>

      {/* Idea intuitiva */}
      <Card title="La Idea Intuitiva">
        <div className="space-y-4">
          <p className="text-gray-700">
            Imagina que quieres seguir una curva pero solo conoces:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Tu posición inicial <MathFormula>{`(t_0, y_0)`}</MathFormula></li>
            <li>La dirección (pendiente) en cada punto mediante <MathFormula>{`f(t,y)`}</MathFormula></li>
          </ul>
          <p className="text-gray-700">
            El método de Euler avanza en <strong>pasos pequeños</strong> siguiendo la pendiente actual, 
            como caminar en línea recta por un tramo pequeño antes de recalcular la dirección.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-900">
              <strong>🎯 Analogía:</strong> Es como seguir direcciones GPS que te dicen "sigue recto" 
              cada ciertos metros, en lugar de tener el mapa completo de la ruta.
            </p>
          </div>
        </div>
      </Card>

      {/* Fórmula */}
      <Card title="Fórmula del Método de Euler">
        <p className="text-gray-700 mb-4">
          Dado el problema de valor inicial:
        </p>
        <MathBlock>
          <MathFormula block>
            {`\\begin{cases}
              \\frac{dy}{dt} = f(t, y) \\\\
              y(t_0) = y_0
            \\end{cases}`}
          </MathFormula>
        </MathBlock>
        
        <p className="text-gray-700 my-4">
          La fórmula de recurrencia de Euler es:
        </p>
        
        <MathBlock title="Fórmula de Euler">
          <MathFormula block>
            {`y_{n+1} = y_n + h \\cdot f(t_n, y_n)`}
          </MathFormula>
        </MathBlock>

        <div className="space-y-2 text-sm text-gray-600 mt-4">
          <p><strong>Donde:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><MathFormula>{`y_n`}</MathFormula> es la aproximación de <MathFormula>y</MathFormula> en el tiempo <MathFormula>{`t_n`}</MathFormula></li>
            <li><MathFormula>{`y_{n+1}`}</MathFormula> es la aproximación en el siguiente paso <MathFormula>{`t_{n+1} = t_n + h`}</MathFormula></li>
            <li><MathFormula>h</MathFormula> es el tamaño de paso (paso temporal)</li>
            <li><MathFormula>{`f(t_n, y_n)`}</MathFormula> es la pendiente (derivada) en el punto actual</li>
          </ul>
        </div>
      </Card>

      {/* Derivación */}
      <Card title="¿De Dónde Viene Esta Fórmula?">
        <div className="space-y-4">
          <p className="text-gray-700">
            La fórmula de Euler proviene de la <strong>aproximación de Taylor de primer orden</strong>:
          </p>
          
          <MathBlock>
            <MathFormula block>
              {`y(t + h) \\approx y(t) + h \\cdot y'(t) + O(h^2)`}
            </MathFormula>
          </MathBlock>

          <p className="text-gray-700">
            Como <MathFormula>{`y'(t) = f(t, y)`}</MathFormula>, y descartando términos de orden <MathFormula>{`h^2`}</MathFormula> 
            y superiores, obtenemos:
          </p>

          <MathBlock>
            <MathFormula block>
              {`y(t + h) \\approx y(t) + h \\cdot f(t, y(t))`}
            </MathFormula>
          </MathBlock>

          <p className="text-gray-700">
            Esta es exactamente la fórmula de Euler.
          </p>
        </div>
      </Card>

      {/* Algoritmo */}
      <Card title="Algoritmo Paso a Paso">
        <div className="space-y-4">
          <p className="text-gray-700 font-medium mb-3">
            Para resolver <MathFormula>{`\\frac{dy}{dt} = f(t,y)`}</MathFormula> con <MathFormula>{`y(t_0) = y_0`}</MathFormula> 
            desde <MathFormula>{`t_0`}</MathFormula> hasta <MathFormula>{`t_f`}</MathFormula>:
          </p>

          <ol className="space-y-3">
            {[
              { step: 1, text: "Definir el tamaño de paso", formula: "h = \\frac{t_f - t_0}{N}" },
              { step: 2, text: "Inicializar", formula: "t_0, y_0" },
              { step: 3, text: "Para cada paso n = 0, 1, 2, ..., N-1:", isLoop: true },
              { step: 4, text: "Calcular la pendiente", formula: "k = f(t_n, y_n)", indent: true },
              { step: 5, text: "Actualizar el valor", formula: "y_{n+1} = y_n + h \\cdot k", indent: true },
              { step: 6, text: "Avanzar el tiempo", formula: "t_{n+1} = t_n + h", indent: true },
            ].map((item) => (
              <li key={item.step} className={`flex gap-3 ${item.indent ? 'ml-8' : ''}`}>
                <span className={`font-bold ${item.isLoop ? 'text-blue-600' : 'text-orange-600'}`}>
                  {item.step}.
                </span>
                <div className="flex-1">
                  <span className="text-gray-700">{item.text}</span>
                  {item.formula && (
                    <div className="mt-1">
                      <MathFormula>{item.formula}</MathFormula>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Card>

      {/* Ejemplo */}
      <Card title="Ejemplo Completo">
        <div className="space-y-4">
          <p className="text-gray-700">
            Resolvamos <MathFormula>{`\\frac{dy}{dt} = y`}</MathFormula> con <MathFormula>{`y(0) = 1`}</MathFormula>, 
            usando <MathFormula>{`h = 0.5`}</MathFormula> hasta <MathFormula>{`t = 1.5`}</MathFormula>:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-orange-100">
                <tr>
                  <th className="border border-orange-300 px-3 py-2">n</th>
                  <th className="border border-orange-300 px-3 py-2"><MathFormula>{`t_n`}</MathFormula></th>
                  <th className="border border-orange-300 px-3 py-2"><MathFormula>{`y_n`}</MathFormula></th>
                  <th className="border border-orange-300 px-3 py-2"><MathFormula>{`f(t_n, y_n)`}</MathFormula></th>
                  <th className="border border-orange-300 px-3 py-2"><MathFormula>{`y_{n+1}`}</MathFormula></th>
                  <th className="border border-orange-300 px-3 py-2">Exacta</th>
                  <th className="border border-orange-300 px-3 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 text-center">0</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.0</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.500</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-center">1</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.5</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.500</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.500</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">2.250</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.649</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-red-600">0.149</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 text-center">2</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.0</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">2.250</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">2.250</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">3.375</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">2.718</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-red-600">0.468</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-center">3</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.5</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">3.375</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">-</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">-</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">4.482</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-red-600">1.107</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600">
            Nota: La solución exacta es <MathFormula>{`y(t) = e^t`}</MathFormula>. 
            Observa cómo el error aumenta con cada paso.
          </p>
        </div>
      </Card>

      {/* Ventajas y desventajas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="✅ Ventajas">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span><strong>Simple:</strong> Fácil de entender e implementar</span>
            </li>
            <li className="flex gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span><strong>Eficiente:</strong> Solo 1 evaluación de f por paso</span>
            </li>
            <li className="flex gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span><strong>Intuitivo:</strong> Fácil de visualizar geométricamente</span>
            </li>
          </ul>
        </Card>

        <Card title="⚠️ Desventajas">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span><strong>Poco preciso:</strong> Error de orden <MathFormula>{`O(h^2)`}</MathFormula> por paso</span>
            </li>
            <li className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span><strong>Acumulación:</strong> El error global es <MathFormula>{`O(h)`}</MathFormula></span>
            </li>
            <li className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span><strong>Necesita h pequeño:</strong> Requiere muchos pasos para precisión</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Error */}
      <Card title="Análisis de Error">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Error Local (por paso):</h4>
            <MathFormula block>{`E_{local} = O(h^2)`}</MathFormula>
            <p className="text-sm text-gray-600">
              El error introducido en un solo paso es proporcional a <MathFormula>{`h^2`}</MathFormula>
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Error Global (acumulado):</h4>
            <MathFormula block>{`E_{global} = O(h)`}</MathFormula>
            <p className="text-sm text-gray-600">
              El error total después de N pasos es proporcional a <MathFormula>h</MathFormula>. 
              Si reduces h a la mitad, el error se reduce aproximadamente a la mitad.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Conclusión:</strong> Euler es de <strong>primer orden</strong>. Para mejorar 
              la precisión significativamente, necesitamos métodos de orden superior como RK4.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
