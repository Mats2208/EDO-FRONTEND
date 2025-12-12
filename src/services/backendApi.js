/**
 * Servicio de comunicación con el backend Python (FastAPI + SymPy)
 * Calcula soluciones exactas de EDOs
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * Convierte ecuación a formato SymPy
 * - Agrega multiplicación explícita (2x → 2*x)
 * - Reemplaza x por t
 * @param {string} equation - Ecuación en formato Math.js
 * @returns {string} Ecuación en formato SymPy
 */
function convertToSymPyFormat(equation) {
  let result = equation

  // Paso 1: Agregar multiplicación explícita antes de variables
  // 2x → 2*x, 3y → 3*y, etc.
  result = result.replace(/(\d)([a-zA-Z])/g, '$1*$2')

  // Paso 2: Agregar multiplicación entre paréntesis y variables
  // 2(x) → 2*(x), (x)y → (x)*y
  result = result.replace(/(\d)\(/g, '$1*(')
  result = result.replace(/\)([a-zA-Z])/g, ')*$1')

  // Paso 3: Agregar multiplicación entre variables consecutivas
  // xy → x*y (pero solo si no es parte de una función como sin, cos)
  result = result.replace(/([a-zA-Z])([a-zA-Z])/g, (match, p1, p2) => {
    // No separar funciones conocidas
    const functions = ['sin', 'cos', 'tan', 'exp', 'log', 'sqrt', 'abs']
    for (const fn of functions) {
      if (match === fn.slice(-2) || match === fn.slice(0, 2)) {
        return match
      }
    }
    return `${p1}*${p2}`
  })

  // Paso 4: Reemplazar x por t (el backend usa t)
  result = result.replace(/\bx\b/g, 't')

  return result
}

/**
 * Intenta obtener la solución exacta de una EDO usando el backend
 *
 * @param {string} equation - Ecuación en formato Math.js (ej: "y", "t*y", "sin(t) - y")
 * @param {number} t0 - Valor inicial
 * @param {number} y0 - Condición inicial
 * @param {number} tf - Valor final
 * @param {number} h - Tamaño de paso
 * @returns {Promise<Object>} Resultado con success, exact, solutionLatex, status
 */
export async function getExactSolution(equation, t0, y0, tf, h) {
  try {
    // Convertir ecuación a formato SymPy
    const backendEquation = convertToSymPyFormat(equation)

    // Log para debugging
    console.log('🔄 Conversión de ecuación:', {
      original: equation,
      convertida: backendEquation
    })

    const response = await fetch(`${BACKEND_URL}/api/v1/ode/analytic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        f: backendEquation,
        t0,
        y0,
        T: tf,
        h,
      }),
      signal: AbortSignal.timeout(8000), // 8 segundos timeout
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        status: 'error',
        message: errorData.detail || 'Error del backend',
        exact: null,
        solutionLatex: null,
      }
    }

    const data = await response.json()

    // Verificar si se encontró solución
    if (data.meta?.analytic_status === 'ok' && data.exact) {
      return {
        success: true,
        status: 'found',
        grid: data.grid,
        exact: data.exact,
        solutionLatex: data.meta.exact_solution_latex,
        message: 'Solución exacta encontrada',
      }
    } else {
      return {
        success: true,
        status: 'not_found',
        message: 'No existe solución exacta en forma cerrada para esta ecuación',
        exact: null,
        solutionLatex: null,
      }
    }
  } catch (error) {
    // Error de conexión o timeout
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return {
        success: false,
        status: 'timeout',
        message: 'El cálculo tardó demasiado. La ecuación puede ser muy compleja.',
        exact: null,
        solutionLatex: null,
      }
    }

    return {
      success: false,
      status: 'connection_error',
      message: 'No se pudo conectar con el backend. Verifica que esté corriendo.',
      exact: null,
      solutionLatex: null,
    }
  }
}

/**
 * Verifica si el backend está disponible
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/docs`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    })
    return response.ok
  } catch {
    return false
  }
}
