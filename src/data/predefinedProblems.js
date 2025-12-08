/**
 * Problemas predefinidos con EDOs comunes y sus soluciones exactas (si existen)
 */

export const predefinedProblems = [
  {
    id: 'exponential_growth',
    name: 'Crecimiento Exponencial',
    category: 'Básico',
    equation: 'y',
    description: 'El crecimiento exponencial más simple: dy/dt = y',
    context: 'Modela crecimiento poblacional sin límites, desintegración radiactiva, o interés compuesto continuo.',
    parameters: {
      t0: 0,
      y0: 1,
      tf: 3,
      h: 0.1,
    },
    exactSolution: (t, y0 = 1, t0 = 0) => y0 * Math.exp(t - t0),
    exactFormula: 'y(t) = y₀ · e^t',
  },
  
  {
    id: 'exponential_decay',
    name: 'Decaimiento Exponencial',
    category: 'Básico',
    equation: '-y',
    description: 'Decaimiento exponencial: dy/dt = -y',
    context: 'Modela desintegración radiactiva, descarga de capacitor, o enfriamiento básico.',
    parameters: {
      t0: 0,
      y0: 10,
      tf: 5,
      h: 0.1,
    },
    exactSolution: (t, y0 = 10, t0 = 0) => y0 * Math.exp(-(t - t0)),
    exactFormula: 'y(t) = y₀ · e^(-t)',
  },
  
  {
    id: 'logistic_growth',
    name: 'Crecimiento Logístico',
    category: 'Biología',
    equation: '0.5 * y * (1 - y/100)',
    description: 'Crecimiento poblacional con capacidad de carga limitada',
    context: 'Modela poblaciones con recursos limitados. Parámetros: r=0.5 (tasa de crecimiento), K=100 (capacidad de carga).',
    parameters: {
      t0: 0,
      y0: 10,
      tf: 15,
      h: 0.1,
    },
    exactSolution: (t, y0 = 10, t0 = 0) => {
      const K = 100
      const r = 0.5
      return K / (1 + ((K - y0) / y0) * Math.exp(-r * (t - t0)))
    },
    exactFormula: 'y(t) = K / (1 + ((K-y₀)/y₀) · e^(-rt))',
  },
  
  {
    id: 'newton_cooling',
    name: 'Ley de Enfriamiento de Newton',
    category: 'Física',
    equation: '-0.2 * (y - 20)',
    description: 'Enfriamiento de un objeto hacia temperatura ambiente',
    context: 'Un objeto a temperatura inicial y₀ se enfría hacia temperatura ambiente (20°C). k=0.2 es el coeficiente de enfriamiento.',
    parameters: {
      t0: 0,
      y0: 100,
      tf: 20,
      h: 0.2,
    },
    exactSolution: (t, y0 = 100, t0 = 0) => {
      const Tamb = 20
      const k = 0.2
      return Tamb + (y0 - Tamb) * Math.exp(-k * (t - t0))
    },
    exactFormula: 'y(t) = T_amb + (y₀ - T_amb) · e^(-kt)',
  },
  
  {
    id: 'simple_harmonic',
    name: 'Movimiento Armónico Simple (Simplificado)',
    category: 'Física',
    equation: '-y',
    description: 'Aproximación simple del oscilador armónico',
    context: 'Versión simplificada de un sistema masa-resorte o péndulo. La versión completa requiere ecuaciones de segundo orden.',
    parameters: {
      t0: 0,
      y0: 5,
      tf: 10,
      h: 0.05,
    },
    exactSolution: (t, y0 = 5, t0 = 0) => y0 * Math.exp(-(t - t0)),
    exactFormula: 'y(t) = y₀ · e^(-t)',
    note: 'Esta es una simplificación. El movimiento armónico real usa d²y/dt² = -ω²y',
  },
  
  {
    id: 'linear_growth',
    name: 'Crecimiento Lineal',
    category: 'Básico',
    equation: '2',
    description: 'Crecimiento constante: dy/dt = 2',
    context: 'Tasa de cambio constante. Ejemplo: llenado de un tanque a velocidad constante.',
    parameters: {
      t0: 0,
      y0: 0,
      tf: 10,
      h: 0.5,
    },
    exactSolution: (t, y0 = 0, t0 = 0) => y0 + 2 * (t - t0),
    exactFormula: 'y(t) = y₀ + 2t',
  },
  
  {
    id: 'nonlinear_1',
    name: 'EDO No Lineal Clásica',
    category: 'Avanzado',
    equation: 'y - t^2 + 1',
    description: 'Ecuación diferencial no lineal estándar',
    context: 'Problema clásico de EDO usado en textos. No tiene solución analítica simple.',
    parameters: {
      t0: 0,
      y0: 0.5,
      tf: 2,
      h: 0.1,
    },
    exactSolution: null, // No tiene solución analítica cerrada
    exactFormula: 'No disponible',
    note: 'Esta EDO no tiene solución analítica en términos de funciones elementales',
  },
  
  {
    id: 'time_dependent',
    name: 'Crecimiento Dependiente del Tiempo',
    category: 'Intermedio',
    equation: 't * y',
    description: 'Tasa de crecimiento proporcional al tiempo y al valor actual',
    context: 'Modela procesos donde la tasa de cambio aumenta con el tiempo.',
    parameters: {
      t0: 0,
      y0: 1,
      tf: 2,
      h: 0.05,
    },
    exactSolution: (t, y0 = 1, t0 = 0) => y0 * Math.exp((t*t - t0*t0) / 2),
    exactFormula: 'y(t) = y₀ · e^(t²/2)',
  },
  
  {
    id: 'competitive',
    name: 'Competencia entre Especies (Simplificado)',
    category: 'Biología',
    equation: 'y * (3 - y)',
    description: 'Modelo simple de competencia intraespecífica',
    context: 'Modela población con crecimiento limitado por competencia. El equilibrio está en y=3.',
    parameters: {
      t0: 0,
      y0: 0.5,
      tf: 5,
      h: 0.1,
    },
    exactSolution: null,
    exactFormula: 'No disponible',
    note: 'Similar al logístico pero con diferentes parámetros',
  },
]

/**
 * Obtener un problema por ID
 */
export function getProblemById(id) {
  return predefinedProblems.find(p => p.id === id)
}

/**
 * Obtener problemas por categoría
 */
export function getProblemsByCategory(category) {
  return predefinedProblems.filter(p => p.category === category)
}

/**
 * Obtener todas las categorías únicas
 */
export function getCategories() {
  return [...new Set(predefinedProblems.map(p => p.category))]
}

/**
 * Obtener solo problemas con solución exacta
 */
export function getProblemsWithExactSolution() {
  return predefinedProblems.filter(p => p.exactSolution !== null)
}

export default predefinedProblems
