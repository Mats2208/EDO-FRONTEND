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
    </div>
  )
}
