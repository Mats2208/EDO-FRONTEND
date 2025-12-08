import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Calculator, Info } from 'lucide-react'
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
import { getCategoryById } from '../data/applicationCategories'
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

// Problemas de ejemplo mockup para cada categoría
const mockProblems = {
  physics: [
    {
      id: 'oscillator',
      name: 'Oscilador Armónico Amortiguado',
      equation: "y' = v, v' = -ky - γv",
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Sistema masa-resorte con amortiguamiento viscoso. Estudia el comportamiento oscilatorio con pérdida de energía.',
    },
    {
      id: 'projectile',
      name: 'Proyectil con Resistencia del Aire',
      equation: "x' = vₓ, y' = vᵧ, v' = -g - kv²",
      difficulty: 'Avanzado',
      hasExactSolution: false,
      description: 'Movimiento parabólico considerando la resistencia del aire proporcional al cuadrado de la velocidad.',
    },
    {
      id: 'newton_cooling',
      name: 'Ley de Enfriamiento de Newton',
      equation: "T' = -k(T - Tₐ)",
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Enfriamiento de un cuerpo hacia la temperatura ambiente siguiendo una ley exponencial.',
    },
  ],
  biology: [
    {
      id: 'logistic',
      name: 'Crecimiento Logístico',
      equation: "P' = rP(1 - P/K)",
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Modelo de crecimiento poblacional con capacidad de carga limitada del ecosistema.',
    },
    {
      id: 'lotka_volterra',
      name: 'Modelo Predador-Presa (Lotka-Volterra)',
      equation: "x' = αx - βxy, y' = δxy - γy",
      difficulty: 'Avanzado',
      hasExactSolution: false,
      description: 'Interacción dinámica entre dos especies: una presa y su predador.',
    },
    {
      id: 'sir_model',
      name: 'Modelo SIR de Epidemias',
      equation: "S' = -βSI, I' = βSI - γI, R' = γI",
      difficulty: 'Intermedio',
      hasExactSolution: false,
      description: 'Propagación de enfermedades infecciosas en una población (Susceptibles-Infectados-Recuperados).',
    },
    {
      id: 'enzyme_kinetics',
      name: 'Cinética Enzimática (Michaelis-Menten)',
      equation: "[P]' = Vₘₐₓ[S] / (Kₘ + [S])",
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Velocidad de formación de producto en una reacción catalizada por enzimas.',
    },
  ],
  chemistry: [
    {
      id: 'first_order',
      name: 'Reacción de Primer Orden',
      equation: "[A]' = -k[A]",
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Descomposición química donde la velocidad depende linealmente de la concentración.',
    },
    {
      id: 'second_order',
      name: 'Reacción de Segundo Orden',
      equation: "[A]' = -k[A]²",
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Reacción donde dos moléculas de reactivo A se combinan.',
    },
    {
      id: 'consecutive',
      name: 'Reacciones Consecutivas A→B→C',
      equation: "[A]' = -k₁[A], [B]' = k₁[A] - k₂[B]",
      difficulty: 'Avanzado',
      hasExactSolution: true,
      description: 'Cadena de reacciones donde el producto de una reacción es reactivo de la siguiente.',
    },
  ],
  engineering: [
    {
      id: 'rlc_circuit',
      name: 'Circuito RLC en Serie',
      equation: "I' = (V - RI - Q/C) / L",
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Análisis transitorio de un circuito con resistencia, inductancia y capacitancia.',
    },
    {
      id: 'pid_control',
      name: 'Sistema de Control PID',
      equation: "e' = r - y, u = Kₚe + Kᵢ∫e + Kₐde/dt",
      difficulty: 'Avanzado',
      hasExactSolution: false,
      description: 'Controlador proporcional-integral-derivativo para regulación automática.',
    },
    {
      id: 'vibration',
      name: 'Vibración de Viga Cantilever',
      equation: "y'' + 2ζωₙy' + ωₙ²y = F(t)/m",
      difficulty: 'Avanzado',
      hasExactSolution: false,
      description: 'Análisis de vibraciones en una estructura empotrada en un extremo.',
    },
  ],
  economics: [
    {
      id: 'solow',
      name: 'Modelo de Crecimiento de Solow',
      equation: "k' = sf(k) - (n + δ)k",
      difficulty: 'Intermedio',
      hasExactSolution: false,
      description: 'Capital por trabajador en función del ahorro, crecimiento poblacional y depreciación.',
    },
    {
      id: 'supply_demand',
      name: 'Dinámica de Oferta y Demanda',
      equation: "P' = α(D(P) - S(P))",
      difficulty: 'Básico',
      hasExactSolution: false,
      description: 'Ajuste de precio en un mercado según el exceso de demanda o oferta.',
    },
  ],
  astronomy: [
    {
      id: 'kepler_orbit',
      name: 'Órbita Kepleriana',
      equation: "r'' = -GM/r²",
      difficulty: 'Avanzado',
      hasExactSolution: true,
      description: 'Movimiento orbital de un cuerpo bajo fuerza gravitacional central.',
    },
    {
      id: 'three_body',
      name: 'Problema Restringido de Tres Cuerpos',
      equation: "Complejo (sistema acoplado)",
      difficulty: 'Muy Avanzado',
      hasExactSolution: false,
      description: 'Movimiento de un cuerpo de masa despreciable bajo la influencia de dos cuerpos masivos.',
    },
  ],
  climate: [
    {
      id: 'energy_balance',
      name: 'Balance de Energía Terrestre',
      equation: "T' = (Qₛ(1-α) - σT⁴) / C",
      difficulty: 'Intermedio',
      hasExactSolution: false,
      description: 'Temperatura global en función de radiación solar, albedo y emisión térmica.',
    },
    {
      id: 'atmospheric',
      name: 'Modelo Atmosférico Simplificado',
      equation: "T' = -k(T - Tₑₓₜ) + Q(t)",
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Temperatura atmosférica con calentamiento externo y transferencia de calor.',
    },
  ],
  social: [
    {
      id: 'bass_diffusion',
      name: 'Modelo de Difusión de Bass',
      equation: "A' = (p + qA/N)(N - A)",
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Adopción de innovaciones considerando influencia externa e interna.',
    },
    {
      id: 'rumor_spread',
      name: 'Propagación de Rumores',
      equation: "I' = βSI - γI",
      difficulty: 'Básico',
      hasExactSolution: false,
      description: 'Similar a modelos epidemiológicos aplicado a difusión de información.',
    },
  ],
}

