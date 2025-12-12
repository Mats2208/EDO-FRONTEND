import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Info, CheckCircle2, ArrowRight } from 'lucide-react'
import {
  Atom,
  Leaf,
  FlaskConical,
  Cog,
  TrendingUp,
  Globe,
  Cloud,
  Users
} from 'lucide-react'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { getCategoryById } from '../data/applicationCategories'
import { getProblemsByCategory } from '../data/categoryProblems'
import Card from '../components/shared/Card'

// Mapeo de iconos
const iconMap = {
  Atom,
  Leaf,
  FlaskConical,
  Cog,
  TrendingUp,
  Globe,
  Cloud,
  Users,
}

// Componente de tarjeta de problema simplificado
function ProblemCard({ problem, category, categoryId }) {

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Básico':
        return 'bg-green-100 text-green-800'
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800'
      case 'Avanzado':
      case 'Muy Avanzado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link to={`/problems/${categoryId}/${problem.id}`}>
      <Card padding="none" className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
        {/* Header */}
        <div className={`${category.color} p-5 text-white`}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold leading-snug flex-1">{problem.name}</h3>
            {problem.hasExactSolution && (
              <div className="bg-white bg-opacity-20 px-2 py-1 rounded flex items-center gap-1" title="Tiene solución exacta">
                <CheckCircle2 size={16} />
                <span className="text-xs font-semibold">Exacta</span>
              </div>
            )}
          </div>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Ecuación con LaTeX */}
          <div className="mb-4">
            <p className="text-xs text-neutral-600 mb-2 font-semibold uppercase tracking-wide">Ecuación Diferencial:</p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="text-neutral-900">
                <InlineMath math={`\\frac{dy}{dx} = ${problem.equationLatex || problem.equation}`} />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm text-neutral-700 mb-4 line-clamp-2">
            {problem.description}
          </p>

          {/* Parámetros */}
          <div className="mb-4">
            <p className="text-xs text-neutral-600 mb-2 font-semibold">Parámetros Iniciales:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-neutral-100 text-xs rounded font-mono">
                x₀ = {problem.parameters.t0}
              </span>
              <span className="px-2 py-1 bg-neutral-100 text-xs rounded font-mono">
                y₀ = {problem.parameters.y0}
              </span>
              <span className="px-2 py-1 bg-neutral-100 text-xs rounded font-mono">
                x_f = {problem.parameters.tf}
              </span>
              <span className="px-2 py-1 bg-neutral-100 text-xs rounded font-mono">
                h = {problem.parameters.h}
              </span>
            </div>
          </div>

          {/* Botón */}
          <div className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-between px-4 ${category.color} text-white hover:opacity-90`}>
            <div className="flex items-center gap-2">
              <Play size={20} />
              <span>Simular y Ver Teoría</span>
            </div>
            <ArrowRight size={20} />
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default function CategoryProblems() {
  const { categoryId } = useParams()
  const category = getCategoryById(categoryId)
  const problems = getProblemsByCategory(categoryId)

  // Si no existe la categoría
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Categoría no encontrada</h2>
          <p className="text-neutral-600 mb-6">La categoría que buscas no existe.</p>
          <Link to="/problems" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-colors rounded-lg">
            <ArrowLeft size={20} />
            Volver al Hub
          </Link>
        </Card>
      </div>
    )
  }

  const IconComponent = iconMap[category.icon] || Atom

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link
          to="/problems"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Volver al Hub de Problemas
        </Link>
      </div>

      {/* Header de categoría */}
      <div className="max-w-7xl mx-auto mb-8">
        <Card padding="none" className="overflow-hidden shadow-xl">
          <div className={`${category.color} p-8 text-white`}>
            <div className="flex items-start gap-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <IconComponent size={48} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
                <p className="text-lg text-white text-opacity-90 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full font-semibold">
                    {problems.length} problemas interactivos
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full font-semibold">
                    Simulación en tiempo real
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid de problemas */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Problemas Disponibles</h2>
          <div className="text-sm text-neutral-600">
            Click en "Simular Ahora" para ver resultados
          </div>
        </div>

        {problems.length === 0 ? (
          <Card className="text-center py-12">
            <Play size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 text-lg mb-2">No hay problemas disponibles</p>
            <p className="text-neutral-500 text-sm">Esta categoría está en desarrollo.</p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                category={category}
                categoryId={categoryId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="max-w-7xl mx-auto mt-12">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Cómo usar esta página</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Cada problema se simula automáticamente con los métodos de Euler y Runge-Kutta 4</li>
                <li>• Si existe solución exacta, se calculará y mostrará en el gráfico</li>
                <li>• Puedes ver métricas de error y comparación entre métodos</li>
                <li>• Los problemas están ordenados por dificultad</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
