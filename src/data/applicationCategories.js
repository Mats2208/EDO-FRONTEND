/**
 * Categorías de aplicaciones de EDOs con RK4
 * Hub organizado por áreas de aplicación
 */

export const applicationCategories = [
  {
    id: 'physics',
    name: 'Física',
    shortDescription: 'Mecánica clásica, oscilaciones, termodinámica',
    description: 'Estudio de sistemas físicos fundamentales: movimiento de partículas, osciladores armónicos, sistemas de amortiguamiento, transferencia de calor, y fenómenos ondulatorios.',
    icon: 'Atom',
    color: 'bg-primary',
    applications: [
      'Movimiento de proyectiles',
      'Osciladores armónicos',
      'Sistemas masa-resorte',
      'Péndulos simples y compuestos',
      'Caída libre con resistencia del aire',
      'Ley de enfriamiento de Newton',
      'Circuitos RLC',
    ],
    exampleProblems: 3,
  },
  {
    id: 'biology',
    name: 'Biología',
    shortDescription: 'Dinámica poblacional, epidemiología, ecosistemas',
    description: 'Modelado de poblaciones biológicas, crecimiento de especies, interacciones predador-presa, propagación de enfermedades, y dinámicas ecológicas complejas.',
    icon: 'Leaf',
    color: 'bg-success',
    applications: [
      'Crecimiento poblacional logístico',
      'Modelos predador-presa (Lotka-Volterra)',
      'Propagación de epidemias (SIR, SEIR)',
      'Competencia entre especies',
      'Dinámica de recursos renovables',
      'Cinética enzimática',
      'Farmacología y concentración de fármacos',
    ],
    exampleProblems: 4,
  },
  {
    id: 'chemistry',
    name: 'Química',
    shortDescription: 'Cinética de reacciones, equilibrios químicos',
    description: 'Análisis de velocidades de reacción, mecanismos de reacción complejos, sistemas catalíticos, equilibrios dinámicos, y procesos de difusión molecular.',
    icon: 'FlaskConical',
    color: 'bg-academic',
    applications: [
      'Reacciones de primer orden',
      'Reacciones de segundo orden',
      'Cadenas de reacciones consecutivas',
      'Equilibrio químico dinámico',
      'Catálisis enzimática',
      'Procesos de difusión',
      'Cinética de polimerización',
    ],
    exampleProblems: 3,
  },
  {
    id: 'engineering',
    name: 'Ingeniería',
    shortDescription: 'Sistemas de control, circuitos, estructuras',
    description: 'Diseño y análisis de sistemas de control automático, respuesta dinámica de circuitos eléctricos, análisis de vibraciones en estructuras, y comportamiento de sistemas mecánicos.',
    icon: 'Cog',
    color: 'bg-warning',
    applications: [
      'Sistemas de control PID',
      'Circuitos eléctricos transitorios',
      'Análisis de vibraciones',
      'Sistemas hidráulicos',
      'Control de temperatura',
      'Sistemas de retroalimentación',
      'Reguladores de velocidad',
    ],
    exampleProblems: 3,
  },
  {
    id: 'economics',
    name: 'Economía',
    shortDescription: 'Crecimiento económico, mercados, finanzas',
    description: 'Modelado de crecimiento económico, dinámica de mercados, fluctuaciones financieras, políticas monetarias, y comportamiento de inversiones a lo largo del tiempo.',
    icon: 'TrendingUp',
    color: 'bg-primary',
    applications: [
      'Modelos de crecimiento económico',
      'Dinámica de oferta y demanda',
      'Valoración de opciones financieras',
      'Tasa de interés continuo',
      'Amortización de deudas',
      'Ciclos económicos',
      'Modelos de inversión',
    ],
    exampleProblems: 2,
  },
  {
    id: 'astronomy',
    name: 'Astronomía',
    shortDescription: 'Órbitas planetarias, dinámica celeste',
    description: 'Estudio de trayectorias orbitales, problema de los N cuerpos, mecánica celeste, dinámica de satélites, y predicción de posiciones astronómicas.',
    icon: 'Globe',
    color: 'bg-academic',
    applications: [
      'Órbitas planetarias (Kepler)',
      'Trayectorias de satélites',
      'Problema de los tres cuerpos',
      'Precesión orbital',
      'Encuentros gravitacionales',
      'Estabilidad de sistemas estelares',
      'Transferencias orbitales',
    ],
    exampleProblems: 2,
  },
  {
    id: 'climate',
    name: 'Clima y Meteorología',
    shortDescription: 'Modelos climáticos, predicción del tiempo',
    description: 'Simulación de patrones climáticos, predicción meteorológica, análisis de temperaturas globales, dinámica atmosférica, y modelado de cambio climático.',
    icon: 'Cloud',
    color: 'bg-success',
    applications: [
      'Modelos de temperatura atmosférica',
      'Dinámica de frentes meteorológicos',
      'Circulación oceánica',
      'Balance de energía terrestre',
      'Ciclo hidrológico',
      'Predicción de precipitaciones',
      'Modelos de cambio climático',
    ],
    exampleProblems: 2,
  },
  {
    id: 'social',
    name: 'Ciencias Sociales',
    shortDescription: 'Difusión de información, comportamiento social',
    description: 'Propagación de ideas y tendencias, adopción de tecnologías, difusión de innovaciones, dinámica de opiniones, y modelado de comportamientos colectivos.',
    icon: 'Users',
    color: 'bg-warning',
    applications: [
      'Difusión de innovaciones',
      'Propagación de rumores',
      'Adopción de tecnologías',
      'Modelos de contagio social',
      'Formación de opiniones',
      'Dinámica de redes sociales',
      'Comportamiento de masas',
    ],
    exampleProblems: 2,
  },
]

/**
 * Obtener categoría por ID
 */
export function getCategoryById(id) {
  return applicationCategories.find(cat => cat.id === id)
}

/**
 * Obtener categorías por color
 */
export function getCategoriesByColor(color) {
  return applicationCategories.filter(cat => cat.color === color)
}

export default applicationCategories
