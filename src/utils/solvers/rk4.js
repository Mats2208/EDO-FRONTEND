/**
 * Método de Runge-Kutta de 4º Orden (RK4) para resolver EDOs
 * 
 * @param {Function} f - Función f(t, y) de la EDO dy/dt = f(t, y)
 * @param {number} t0 - Tiempo inicial
 * @param {number} y0 - Condición inicial y(t0) = y0
 * @param {number} tf - Tiempo final
 * @param {number} h - Tamaño de paso
 * @returns {Object} { t: Array, y: Array, steps: number, evaluations: number }
 */
export function rk4(f, t0, y0, tf, h) {
  const t = [t0]
  const y = [y0]
  
  let tn = t0
  let yn = y0
  let steps = 0
  
  while (tn < tf) {
    // Prevenir sobrepaso del tiempo final
    if (tn + h > tf) {
      h = tf - tn
    }
    
    // Fórmula RK4: Calcular los 4 coeficientes
    const k1 = f(tn, yn)
    const k2 = f(tn + h/2, yn + (h/2) * k1)
    const k3 = f(tn + h/2, yn + (h/2) * k2)
    const k4 = f(tn + h, yn + h * k3)
    
    // Combinar con pesos 1, 2, 2, 1
    const yn_next = yn + (h / 6) * (k1 + 2*k2 + 2*k3 + k4)
    
    tn += h
    yn = yn_next
    
    t.push(tn)
    y.push(yn)
    steps++
  }
  
  return {
    t,
    y,
    steps,
    evaluations: steps * 4, // RK4 hace 4 evaluaciones por paso
    method: 'RK4'
  }
}

/**
 * Método RK4 con información detallada paso a paso
 * Útil para análisis de error y pedagogía
 */
export function rk4Detailed(f, t0, y0, tf, h, exactSolution = null) {
  const results = []
  
  let tn = t0
  let yn = y0
  
  // Guardar punto inicial
  results.push({
    step: 0,
    t: tn,
    y: yn,
    k1: f(tn, yn),
    k2: null,
    k3: null,
    k4: null,
    exact: exactSolution ? exactSolution(tn) : null,
    error: exactSolution ? Math.abs(yn - exactSolution(tn)) : null
  })
  
  let step = 1
  
  while (tn < tf) {
    if (tn + h > tf) {
      h = tf - tn
    }
    
    // Calcular los 4 coeficientes
    const k1 = f(tn, yn)
    const k2 = f(tn + h/2, yn + (h/2) * k1)
    const k3 = f(tn + h/2, yn + (h/2) * k2)
    const k4 = f(tn + h, yn + h * k3)
    
    const yn_next = yn + (h / 6) * (k1 + 2*k2 + 2*k3 + k4)
    
    tn += h
    yn = yn_next
    
    results.push({
      step,
      t: tn,
      y: yn,
      k1,
      k2,
      k3,
      k4,
      exact: exactSolution ? exactSolution(tn) : null,
      error: exactSolution ? Math.abs(yn - exactSolution(tn)) : null
    })
    
    step++
  }
  
  return results
}

export default rk4
