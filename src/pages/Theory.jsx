import { useState } from 'react'
import { BookOpen, Target, Rocket, Scale, LineChart } from 'lucide-react'
import WhatIsODE from '../components/theory/WhatIsODE'
import EulerMethod from '../components/theory/EulerMethod'
import RK4Method from '../components/theory/RK4Method'
import Comparison from '../components/theory/Comparison'
import InteractiveVisualization from '../components/theory/InteractiveVisualization'

export default function Theory() {
  const [activeSection, setActiveSection] = useState('what-is-ode')

  const sections = [
    {
      id: 'what-is-ode',
      title: '¿Qué es una EDO?',
      icon: BookOpen,
      color: 'blue',
      component: WhatIsODE
    },
    {
      id: 'euler',
      title: 'Método de Euler',
      icon: Target,
      color: 'orange',
      component: EulerMethod
    },
    {
      id: 'rk4',
      title: 'Método RK4',
      icon: Rocket,
      color: 'blue',
      component: RK4Method
    },
    {
      id: 'comparison',
      title: 'Comparación',
      icon: Scale,
      color: 'purple',
      component: Comparison
    },
    {
      id: 'visualization',
      title: 'Visualización Interactiva',
      icon: LineChart,
      color: 'green',
      component: InteractiveVisualization
    }
  ]

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || WhatIsODE

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-blue-600" />
          Teoría
        </h1>
        <p className="text-lg text-gray-600">
          Aprende los fundamentos de las ecuaciones diferenciales y los métodos numéricos para resolverlas.
        </p>
      </div>

      {/* Navegación por tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex gap-2 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap
                    ${isActive 
                      ? `border-${section.color}-600 text-${section.color}-700 font-semibold` 
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {section.title}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Contenido de la sección activa */}
      <div className="animate-fadeIn">
        <ActiveComponent />
      </div>
    </div>
  )
}
