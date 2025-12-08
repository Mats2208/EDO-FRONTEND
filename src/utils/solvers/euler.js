/**
 * Método de Euler para resolver EDOs
 * 
 * @param {Function} f - Función f(t, y) de la EDO dy/dt = f(t, y)
 * @param {number} t0 - Tiempo inicial
 * @param {number} y0 - Condición inicial y(t0) = y0
 * @param {number} tf - Tiempo final
 * @param {number} h - Tamaño de paso
 * @returns {Object} { t: Array, y: Array, steps: number, evaluations: number }
 */
export function euler(f, t0, y0, tf, h) {
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
    
    // Fórmula de Euler: y_{n+1} = y_n + h * f(t_n, y_n)
    const slope = f(tn, yn)
    const yn_next = yn + h * slope
    
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
    evaluations: steps, // Euler hace 1 evaluación por paso
    method: 'Euler'
  }
}

/**
 * Método de Euler con información detallada paso a paso
 * Útil para análisis de error
 */
export function eulerDetailed(f, t0, y0, tf, h, exactSolution = null) {
  const results = []
  
  let tn = t0
  let yn = y0
  
  // Guardar punto inicial
  results.push({
    step: 0,
    t: tn,
    y: yn,
    slope: f(tn, yn),
    exact: exactSolution ? exactSolution(tn) : null,
    error: exactSolution ? Math.abs(yn - exactSolution(tn)) : null
  })
  
  let step = 1
  
  while (tn < tf) {
    if (tn + h > tf) {
      h = tf - tn
    }
    
    const slope = f(tn, yn)
    const yn_next = yn + h * slope
    
    tn += h
    yn = yn_next
    
    results.push({
      step,
      t: tn,
      y: yn,
      slope: f(tn, yn),
      exact: exactSolution ? exactSolution(tn) : null,
      error: exactSolution ? Math.abs(yn - exactSolution(tn)) : null
    })
    
    step++
  }
  
  return results
}

export default euler