export default function CategoryProblems() {
  const { categoryId } = useParams()
  const category = getCategoryById(categoryId)

  // Si no existe la categoría
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Categoría no encontrada</h2>
          <p className="text-neutral-600 mb-6">La categoría que buscas no existe.</p>
          <Link to="/problems" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-colors">
            <ArrowLeft size={20} />
            Volver al Hub
          </Link>
        </Card>
      </div>
    )
  }

  const IconComponent = iconMap[category.icon] || Atom
  const problems = mockProblems[categoryId] || []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link 
          to="/problems" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Volver al Hub de Problemas
        </Link>
      </div>

      {/* Header de categoría */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card padding="none" className="overflow-hidden">
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
                    {problems.length} problemas disponibles
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full font-semibold">
                    {category.applications.length} aplicaciones
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Información de aplicaciones */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card>
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Áreas de Aplicación</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {category.applications.map((app, idx) => (
              <div key={idx} className="flex items-start gap-3 text-neutral-700">
                <span className="text-primary mt-1">•</span>
                <span>{app}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Grid de problemas (MOCKUP) */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Problemas Disponibles</h2>
        
        {problems.length === 0 ? (
          <Card className="text-center py-12">
            <Calculator size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 text-lg mb-2">Contenido en desarrollo</p>
            <p className="text-neutral-500 text-sm">Los problemas para esta categoría estarán disponibles próximamente.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <Card key={problem.id} padding="none" className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className={`${category.color} p-4`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white leading-snug">{problem.name}</h3>
                    {problem.hasExactSolution && (
                      <div className="bg-white bg-opacity-20 p-1 rounded" title="Tiene solución exacta">
                        <BookOpen size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <span className="inline-block px-2 py-1 bg-white bg-opacity-20 text-xs text-white font-semibold rounded">
                    {problem.difficulty}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-xs text-neutral-600 mb-1 font-semibold">Ecuación:</p>
                    <div className="bg-neutral-100 p-2 rounded font-mono text-xs text-neutral-800 border border-neutral-200">
                      {problem.equation}
                    </div>
                  </div>

                  <p className="text-sm text-neutral-700 mb-4">
                    {problem.description}
                  </p>

                  {/* Botón mockup */}
                  <button 
                    className="w-full py-2 bg-neutral-200 text-neutral-500 cursor-not-allowed text-sm font-medium"
                    disabled
                  >
                    Próximamente disponible
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Nota informativa */}
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="bg-primary-lighter border-primary">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-primary-dark mb-2">Contenido en desarrollo</h3>
              <p className="text-neutral-700 text-sm">
                Esta sección está en construcción. Los problemas mostrados son ejemplos representativos. 
                La funcionalidad completa para resolver estos problemas estará disponible en futuras actualizaciones.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
