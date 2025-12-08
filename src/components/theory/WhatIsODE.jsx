import { BookOpen, TrendingUp, Zap } from 'lucide-react'
import Card from '../shared/Card'
import MathFormula, { MathBlock } from '../shared/MathFormula'

/**
 * Página: ¿Qué es una EDO?
 */
export default function WhatIsODE() {
  return (
    <div className="space-y-8">
      {/* Introducción */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          ¿Qué es una Ecuación Diferencial Ordinaria?
        </h2>
        <p className="text-lg text-gray-600">
          Una Ecuación Diferencial Ordinaria (EDO) es una ecuación matemática que relaciona 
          una función con sus derivadas. Son fundamentales para modelar fenómenos del mundo real.
        </p>
      </div>

      {/* Definición formal */}
      <Card title="Definición Formal">
        <p className="text-gray-700 mb-4">
          Una EDO de primer orden tiene la forma general:
        </p>
        <MathBlock>
          <MathFormula block>
            {`\\frac{dy}{dt} = f(t, y)`}
          </MathFormula>
        </MathBlock>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Donde:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><MathFormula>y</MathFormula> es la función incógnita (variable dependiente)</li>
            <li><MathFormula>t</MathFormula> es la variable independiente (típicamente el tiempo)</li>
            <li><MathFormula>{`\\frac{dy}{dt}`}</MathFormula> es la derivada de y respecto a t</li>
            <li><MathFormula>f(t, y)</MathFormula> es una función conocida</li>
          </ul>
        </div>
      </Card>

      {/* Ejemplos simples */}
      <Card title="Ejemplos Clásicos">
        <div className="space-y-6">
          {/* Ejemplo 1 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">
              1. Crecimiento Exponencial
            </h4>
            <MathFormula block>
              {`\\frac{dy}{dt} = y`}
            </MathFormula>
            <p className="text-sm text-green-800 mt-2">
              <strong>Interpretación:</strong> La tasa de cambio de y es proporcional a y mismo. 
              Modela crecimiento poblacional sin límites, interés compuesto, o reacciones químicas.
            </p>
            <p className="text-sm text-green-700 mt-2">
              <strong>Solución exacta:</strong> <MathFormula>{`y(t) = y_0 e^t`}</MathFormula>
            </p>
          </div>

          {/* Ejemplo 2 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              2. Decaimiento Exponencial
            </h4>
            <MathFormula block>
              {`\\frac{dy}{dt} = -y`}
            </MathFormula>
            <p className="text-sm text-blue-800 mt-2">
              <strong>Interpretación:</strong> La tasa de cambio es negativa y proporcional a y. 
              Modela desintegración radiactiva, descarga de un capacitor, enfriamiento.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              <strong>Solución exacta:</strong> <MathFormula>{`y(t) = y_0 e^{-t}`}</MathFormula>
            </p>
          </div>

          {/* Ejemplo 3 */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">
              3. Ley de Enfriamiento de Newton
            </h4>
            <MathFormula block>
              {`\\frac{dT}{dt} = -k(T - T_{amb})`}
            </MathFormula>
            <p className="text-sm text-orange-800 mt-2">
              <strong>Interpretación:</strong> Un objeto se enfría a una tasa proporcional a la 
              diferencia entre su temperatura y la temperatura ambiente.
            </p>
            <p className="text-sm text-orange-700 mt-2">
              <strong>Solución exacta:</strong> <MathFormula>{`T(t) = T_{amb} + (T_0 - T_{amb})e^{-kt}`}</MathFormula>
            </p>
          </div>
        </div>
      </Card>

      {/* Aplicaciones */}
      <Card title="Aplicaciones en el Mundo Real">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 p-3 bg-purple-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-purple-900">Biología</h4>
              <p className="text-sm text-purple-800">
                Crecimiento poblacional, propagación de epidemias, farmacocinética
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
            <Zap className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900">Física</h4>
              <p className="text-sm text-blue-800">
                Movimiento de partículas, circuitos eléctricos, transferencia de calor
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-900">Economía</h4>
              <p className="text-sm text-green-800">
                Modelos de crecimiento económico, dinámicas de mercado
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-red-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900">Ingeniería</h4>
              <p className="text-sm text-red-800">
                Sistemas de control, dinámica de fluidos, análisis estructural
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Por qué métodos numéricos */}
      <Card title="¿Por qué Métodos Numéricos?">
        <div className="space-y-4">
          <p className="text-gray-700">
            Muchas EDOs <strong>no tienen solución analítica exacta</strong> que pueda expresarse 
            con funciones elementales. Por ejemplo:
          </p>
          <MathBlock>
            <MathFormula block>
              {`\\frac{dy}{dt} = y^2 + t^2`}
            </MathFormula>
          </MathBlock>
          <p className="text-gray-700">
            Esta ecuación simple no tiene solución cerrada. En estos casos, usamos 
            <strong> métodos numéricos</strong> para aproximar la solución.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-900">
              <strong>💡 Idea clave:</strong> Los métodos numéricos como Euler y RK4 nos permiten 
              aproximar la solución de EDOs sin necesidad de encontrar una fórmula exacta, 
              calculando valores punto por punto.
            </p>
          </div>
        </div>
      </Card>

      {/* Problema de valor inicial */}
      <Card title="Problema de Valor Inicial (PVI)">
        <p className="text-gray-700 mb-4">
          Para resolver una EDO de primer orden, necesitamos una <strong>condición inicial</strong>:
        </p>
        <MathBlock>
          <MathFormula block>
            {`\\begin{cases}
              \\frac{dy}{dt} = f(t, y) \\\\
              y(t_0) = y_0
            \\end{cases}`}
          </MathFormula>
        </MathBlock>
        <p className="text-gray-700 mt-4">
          Esto garantiza una solución única. Sin la condición inicial, habría infinitas soluciones posibles.
        </p>
      </Card>

      {/* Clasificación de EDOs */}
      <Card title="Clasificación de las EDOs">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Por Orden:</h4>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-blue-900 mb-1">Primera Orden</h5>
                    <div className="mb-2">
                      <MathFormula>{`\\frac{dy}{dt} = f(t, y)`}</MathFormula>
                    </div>
                    <p className="text-sm text-blue-800">
                      Solo contiene la primera derivada. Ejemplos: crecimiento poblacional, decaimiento radiactivo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-purple-900 mb-1">Segunda Orden</h5>
                    <div className="mb-2">
                      <MathFormula>{`\\frac{d^2y}{dt^2} = f(t, y, \\frac{dy}{dt})`}</MathFormula>
                    </div>
                    <p className="text-sm text-purple-800">
                      Contiene la segunda derivada. Ejemplos: movimiento armónico, vigas en ingeniería, circuitos RLC.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">n</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">Orden Superior (n)</h5>
                    <div className="mb-2">
                      <MathFormula>{`\\frac{d^ny}{dt^n} = f(t, y, y', y'', ..., y^{(n-1)})`}</MathFormula>
                    </div>
                    <p className="text-sm text-gray-700">
                      Contiene derivadas de orden n. Menos comunes pero importantes en sistemas complejos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Por Linealidad:</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2">Lineales</h5>
                <div className="mb-2">
                  <MathFormula block>{`\\frac{dy}{dt} + p(t)y = q(t)`}</MathFormula>
                </div>
                <p className="text-sm text-green-800">
                  La función y y sus derivadas aparecen de forma lineal (sin productos ni potencias).
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-semibold text-red-900 mb-2">No Lineales</h5>
                <div className="mb-2">
                  <MathFormula block>{`\\frac{dy}{dt} = y^2 + \\sin(y)`}</MathFormula>
                </div>
                <p className="text-sm text-red-800">
                  Contienen productos, potencias o funciones no lineales de y. Generalmente más difíciles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Teorema de existencia y unicidad */}
      <Card title="Teorema de Existencia y Unicidad">
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Teorema (Picard-Lindelöf)</h4>
            <p className="text-sm text-blue-800 mb-3">
              Si <MathFormula>{`f(t, y)`}</MathFormula> y <MathFormula>{`\\frac{\\partial f}{\\partial y}`}</MathFormula> son continuas
              en una región que contiene el punto <MathFormula>{`(t_0, y_0)`}</MathFormula>, entonces existe una única
              solución al PVI en un intervalo alrededor de <MathFormula>{`t_0`}</MathFormula>.
            </p>
          </div>

          <p className="text-gray-700">
            Este teorema es fundamental porque nos garantiza que:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>El problema tiene solución (existencia)</li>
            <li>La solución es única (unicidad)</li>
            <li>Podemos confiar en métodos numéricos para aproximarla</li>
          </ul>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              <strong>Ejemplo:</strong> Para <MathFormula>{`\\frac{dy}{dt} = y, y(0) = 1`}</MathFormula>,
              las condiciones se cumplen y sabemos que existe una única solución: <MathFormula>{`y = e^t`}</MathFormula>
            </p>
          </div>
        </div>
      </Card>

      {/* Historia */}
      <Card title="Contexto Histórico">
        <div className="space-y-4">
          <p className="text-gray-700">
            Las ecuaciones diferenciales surgieron naturalmente del desarrollo del cálculo en el siglo XVII:
          </p>

          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="bg-primary text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">1675</div>
              <div>
                <h5 className="font-semibold text-gray-900">Isaac Newton y Gottfried Leibniz</h5>
                <p className="text-sm text-gray-600">
                  Desarrollan el cálculo diferencial. Newton las usa para describir movimiento planetario
                  en su obra <em>Principia Mathematica</em>.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="bg-primary text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">1736</div>
              <div>
                <h5 className="font-semibold text-gray-900">Leonhard Euler</h5>
                <p className="text-sm text-gray-600">
                  Desarrolla el método de Euler, el primer método numérico para EDOs. También introduce
                  la notación moderna <MathFormula>{`y'`}</MathFormula>.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="bg-primary text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">1895</div>
              <div>
                <h5 className="font-semibold text-gray-900">Carl Runge y Wilhelm Kutta</h5>
                <p className="text-sm text-gray-600">
                  Desarrollan métodos de orden superior, culminando en el método RK4, que sigue siendo
                  uno de los más usados en la actualidad.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="bg-primary text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">Hoy</div>
              <div>
                <h5 className="font-semibold text-gray-900">Era Computacional</h5>
                <p className="text-sm text-gray-600">
                  Los métodos numéricos son esenciales en simulaciones: desde predicción del clima hasta
                  diseño de cohetes, análisis financiero y modelos epidemiológicos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Campo de direcciones */}
      <Card title="Visualización: Campos de Direcciones">
        <div className="space-y-4">
          <p className="text-gray-700">
            Una forma intuitiva de visualizar una EDO es mediante un <strong>campo de direcciones</strong>
            (o campo de pendientes):
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h5 className="font-semibold text-purple-900 mb-2">¿Qué es un campo de direcciones?</h5>
            <p className="text-sm text-purple-800 mb-3">
              Para cada punto <MathFormula>{`(t, y)`}</MathFormula> en el plano, dibujamos una pequeña flecha
              con pendiente <MathFormula>{`f(t, y)`}</MathFormula>. Esto nos muestra la "dirección" que debe
              seguir la solución en cada punto.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 ml-4">
              <li>Cada flecha representa <MathFormula>{`\\frac{dy}{dt}`}</MathFormula> en ese punto</li>
              <li>La solución es una curva que sigue tangente a las flechas</li>
              <li>Diferentes condiciones iniciales generan diferentes curvas</li>
            </ul>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>💡 Analogía:</strong> Imagina un río donde cada flecha indica la dirección de la corriente.
              Si sueltas un bote en cualquier punto (condición inicial), seguirá el flujo del agua (la solución).
            </p>
          </div>

          <p className="text-xs text-gray-600 italic">
            Nota: En la sección "Visualización Interactiva" puedes ver gráficas de soluciones de diferentes EDOs.
          </p>
        </div>
      </Card>
    </div>
  )
}
