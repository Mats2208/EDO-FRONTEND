/**
 * Problemas por categoría con ecuaciones ejecutables
 * Cada problema incluye ecuación, parámetros, y solución exacta cuando existe
 */

export const categoryProblems = {
  physics: [
    {
      id: 'newton_cooling',
      name: 'Ley de Enfriamiento de Newton',
      equation: '-0.2 * (y - 20)',
      equationLatex: '-0.2(y - 20)',
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Enfriamiento de un objeto hacia temperatura ambiente siguiendo una ley exponencial.',
      context: 'Un objeto a 100°C se enfría hacia temperatura ambiente (20°C). El coeficiente de enfriamiento k=0.2 determina la rapidez del proceso.',
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
      exactFormula: 'T(t) = T_{\\text{amb}} + (T_0 - T_{\\text{amb}}) e^{-kt}',
      theory: {
        origin: 'La Ley de Enfriamiento de Newton establece que la tasa de pérdida de calor de un cuerpo es proporcional a la diferencia entre su temperatura y la temperatura del ambiente circundante. Formulada por Isaac Newton en 1701, esta ley es fundamental en termodinámica y se aplica cuando la diferencia de temperatura no es muy grande.',
        derivation: [
          {
            text: 'La tasa de cambio de temperatura es proporcional a la diferencia de temperaturas:'
          },
          {
            latex: '\\frac{dT}{dt} = -k(T - T_{\\text{amb}})'
          },
          {
            text: 'Donde k > 0 es la constante de enfriamiento que depende de las propiedades del objeto y del medio.'
          },
          {
            text: 'Separando variables e integrando:'
          },
          {
            latex: '\\int \\frac{dT}{T - T_{\\text{amb}}} = -k \\int dt'
          },
          {
            latex: '\\ln|T - T_{\\text{amb}}| = -kt + C'
          },
          {
            text: 'Aplicando la condición inicial T(0) = T₀, obtenemos:'
          },
          {
            latex: 'T(t) = T_{\\text{amb}} + (T_0 - T_{\\text{amb}})e^{-kt}'
          }
        ],
        applications: [
          'Medicina forense: determinación del tiempo de muerte',
          'Industria alimentaria: enfriamiento de productos',
          'Ingeniería térmica: diseño de sistemas de refrigeración',
          'Meteorología: predicción de temperaturas',
          'Electrónica: enfriamiento de componentes'
        ]
      }
    },
    {
      id: 'free_fall_resistance',
      name: 'Caída Libre con Resistencia del Aire',
      equation: '9.8 - 0.5 * y',
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Velocidad de caída con resistencia del aire proporcional a la velocidad.',
      context: 'Un objeto cae bajo gravedad (g=9.8 m/s²) con resistencia del aire proporcional a la velocidad (k=0.5). La velocidad terminal es g/k = 19.6 m/s.',
      parameters: {
        t0: 0,
        y0: 0,
        tf: 10,
        h: 0.1,
      },
      exactSolution: (t, y0 = 0, t0 = 0) => {
        const g = 9.8
        const k = 0.5
        const vt = g / k // velocidad terminal
        return vt + (y0 - vt) * Math.exp(-k * (t - t0))
      },
      exactFormula: 'v(t) = v_t + (v_0 - v_t) \\cdot e^{-kt}, \\quad v_t = \\frac{g}{k}',
    },
    {
      id: 'rc_circuit',
      name: 'Circuito RC (Descarga de Capacitor)',
      equation: '-y / 5',
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Descarga de un capacitor a través de una resistencia.',
      context: 'Tensión en un capacitor que se descarga. La constante de tiempo τ=RC=5 determina la rapidez de descarga.',
      parameters: {
        t0: 0,
        y0: 12,
        tf: 25,
        h: 0.2,
      },
      exactSolution: (t, y0 = 12, t0 = 0) => {
        const tau = 5
        return y0 * Math.exp(-(t - t0) / tau)
      },
      exactFormula: 'V(t) = V_0 \\cdot e^{-t/\\tau}, \\quad \\tau = RC',
    },
  ],

  biology: [
    {
      id: 'logistic_growth',
      name: 'Crecimiento Logístico',
      equation: '0.5 * y * (1 - y/100)',
      equationLatex: '0.5y\\left(1 - \\frac{y}{100}\\right)',
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Modelo de crecimiento poblacional con capacidad de carga limitada del ecosistema.',
      context: 'Población con tasa de crecimiento r=0.5 y capacidad de carga K=100. Modela bacterias, peces en un lago, o cualquier población con recursos limitados.',
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
      exactFormula: 'P(t) = \\frac{K}{1 + \\left(\\frac{K-P_0}{P_0}\\right) e^{-rt}}',
      theory: {
        origin: 'El modelo logístico fue propuesto por Pierre François Verhulst en 1838 para modelar el crecimiento poblacional considerando la capacidad de carga del ambiente. A diferencia del crecimiento exponencial, este modelo incorpora un factor de inhibición que representa la competencia por recursos limitados.',
        derivation: [
          {
            text: 'Partiendo de la ecuación diferencial logística:'
          },
          {
            latex: '\\frac{dP}{dt} = rP\\left(1 - \\frac{P}{K}\\right)'
          },
          {
            text: 'Donde r es la tasa de crecimiento y K es la capacidad de carga del ecosistema.'
          },
          {
            text: 'Separando variables e integrando, obtenemos la solución analítica que describe cómo la población tiende asintóticamente hacia K.'
          }
        ],
        applications: [
          'Ecología: modelado de poblaciones animales',
          'Microbiología: crecimiento de cultivos bacterianos',
          'Epidemiología: propagación de enfermedades',
          'Economía: adopción de productos en el mercado',
          'Sociología: difusión de innovaciones'
        ]
      }
    },
    {
      id: 'exponential_growth',
      name: 'Crecimiento Exponencial (Bacteria)',
      equation: '0.3 * y',
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Crecimiento poblacional sin limitaciones de recursos.',
      context: 'Modelo simple de población de bacterias con tasa de crecimiento r=0.3 (30% por unidad de tiempo). Válido para fase inicial con recursos abundantes.',
      parameters: {
        t0: 0,
        y0: 100,
        tf: 10,
        h: 0.1,
      },
      exactSolution: (t, y0 = 100, t0 = 0) => {
        const r = 0.3
        return y0 * Math.exp(r * (t - t0))
      },
      exactFormula: 'P(t) = P_0 \\cdot e^{rt}',
    },
    {
      id: 'drug_elimination',
      name: 'Eliminación de Fármaco',
      equation: '-0.15 * y',
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Concentración de un fármaco en sangre que se elimina exponencialmente.',
      context: 'Farmacocinética de primer orden. El fármaco se elimina con constante k=0.15 (vida media ≈ 4.6 unidades de tiempo).',
      parameters: {
        t0: 0,
        y0: 50,
        tf: 20,
        h: 0.2,
      },
      exactSolution: (t, y0 = 50, t0 = 0) => {
        const k = 0.15
        return y0 * Math.exp(-k * (t - t0))
      },
      exactFormula: 'C(t) = C_0 \\cdot e^{-kt}',
    },
    {
      id: 'gompertz_growth',
      name: 'Crecimiento de Gompertz (Tumor)',
      equation: '-0.3 * y * log(y / 100)',
      difficulty: 'Avanzado',
      hasExactSolution: false,
      description: 'Modelo de crecimiento tumoral con tasa decreciente.',
      context: 'La tasa de crecimiento disminuye logarítmicamente. Común en tumores sólidos donde el crecimiento se desacelera con el tamaño.',
      parameters: {
        t0: 0,
        y0: 10,
        tf: 20,
        h: 0.1,
      },
    },
  ],

  chemistry: [
    {
      id: 'first_order_reaction',
      name: 'Reacción de Primer Orden',
      equation: '-0.25 * y',
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Descomposición química donde la velocidad depende linealmente de la concentración.',
      context: 'Reacción A → productos con constante k=0.25. Ejemplo: descomposición de peróxido de hidrógeno.',
      parameters: {
        t0: 0,
        y0: 1.0,
        tf: 15,
        h: 0.1,
      },
      exactSolution: (t, y0 = 1.0, t0 = 0) => {
        const k = 0.25
        return y0 * Math.exp(-k * (t - t0))
      },
      exactFormula: '[A](t) = [A]_0 \\cdot e^{-kt}',
    },
    {
      id: 'second_order_reaction',
      name: 'Reacción de Segundo Orden',
      equation: '-0.5 * y * y',
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Reacción donde dos moléculas de reactivo A se combinan: 2A → productos.',
      context: 'Cinética de segundo orden con k=0.5. Ejemplo: dimerización de NO₂.',
      parameters: {
        t0: 0,
        y0: 2.0,
        tf: 8,
        h: 0.1,
      },
      exactSolution: (t, y0 = 2.0, t0 = 0) => {
        const k = 0.5
        return y0 / (1 + k * y0 * (t - t0))
      },
      exactFormula: '[A](t) = \\frac{[A]_0}{1 + k[A]_0 t}',
    },
    {
      id: 'equilibrium_approach',
      name: 'Aproximación al Equilibrio',
      equation: '0.3 * (0.5 - y)',
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Sistema químico que se aproxima a una concentración de equilibrio.',
      context: 'Reacción reversible que tiende al equilibrio en [A]_eq = 0.5 con constante k=0.3.',
      parameters: {
        t0: 0,
        y0: 0.1,
        tf: 15,
        h: 0.1,
      },
      exactSolution: (t, y0 = 0.1, t0 = 0) => {
        const eq = 0.5
        const k = 0.3
        return eq + (y0 - eq) * Math.exp(-k * (t - t0))
      },
      exactFormula: '[A](t) = [A]_{eq} + ([A]_0 - [A]_{eq}) \\cdot e^{-kt}',
    },
  ],

  engineering: [
    {
      id: 'rl_circuit',
      name: 'Circuito RL (Crecimiento de Corriente)',
      equation: '(10 - y) / 2',
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Corriente en un circuito RL conectado a fuente de voltaje.',
      context: 'Circuito con V=10V, L=2H. La corriente crece hasta I_max = V/R.',
      parameters: {
        t0: 0,
        y0: 0,
        tf: 10,
        h: 0.1,
      },
      exactSolution: (t, y0 = 0, t0 = 0) => {
        const Imax = 10
        const tau = 2
        return Imax * (1 - Math.exp(-(t - t0) / tau))
      },
      exactFormula: 'I(t) = I_{max}(1 - e^{-t/\\tau}), \\quad \\tau = L/R',
    },
    {
      id: 'tank_drainage',
      name: 'Vaciado de Tanque',
      equation: '-0.1 * sqrt(y)',
      difficulty: 'Intermedio',
      hasExactSolution: false,
      description: 'Nivel de agua en un tanque que se vacía por gravedad (Ley de Torricelli).',
      context: 'La velocidad de salida es proporcional a √h. Constante k=0.1 depende del área del orificio.',
      parameters: {
        t0: 0,
        y0: 25,
        tf: 40,
        h: 0.2,
      },
    },
    {
      id: 'temperature_control',
      name: 'Sistema de Control de Temperatura',
      equation: '0.5 * (25 - y) - 0.1 * y',
      difficulty: 'Avanzado',
      hasExactSolution: true,
      description: 'Control de temperatura con calentamiento y pérdida de calor.',
      context: 'Habitación con calefacción que busca T_objetivo=25°C. Pérdida de calor proporcional a temperatura.',
      parameters: {
        t0: 0,
        y0: 10,
        tf: 20,
        h: 0.1,
      },
      exactSolution: (t, y0 = 10, t0 = 0) => {
        // Ecuación: y' = 0.5*(25-y) - 0.1*y = 12.5 - 0.6*y
        const a = 0.6
        const b = 12.5
        const eq = b / a // equilibrio
        return eq + (y0 - eq) * Math.exp(-a * (t - t0))
      },
      exactFormula: 'T(t) = T_{eq} + (T_0 - T_{eq}) \\cdot e^{-at}',
    },
  ],

  economics: [
    {
      id: 'compound_interest',
      name: 'Interés Compuesto Continuo',
      equation: '0.05 * y',
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Crecimiento de capital con interés compuesto continuo.',
      context: 'Inversión con tasa de interés anual r=5% (0.05). Modelo de capitalización continua.',
      parameters: {
        t0: 0,
        y0: 1000,
        tf: 20,
        h: 0.5,
      },
      exactSolution: (t, y0 = 1000, t0 = 0) => {
        const r = 0.05
        return y0 * Math.exp(r * (t - t0))
      },
      exactFormula: 'A(t) = A_0 \\cdot e^{rt}',
    },
    {
      id: 'loan_amortization',
      name: 'Amortización de Préstamo',
      equation: '0.06 * y - 500',
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Deuda con interés compuesto y pagos fijos mensuales.',
      context: 'Préstamo con interés mensual r=6% y pago fijo M=500. Si rD₀ < M, la deuda tiende a cero.',
      parameters: {
        t0: 0,
        y0: 5000,
        tf: 15,
        h: 0.1,
      },
      exactSolution: (t, y0 = 5000, t0 = 0) => {
        const r = 0.06
        const M = 500
        if (r === 0) return y0 - M * (t - t0)
        return (y0 - M / r) * Math.exp(r * (t - t0)) + M / r
      },
      exactFormula: 'D(t) = (D_0 - \\frac{M}{r}) e^{rt} + \\frac{M}{r}',
    },
  ],

  astronomy: [
    {
      id: 'orbital_velocity_decay',
      name: 'Decaimiento de Velocidad Orbital',
      equation: '-0.02 * y',
      difficulty: 'Intermedio',
      hasExactSolution: true,
      description: 'Pérdida de velocidad orbital por resistencia atmosférica.',
      context: 'Satélite en órbita baja pierde velocidad por fricción atmosférica con constante k=0.02.',
      parameters: {
        t0: 0,
        y0: 7.8,
        tf: 50,
        h: 0.5,
      },
      exactSolution: (t, y0 = 7.8, t0 = 0) => {
        const k = 0.02
        return y0 * Math.exp(-k * (t - t0))
      },
      exactFormula: 'v(t) = v_0 \\cdot e^{-kt}',
    },
    {
      id: 'stellar_cooling',
      name: 'Enfriamiento Estelar',
      equation: '-0.001 * (y - 3)',
      difficulty: 'Avanzado',
      hasExactSolution: true,
      description: 'Enfriamiento de una estrella enana blanca hacia temperatura de fondo cósmico.',
      context: 'Estrella que se enfría lentamente hacia T_fondo=3K. Constante k=0.001 (proceso muy lento).',
      parameters: {
        t0: 0,
        y0: 10000,
        tf: 5000,
        h: 50,
      },
      exactSolution: (t, y0 = 10000, t0 = 0) => {
        const Tfondo = 3
        const k = 0.001
        return Tfondo + (y0 - Tfondo) * Math.exp(-k * (t - t0))
      },
      exactFormula: 'T(t) = T_f + (T_0 - T_f) \\cdot e^{-kt}',
    },
  ],

  climate: [
    {
      id: 'greenhouse_effect',
      name: 'Efecto Invernadero Simplificado',
      equation: '0.05 * (15 - y) + 0.01 * t',
      difficulty: 'Avanzado',
      hasExactSolution: false,
      description: 'Temperatura global con enfriamiento natural y calentamiento antropogénico.',
      context: 'Modelo simplificado: tendencia al equilibrio natural (15°C) con forzamiento creciente por CO₂.',
      parameters: {
        t0: 0,
        y0: 14,
        tf: 100,
        h: 1,
      },
    },
    {
      id: 'ocean_temperature',
      name: 'Temperatura Oceánica',
      equation: '0.02 * (12 - y)',
      difficulty: 'Básico',
      hasExactSolution: true,
      description: 'Temperatura del océano que se equilibra con la atmósfera.',
      context: 'El océano intercambia calor con la atmósfera (T_atm=12°C) con constante k=0.02.',
      parameters: {
        t0: 0,
        y0: 8,
        tf: 150,
        h: 2,
      },
      exactSolution: (t, y0 = 8, t0 = 0) => {
        const Tatm = 12
        const k = 0.02
        return Tatm + (y0 - Tatm) * Math.exp(-k * (t - t0))
      },
      exactFormula: 'T(t) = T_{atm} + (T_0 - T_{atm}) \\cdot e^{-kt}',
    },
  ],

  social: [
    {
      id: 'innovation_diffusion',
      name: 'Difusión de Innovación (Bass)',
      equation: '(0.03 + 0.4 * y/1000) * (1000 - y)',
      difficulty: 'Avanzado',
      hasExactSolution: false,
      description: 'Adopción de tecnología con influencia externa e interna.',
      context: 'Modelo de Bass: p=0.03 (innovadores), q=0.4 (imitadores), N=1000 (mercado potencial).',
      parameters: {
        t0: 0,
        y0: 10,
        tf: 20,
        h: 0.1,
      },
    },
    {
      id: 'rumor_spread',
      name: 'Propagación de Rumor',
      equation: '0.002 * y * (500 - y)',
      difficulty: 'Intermedio',
      hasExactSolution: false,
      description: 'Difusión de información en una población finita.',
      context: 'Modelo logístico de rumor: k=0.002, población N=500. Similar a modelo SIS epidemiológico.',
      parameters: {
        t0: 0,
        y0: 5,
        tf: 15,
        h: 0.1,
      },
    },
  ],
}

/**
 * Obtener todos los problemas de una categoría
 */
export function getProblemsByCategory(categoryId) {
  return categoryProblems[categoryId] || []
}

/**
 * Obtener un problema específico por categoría e ID
 */
export function getProblemById(categoryId, problemId) {
  const problems = categoryProblems[categoryId] || []
  return problems.find(p => p.id === problemId)
}

/**
 * Obtener el total de problemas por categoría
 */
export function getProblemCount(categoryId) {
  return (categoryProblems[categoryId] || []).length
}

export default categoryProblems
