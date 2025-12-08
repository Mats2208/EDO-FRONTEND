import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { 
  Atom, 
  Leaf, 
  FlaskConical, 
  Cog, 
  TrendingUp, 
  Globe, 
  Cloud, 
  Users,
  ArrowRight 
} from 'lucide-react'
import Card from './Card'

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

export default function CategoryCard({ category }) {
  const IconComponent = iconMap[category.icon] || Atom

  return (
    <Link to={`/problems/${category.id}`}>
      <Card 
        padding="none" 
        className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
      >
        {/* Header con color de categoría */}
        <div className={`${category.color} p-6 text-white`}>
          <div className="flex items-start justify-between mb-3">
            <IconComponent size={40} className="opacity-90" strokeWidth={1.5} />
            <span className="px-3 py-1 bg-white bg-opacity-20 text-xs font-semibold rounded-full">
              {category.exampleProblems} ejemplos
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
          <p className="text-white text-opacity-90 text-sm">
            {category.shortDescription}
          </p>
        </div>

        {/* Cuerpo con descripción */}
        <div className="p-6">
          <p className="text-neutral-700 text-sm mb-4 leading-relaxed">
            {category.description}
          </p>

          {/* Lista de aplicaciones (mostrar solo 4) */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
              Aplicaciones incluidas
            </p>
            <ul className="space-y-1.5">
              {category.applications.slice(0, 4).map((app, idx) => (
                <li key={idx} className="text-sm text-neutral-600 flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
            {category.applications.length > 4 && (
              <p className="text-xs text-neutral-500 mt-2 italic">
                +{category.applications.length - 4} aplicaciones más
              </p>
            )}
          </div>

          {/* Botón de acción */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <span className="text-sm font-semibold text-primary">
              Explorar categoría
            </span>
            <ArrowRight size={20} className="text-primary" />
          </div>
        </div>
      </Card>
    </Link>
  )
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    applications: PropTypes.arrayOf(PropTypes.string).isRequired,
    exampleProblems: PropTypes.number.isRequired,
  }).isRequired,
}
