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

      {/* Interpretación Geométrica */}
      <Card title="Interpretación Geométrica">
        <div className="space-y-4">
          <p className="text-gray-700">
            El método de Euler tiene una interpretación geométrica muy clara:
          </p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
            <h4 className="font-semibold text-orange-900 mb-2">Aproximación por Rectas Tangentes</h4>
            <p className="text-sm text-orange-800 mb-3">
              En cada paso, Euler aproxima la curva solución con su <strong>recta tangente</strong>:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-orange-800 ml-4">
              <li>Empezamos en <MathFormula>{`(t_0, y_0)`}</MathFormula></li>
              <li>La pendiente en ese punto es <MathFormula>{`m = f(t_0, y_0)`}</MathFormula></li>
              <li>Seguimos la recta tangente <MathFormula>{`y = y_0 + m(t - t_0)`}</MathFormula> hasta <MathFormula>{`t_1 = t_0 + h`}</MathFormula></li>
              <li>Llegamos a <MathFormula>{`y_1 = y_0 + h \cdot m`}</MathFormula></li>
              <li>Repetimos desde <MathFormula>{`(t_1, y_1)`}</MathFormula></li>
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-900 mb-2">✓ Con h pequeño</h5>
              <p className="text-sm text-green-800">
                Las rectas tangentes siguen muy de cerca la curva real. Muchos pasos pequeños
                dan una buena aproximación.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-semibold text-red-900 mb-2">✗ Con h grande</h5>
              <p className="text-sm text-red-800">
                Las rectas tangentes se desvían rápidamente de la curva real. El error
                crece significativamente.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Estabilidad */}
      <Card title="Estabilidad Numérica">
        <div className="space-y-4">
          <p className="text-gray-700">
            Un aspecto crítico en métodos numéricos es la <strong>estabilidad</strong>:
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">¿Qué es la estabilidad?</h4>
            <p className="text-sm text-purple-800">
              Un método es estable si pequeños errores (de redondeo, por ejemplo) no crecen
              descontroladamente durante el cálculo.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Ejemplo: Ecuación de Prueba</h5>
            <p className="text-sm text-gray-700 mb-2">
              Consideremos <MathFormula>{`\\frac{dy}{dt} = \\lambda y`}</MathFormula> con <MathFormula>{`\\lambda < 0`}</MathFormula> (decaimiento):
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
              <p className="text-sm text-yellow-900 mb-2">
                <strong>Condición de estabilidad para Euler:</strong>
              </p>
              <MathFormula block>{`|1 + h\\lambda| \\leq 1`}</MathFormula>
              <p className="text-sm text-yellow-800 mt-2">
                Esto implica <MathFormula>{`h \\leq \\frac{2}{|\\lambda|}`}</MathFormula>
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Si h es demasiado grande, ¡el método puede volverse inestable y dar resultados
              que oscilan o crecen cuando deberían decrecer!
            </p>
          </div>
        </div>
      </Card>

      {/* Variantes del Método de Euler */}
      <Card title="Variantes del Método de Euler">
        <div className="space-y-4">
          <p className="text-gray-700">
            Existen mejoras al método básico de Euler:
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Euler Mejorado (Heun's Method)</h4>
              <div className="mb-3">
                <MathFormula block>{`\\begin{align*}
                  \\tilde{y}_{n+1} &= y_n + h \\cdot f(t_n, y_n) \\\\
                  y_{n+1} &= y_n + \\frac{h}{2}[f(t_n, y_n) + f(t_{n+1}, \\tilde{y}_{n+1})]
                \\end{align*}`}</MathFormula>
              </div>
              <p className="text-sm text-blue-800">
                Usa un paso de Euler para predecir, luego corrige usando el promedio de pendientes.
                Error de orden <MathFormula>{`O(h^2)`}</MathFormula>, mejor que Euler básico.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <h4 className="font-semibold text-green-900 mb-2">Euler Implícito (Backward Euler)</h4>
              <div className="mb-3">
                <MathFormula block>{`y_{n+1} = y_n + h \\cdot f(t_{n+1}, y_{n+1})`}</MathFormula>
              </div>
              <p className="text-sm text-green-800">
                Usa la pendiente en el punto siguiente (requiere resolver ecuación implícita).
                Más estable para problemas "stiff" (rígidos).
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Aplicaciones Prácticas */}
      <Card title="Cuándo Usar Euler">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">✅ Casos apropiados:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-green-800 ml-4">
              <li>Problemas educativos y demostrativos</li>
              <li>Soluciones rápidas y aproximadas cuando la precisión no es crítica</li>
              <li>Primera implementación para validar el problema</li>
              <li>Cuando f(t,y) es muy costosa de evaluar</li>
              <li>Intervalos muy pequeños donde h puede ser minúsculo</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">❌ Evitar Euler cuando:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-red-800 ml-4">
              <li>Se requiere alta precisión</li>
              <li>El intervalo de integración es grande</li>
              <li>La solución cambia rápidamente (alta frecuencia)</li>
              <li>El problema es "stiff" (múltiples escalas de tiempo)</li>
              <li>En aplicaciones de producción o simulaciones críticas</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Recomendación:</strong> Usa Euler para entender conceptos, luego
              migra a RK4 o métodos adaptativos para aplicaciones reales.
            </p>
          </div>
        </div>
      </Card>

      {/* Implementación en código */}
      <Card title="Implementación en Pseudocódigo">
        <div className="space-y-4">
          <p className="text-gray-700">
            Implementación simple del método de Euler:
          </p>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`function euler(f, t0, y0, tf, N):
    h = (tf - t0) / N
    t = t0
    y = y0

    results = [(t, y)]

    for i = 1 to N:
        y = y + h * f(t, y)
        t = t + h
        results.append((t, y))

    return results`}</pre>
          </div>

          <p className="text-sm text-gray-600">
            Esta implementación es simple y directa, ideal para entender el método.
            En la práctica se añaden verificaciones de error y optimizaciones.
          </p>
        </div>
      </Card>
    </div>
  )
}
