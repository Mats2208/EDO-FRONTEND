import { Rocket, Zap, Award } from 'lucide-react'
import Card from '../shared/Card'
import MathFormula, { MathBlock } from '../shared/MathFormula'

/**
 * Página: Método Runge-Kutta de 4º Orden (RK4)
 */
export default function RK4Method() {
  return (
    <div className="space-y-8">
      {/* Introducción */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Rocket className="w-8 h-8 text-blue-600" />
          Método Runge-Kutta de 4º Orden (RK4)
        </h2>
        <p className="text-lg text-gray-600">
          El método RK4 es uno de los más utilizados para resolver EDOs debido a su excelente 
          balance entre precisión y costo computacional. Es significativamente más preciso que Euler.
        </p>
      </div>

      {/* Motivación */}
      <Card title="¿Por Qué RK4?">
        <div className="space-y-4">
          <p className="text-gray-700">
            El método de Euler es simple pero poco preciso. RK4 mejora dramáticamente la precisión 
            al evaluar la pendiente en <strong>múltiples puntos intermedios</strong> del paso, 
            no solo al inicio.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>🎯 Idea clave:</strong> En lugar de seguir una única dirección durante todo el paso, 
              RK4 "mira adelante" evaluando la pendiente en 4 puntos estratégicos y hace un promedio ponderado.
            </p>
          </div>

          <p className="text-gray-700">
            Esto resulta en un método de <strong>cuarto orden</strong>, donde el error es proporcional a 
            <MathFormula>{`h^5`}</MathFormula> por paso, en lugar de <MathFormula>{`h^2`}</MathFormula> como en Euler.
          </p>
        </div>
      </Card>

      {/* Fórmulas */}
      <Card title="Fórmulas del Método RK4">
        <p className="text-gray-700 mb-4">
          El método RK4 calcula 4 coeficientes (pendientes) en cada paso:
        </p>

        <MathBlock title="Los 4 Coeficientes">
          <div className="space-y-3">
            <MathFormula block>
              {`k_1 = f(t_n, y_n)`}
            </MathFormula>
            <MathFormula block>
              {`k_2 = f\\left(t_n + \\frac{h}{2}, y_n + \\frac{h}{2}k_1\\right)`}
            </MathFormula>
            <MathFormula block>
              {`k_3 = f\\left(t_n + \\frac{h}{2}, y_n + \\frac{h}{2}k_2\\right)`}
            </MathFormula>
            <MathFormula block>
              {`k_4 = f(t_n + h, y_n + hk_3)`}
            </MathFormula>
          </div>
        </MathBlock>

        <p className="text-gray-700 my-4">
          Luego, se combinan con un promedio ponderado:
        </p>

        <MathBlock title="Actualización del Valor">
          <MathFormula block>
            {`y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)`}
          </MathFormula>
        </MathBlock>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p><strong>Interpretación de los coeficientes:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><MathFormula>{`k_1`}</MathFormula>: Pendiente al inicio del paso</li>
            <li><MathFormula>{`k_2`}</MathFormula>: Pendiente en el punto medio, usando <MathFormula>{`k_1`}</MathFormula> para estimar</li>
            <li><MathFormula>{`k_3`}</MathFormula>: Pendiente en el punto medio, usando <MathFormula>{`k_2`}</MathFormula> (mejor estimación)</li>
            <li><MathFormula>{`k_4`}</MathFormula>: Pendiente al final del paso, usando <MathFormula>{`k_3`}</MathFormula></li>
          </ul>
          <p className="mt-3">
            <strong>Ponderación:</strong> <MathFormula>{`k_2`}</MathFormula> y <MathFormula>{`k_3`}</MathFormula> tienen peso doble 
            porque son estimaciones en el punto medio, que son más representativas.
          </p>
        </div>
      </Card>

      {/* Visualización de los k's */}
      <Card title="Visualización de los 4 Coeficientes">
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            Imagina un paso de <MathFormula>{`t_n`}</MathFormula> a <MathFormula>{`t_{n+1}`}</MathFormula>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <h4 className="font-semibold text-red-900 mb-2">
                <MathFormula>{`k_1`}</MathFormula>: Pendiente inicial
              </h4>
              <p className="text-sm text-red-800">
                Evaluada en <MathFormula>{`(t_n, y_n)`}</MathFormula>
              </p>
              <p className="text-xs text-red-700 mt-1">
                Es como Euler: usamos la pendiente al inicio
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                <MathFormula>{`k_2`}</MathFormula>: Primera corrección
              </h4>
              <p className="text-sm text-yellow-800">
                Evaluada en el punto medio usando <MathFormula>{`k_1`}</MathFormula>
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Miramos hacia el centro del paso
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <h4 className="font-semibold text-green-900 mb-2">
                <MathFormula>{`k_3`}</MathFormula>: Segunda corrección
              </h4>
              <p className="text-sm text-green-800">
                Evaluada en el punto medio usando <MathFormula>{`k_2`}</MathFormula> (mejor que <MathFormula>{`k_1`}</MathFormula>)
              </p>
              <p className="text-xs text-green-700 mt-1">
                Refinamos la estimación del centro
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                <MathFormula>{`k_4`}</MathFormula>: Pendiente final
              </h4>
              <p className="text-sm text-blue-800">
                Evaluada al final del paso usando <MathFormula>{`k_3`}</MathFormula>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Verificamos la dirección al final
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-purple-900">
              <strong>📊 Resultado:</strong> El promedio ponderado 
              <MathFormula>{` \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4) `}</MathFormula> 
              representa una estimación mucho más precisa de la pendiente promedio durante todo el paso.
            </p>
          </div>
        </div>
      </Card>

      {/* Algoritmo */}
      <Card title="Algoritmo Paso a Paso">
        <div className="space-y-4">
          <p className="text-gray-700 font-medium mb-3">
            Para resolver <MathFormula>{`\\frac{dy}{dt} = f(t,y)`}</MathFormula> con <MathFormula>{`y(t_0) = y_0`}</MathFormula>:
          </p>

          <ol className="space-y-3">
            {[
              { step: 1, text: "Inicializar", formula: "t_0, y_0, h" },
              { step: 2, text: "Para cada paso n = 0, 1, 2, ..., N-1:", isLoop: true },
              { step: 3, text: "Calcular", formula: "k_1 = f(t_n, y_n)", indent: true },
              { step: 4, text: "Calcular", formula: "k_2 = f(t_n + h/2, y_n + (h/2)k_1)", indent: true },
              { step: 5, text: "Calcular", formula: "k_3 = f(t_n + h/2, y_n + (h/2)k_2)", indent: true },
              { step: 6, text: "Calcular", formula: "k_4 = f(t_n + h, y_n + hk_3)", indent: true },
              { step: 7, text: "Actualizar", formula: "y_{n+1} = y_n + (h/6)(k_1 + 2k_2 + 2k_3 + k_4)", indent: true },
              { step: 8, text: "Avanzar", formula: "t_{n+1} = t_n + h", indent: true },
            ].map((item) => (
              <li key={item.step} className={`flex gap-3 ${item.indent ? 'ml-8' : ''}`}>
                <span className={`font-bold ${item.isLoop ? 'text-blue-600' : 'text-blue-600'}`}>
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
      <Card title="Ejemplo: RK4 vs Euler">
        <div className="space-y-4">
          <p className="text-gray-700">
            Resolvamos el mismo problema: <MathFormula>{`\\frac{dy}{dt} = y`}</MathFormula> con <MathFormula>{`y(0) = 1`}</MathFormula>, 
            <MathFormula>{`h = 0.5`}</MathFormula>, hasta <MathFormula>{`t = 1.0`}</MathFormula>:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border border-blue-300 px-3 py-2">Paso</th>
                  <th className="border border-blue-300 px-3 py-2">t</th>
                  <th className="border border-blue-300 px-3 py-2">RK4</th>
                  <th className="border border-blue-300 px-3 py-2">Euler</th>
                  <th className="border border-blue-300 px-3 py-2">Exacta</th>
                  <th className="border border-blue-300 px-3 py-2">Error RK4</th>
                  <th className="border border-blue-300 px-3 py-2">Error Euler</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 text-center">0</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.0</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.0000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.0000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.0000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.0000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.0000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-center">1</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">0.5</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-blue-700">1.6484</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-orange-700">1.5000</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.6487</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-green-600">0.0003</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-red-600">0.1487</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 text-center">2</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">1.0</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-blue-700">2.7180</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-orange-700">2.2500</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">2.7183</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-green-600">0.0003</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-red-600">0.4683</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <strong>🎯 Observación:</strong> Con el mismo tamaño de paso <MathFormula>{`h = 0.5`}</MathFormula>, 
              RK4 tiene un error <strong>~450 veces menor</strong> que Euler en t = 1.0!
            </p>
          </div>
        </div>
      </Card>

      {/* Ventajas y desventajas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="✅ Ventajas">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span><strong>Muy preciso:</strong> Error de orden <MathFormula>{`O(h^5)`}</MathFormula> por paso</span>
            </li>
            <li className="flex gap-2">
              <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span><strong>Balance óptimo:</strong> 4× más caro que Euler, pero ~100× más preciso</span>
            </li>
            <li className="flex gap-2">
              <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span><strong>Ampliamente usado:</strong> Estándar en la industria</span>
            </li>
            <li className="flex gap-2">
              <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span><strong>Permite h mayor:</strong> Menos pasos para la misma precisión</span>
            </li>
          </ul>
        </Card>

        <Card title="⚠️ Consideraciones">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <span><strong>Más caro:</strong> 4 evaluaciones de f por paso</span>
            </li>
            <li className="flex gap-2">
              <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <span><strong>Más complejo:</strong> Implementación más elaborada</span>
            </li>
            <li className="flex gap-2">
              <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <span><strong>Memoria:</strong> Necesita almacenar 4 valores k</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Orden del método */}
      <Card title="¿Por Qué es de 4º Orden?">
        <div className="space-y-4">
          <p className="text-gray-700">
            El "orden" de un método se refiere a qué tan rápido decrece el error cuando reduces el tamaño de paso h:
          </p>

          <MathBlock title="Error del Método">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 w-32">Euler:</span>
                <MathFormula>{`E_{local} = O(h^2), \\quad E_{global} = O(h)`}</MathFormula>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-700 w-32">RK4:</span>
                <MathFormula>{`E_{local} = O(h^5), \\quad E_{global} = O(h^4)`}</MathFormula>
              </div>
            </div>
          </MathBlock>

          <p className="text-gray-700">
            Esto significa que si reduces <MathFormula>h</MathFormula> a la mitad:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Euler</h4>
              <p className="text-sm text-orange-800">
                El error se reduce a la <strong>mitad</strong> (<MathFormula>{`2^1 = 2`}</MathFormula>)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">RK4</h4>
              <p className="text-sm text-blue-800">
                El error se reduce <strong>16 veces</strong> (<MathFormula>{`2^4 = 16`}</MathFormula>)
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-purple-900">
              <strong>💡 En la práctica:</strong> RK4 te permite usar un h mucho mayor que Euler
              para obtener la misma precisión, lo que resulta en menos pasos totales y,
              frecuentemente, menor costo computacional total.
            </p>
          </div>
        </div>
      </Card>

      {/* Derivación intuitiva */}
      <Card title="¿De Dónde Vienen Estas Fórmulas?">
        <div className="space-y-4">
          <p className="text-gray-700">
            RK4 se deriva buscando coincidir con la <strong>expansión de Taylor</strong> hasta el término de orden <MathFormula>{`h^4`}</MathFormula>:
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Serie de Taylor</h4>
            <MathFormula block>{`y(t + h) = y(t) + hy'(t) + \\frac{h^2}{2}y''(t) + \\frac{h^3}{6}y'''(t) + \\frac{h^4}{24}y^{(4)}(t) + O(h^5)`}</MathFormula>
          </div>

          <p className="text-gray-700">
            RK4 combina las 4 evaluaciones de <MathFormula>{`f`}</MathFormula> para aproximar esta serie
            hasta el término <MathFormula>{`h^4`}</MathFormula> sin necesitar calcular derivadas de orden superior.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              <strong>✨ Magia matemática:</strong> Los coeficientes <MathFormula>{`\\frac{1}{6}(1, 2, 2, 1)`}</MathFormula> y
              las posiciones donde se evalúan los <MathFormula>{`k_i`}</MathFormula> están cuidadosamente
              elegidos para que el error de truncamiento sea exactamente <MathFormula>{`O(h^5)`}</MathFormula>.
            </p>
          </div>
        </div>
      </Card>

      {/* Familia Runge-Kutta */}
      <Card title="La Familia Runge-Kutta">
        <div className="space-y-4">
          <p className="text-gray-700">
            RK4 pertenece a una familia completa de métodos Runge-Kutta de diferentes órdenes:
          </p>

          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-600 text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">RK1</div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-1">Método de Euler</h5>
                  <p className="text-sm text-gray-700">1 evaluación, orden 1</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">RK2</div>
                <div className="flex-1">
                  <h5 className="font-semibold text-green-900 mb-1">Euler Mejorado / Método del Punto Medio</h5>
                  <p className="text-sm text-green-800">2 evaluaciones, orden 2</p>
                  <div className="text-xs text-green-700 mt-1">
                    Ejemplo: método de Heun, punto medio
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-600 text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">RK3</div>
                <div className="flex-1">
                  <h5 className="font-semibold text-yellow-900 mb-1">Runge-Kutta de 3er Orden</h5>
                  <p className="text-sm text-yellow-800">3 evaluaciones, orden 3</p>
                  <div className="text-xs text-yellow-700 mt-1">
                    Menos común, RK4 es más popular
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">RK4</div>
                <div className="flex-1">
                  <h5 className="font-semibold text-blue-900 mb-1">Runge-Kutta Clásico de 4º Orden ⭐</h5>
                  <p className="text-sm text-blue-800">4 evaluaciones, orden 4</p>
                  <div className="text-xs text-blue-700 mt-1">
                    El más popular: balance óptimo precisión/costo
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">RK45</div>
                <div className="flex-1">
                  <h5 className="font-semibold text-purple-900 mb-1">Métodos Adaptativos (Dormand-Prince, Fehlberg)</h5>
                  <p className="text-sm text-purple-800">6+ evaluaciones, ajusta h automáticamente</p>
                  <div className="text-xs text-purple-700 mt-1">
                    Usados en MATLAB, SciPy: ode45, solve_ivp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Aplicaciones del mundo real */}
      <Card title="Aplicaciones del Mundo Real">
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            RK4 es el caballo de batalla de la simulación numérica en ciencia e ingeniería:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h5 className="font-semibold text-blue-900 mb-2">🚀 Ingeniería Aeroespacial</h5>
              <p className="text-sm text-blue-800">
                Cálculo de trayectorias orbitales, control de actitud de satélites, reentrada atmosférica.
                La precisión de RK4 es crítica para misiones espaciales.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <h5 className="font-semibold text-green-900 mb-2">⚙️ Mecánica y Robótica</h5>
              <p className="text-sm text-green-800">
                Simulación de sistemas mecánicos, cinemática de robots, dinámica de vehículos.
                Permite simulaciones en tiempo real.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
              <h5 className="font-semibold text-purple-900 mb-2">⚡ Circuitos Eléctricos</h5>
              <p className="text-sm text-purple-800">
                Análisis de circuitos RLC, transitorios eléctricos, diseño de filtros.
                Fundamental en SPICE y simuladores de circuitos.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <h5 className="font-semibold text-red-900 mb-2">🧬 Biología y Medicina</h5>
              <p className="text-sm text-red-800">
                Modelos farmacocinéticos, dinámicas poblacionales, propagación de enfermedades (modelos SIR).
                Esencial en predicciones epidemiológicas.
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
              <h5 className="font-semibold text-orange-900 mb-2">🎮 Física de Videojuegos</h5>
              <p className="text-sm text-orange-800">
                Simulación de física en tiempo real, movimiento de proyectiles, colisiones.
                Balance entre precisión y rendimiento.
              </p>
            </div>

            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4">
              <h5 className="font-semibold text-cyan-900 mb-2">🌡️ Clima y Meteorología</h5>
              <p className="text-sm text-cyan-800">
                Modelos atmosféricos, predicción del tiempo, simulaciones oceanográficas.
                Parte de sistemas más complejos de predicción.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Implementación */}
      <Card title="Implementación en Pseudocódigo">
        <div className="space-y-4">
          <p className="text-gray-700">
            Implementación del método RK4:
          </p>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`function rk4(f, t0, y0, tf, N):
    h = (tf - t0) / N
    t = t0
    y = y0

    results = [(t, y)]

    for i = 1 to N:
        k1 = f(t, y)
        k2 = f(t + h/2, y + (h/2)*k1)
        k3 = f(t + h/2, y + (h/2)*k2)
        k4 = f(t + h, y + h*k3)

        y = y + (h/6) * (k1 + 2*k2 + 2*k3 + k4)
        t = t + h

        results.append((t, y))

    return results`}</pre>
          </div>

          <p className="text-sm text-gray-600">
            Nota cómo cada k usa el resultado anterior para refinar la estimación.
            Esta estructura en cascada es clave para la alta precisión de RK4.
          </p>
        </div>
      </Card>

      {/* Consejos prácticos */}
      <Card title="Consejos Prácticos para Usar RK4">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">✅ Mejores Prácticas:</h4>
            <ul className="space-y-2 text-sm text-green-800 ml-4">
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Empieza con un h moderado y reduce si es necesario</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Verifica la convergencia probando con h/2 y comparando</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Para problemas stiff, considera métodos implícitos</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Si la precisión es crítica, usa métodos adaptativos (RK45)</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Regla general para h:</h4>
            <p className="text-sm text-blue-800">
              Divide el intervalo en <strong>al menos 100 pasos</strong> para empezar.
              Si necesitas más precisión, duplica el número de pasos (h → h/2) hasta que
              los resultados no cambien significativamente.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              <strong>⚠️ Advertencia:</strong> RK4 no es milagroso. Para problemas muy rígidos
              (stiff problems) donde las soluciones tienen componentes que decaen muy rápido,
              se necesitan métodos especializados como métodos implícitos o LSODA.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
