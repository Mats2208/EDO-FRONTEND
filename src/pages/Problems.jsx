import { BookOpen, Lightbulb, Target } from 'lucide-react'
import { applicationCategories } from '../data/applicationCategories'
import Card from '../components/shared/Card'
import CategoryCard from '../components/shared/CategoryCard'

export default function Problems() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-neutral-800">
          Hub de Aplicaciones EDO
        </h1>
        <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
          Explora las aplicaciones de las Ecuaciones Diferenciales Ordinarias resueltas 
          con el método Runge-Kutta de cuarto orden en diferentes áreas del conocimiento.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="max-w-5xl mx-auto mb-12 grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">8</div>
          <div className="text-sm text-neutral-600 font-semibold uppercase tracking-wide">Categorías</div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-academic mb-2">50+</div>
          <div className="text-sm text-neutral-600 font-semibold uppercase tracking-wide">Aplicaciones</div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-success mb-2">25</div>
          <div className="text-sm text-neutral-600 font-semibold uppercase tracking-wide">Problemas de Ejemplo</div>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2 text-center">
          Explorar por Categoría
        </h2>
        <p className="text-center text-neutral-600 mb-8">
          Selecciona una categoría para ver problemas específicos y sus aplicaciones
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicationCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-start gap-3">
            <div className="bg-primary-lighter p-3 rounded-lg">
              <Target size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Casos Reales</h3>
              <p className="text-sm text-neutral-600">
                Cada categoría incluye problemas basados en aplicaciones del mundo real y casos de estudio verificados.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="bg-academic-lighter p-3 rounded-lg">
              <BookOpen size={24} className="text-academic" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Contexto Académico</h3>
              <p className="text-sm text-neutral-600">
                Problemas alineados con contenidos universitarios y referencias bibliográficas estándar.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="bg-success-lighter p-3 rounded-lg">
              <Lightbulb size={24} className="text-success" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-800 mb-2">Aprendizaje Progresivo</h3>
              <p className="text-sm text-neutral-600">
                Problemas organizados por dificultad: desde casos básicos hasta sistemas complejos avanzados.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Nota informativa */}
      <div className="max-w-5xl mx-auto mt-12">
        <Card className="bg-gradient-to-r from-primary-lighter to-academic-lighter border-primary">
          <h3 className="text-lg font-semibold mb-3 text-neutral-800">Sobre este hub</h3>
          <p className="text-neutral-700 leading-relaxed">
            Este hub organiza las aplicaciones de EDOs en categorías temáticas. Cada categoría contiene 
            múltiples problemas de ejemplo que ilustran cómo las ecuaciones diferenciales modelan fenómenos 
            reales en ciencia, ingeniería y otras disciplinas. Selecciona una categoría para explorar los 
            problemas disponibles y sus contextos de aplicación.
          </p>
        </Card>
      </div>
    </div>
  )
}
