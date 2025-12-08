import { compile, parse } from 'mathjs'

/**
 * Convierte LaTeX de MathLive a expresión matemática evaluable
 * MathLive emite LaTeX, pero math.js necesita expresiones simples
 * 
 * Ejemplos de conversión:
 * - "-0.2\cdot\left(y-20\right)" -> "-0.2*(y-20)"
 * - "x^{2}" -> "x^2"
 * - "\frac{x}{y}" -> "(x)/(y)"
 * - "\sin\left(x\right)" -> "sin(x)"
 */
export function latexToMath(latex) {
  if (!latex || typeof latex !== 'string') return ''
  
  let expr = latex.trim()
  
  // === PASO 1: Limpiar espacios LaTeX ===
  expr = expr.replace(/\\,/g, '')  // espacios pequeños
  expr = expr.replace(/\\;/g, '')  // espacios medianos
  expr = expr.replace(/\\quad/g, ' ')
  expr = expr.replace(/\\qquad/g, ' ')
  
  // === PASO 2: Convertir multiplicación ===
  expr = expr.replace(/\\cdot/g, '*')
  expr = expr.replace(/\\times/g, '*')
  expr = expr.replace(/\\ast/g, '*')
  
  // === PASO 3: Convertir división ===
  expr = expr.replace(/\\div/g, '/')
  
  // === PASO 4: Convertir fracciones \frac{a}{b} -> (a)/(b) ===
  // Manejar fracciones anidadas con múltiples pasadas
  let prevExpr = ''
  while (prevExpr !== expr) {
    prevExpr = expr
    expr = expr.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
  }
  
  // === PASO 5: Convertir paréntesis LaTeX ===
  expr = expr.replace(/\\left\(/g, '(')
  expr = expr.replace(/\\right\)/g, ')')
  expr = expr.replace(/\\left\[/g, '(')
  expr = expr.replace(/\\right\]/g, ')')
  expr = expr.replace(/\\left\{/g, '(')
  expr = expr.replace(/\\right\}/g, ')')
  expr = expr.replace(/\\left\|/g, 'abs(')
  expr = expr.replace(/\\right\|/g, ')')
  
  // === PASO 6: Convertir funciones trigonométricas ===
  expr = expr.replace(/\\sin/g, 'sin')
  expr = expr.replace(/\\cos/g, 'cos')
  expr = expr.replace(/\\tan/g, 'tan')
  expr = expr.replace(/\\cot/g, 'cot')
  expr = expr.replace(/\\sec/g, 'sec')
  expr = expr.replace(/\\csc/g, 'csc')
  expr = expr.replace(/\\arcsin/g, 'asin')
  expr = expr.replace(/\\arccos/g, 'acos')
  expr = expr.replace(/\\arctan/g, 'atan')
  expr = expr.replace(/\\sinh/g, 'sinh')
  expr = expr.replace(/\\cosh/g, 'cosh')
  expr = expr.replace(/\\tanh/g, 'tanh')
  
  // === PASO 7: Convertir otras funciones ===
  expr = expr.replace(/\\ln/g, 'log')
  expr = expr.replace(/\\log/g, 'log10')
  expr = expr.replace(/\\exp/g, 'exp')
  expr = expr.replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)')
  expr = expr.replace(/\\sqrt/g, 'sqrt')
  expr = expr.replace(/\\abs/g, 'abs')
  
  // === PASO 8: Convertir constantes ===
  expr = expr.replace(/\\pi/g, 'pi')
  expr = expr.replace(/\\e(?![a-z])/g, 'e')  // \e pero no \exp
  expr = expr.replace(/\\infty/g, 'Infinity')
  
  // === PASO 9: Convertir potencias ===
  // x^{abc} -> x^(abc)
  expr = expr.replace(/\^{([^{}]*)}/g, '^($1)')
  // Simplificar x^(n) donde n es un solo dígito -> x^n
  expr = expr.replace(/\^\((\d)\)/g, '^$1')
  
  // === PASO 10: Convertir subíndices (ignorar para evaluación) ===
  expr = expr.replace(/_\{([^{}]*)\}/g, '_$1')
  expr = expr.replace(/_([a-z0-9])/gi, '')  // Remover subíndices simples
  
  // === PASO 11: Limpiar llaves restantes ===
  expr = expr.replace(/\{/g, '(')
  expr = expr.replace(/\}/g, ')')
  
  // === PASO 12: Limpiar comandos LaTeX no reconocidos ===
  expr = expr.replace(/\\[a-zA-Z]+/g, '')
  
  // === PASO 13: Normalizar espacios ===
  expr = expr.replace(/\s+/g, ' ').trim()
  
  // === PASO 14: Multiplicación implícita ===
  expr = normalizeImplicitMultiplication(expr)
  
  return expr
}

/**
 * Normaliza multiplicación implícita para math.js
 * Ejemplos: "2y" -> "2*y", "xy" -> "x*y", "2sin(x)" -> "2*sin(x)"
 */
function normalizeImplicitMultiplication(expr) {
  let normalized = expr
  
  // Símbolos Unicode de multiplicación -> *
  normalized = normalized.replace(/[\u00B7\u22C5\u00D7·×]/g, '*')
  
  // Patrones de multiplicación implícita
  const patterns = [
    // Número seguido de variable: 2y -> 2*y
    { regex: /(\d)([a-zA-Z])/g, replacement: '$1*$2' },
    
    // Número seguido de paréntesis: 2(x+1) -> 2*(x+1)
    { regex: /(\d)\(/g, replacement: '$1*(' },
    
    // Variable seguida de paréntesis: x(t+1) -> x*(t+1)
    { regex: /([a-zA-Z])\(/g, replacement: '$1*(' },
    
    // Paréntesis seguido de variable: (x+1)y -> (x+1)*y
    { regex: /\)([a-zA-Z])/g, replacement: ')*$1' },
    
    // Paréntesis seguido de número: (x+1)2 -> (x+1)*2
    { regex: /\)(\d)/g, replacement: ')*$1' },
    
    // Paréntesis seguido de paréntesis: (x)(y) -> (x)*(y)
    { regex: /\)\(/g, replacement: ')*(' },
  ]
  
  // Aplicar patrones
  patterns.forEach(({ regex, replacement }) => {
    normalized = normalized.replace(regex, replacement)
  })
  
  // Corregir funciones que fueron mal procesadas
  // sin*( -> sin(
  const functions = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'asin', 'acos', 'atan', 
                     'sinh', 'cosh', 'tanh', 'log', 'log10', 'exp', 'sqrt', 'abs']
  functions.forEach(fn => {
    const regex = new RegExp(`${fn}\\*\\(`, 'g')
    normalized = normalized.replace(regex, `${fn}(`)
  })
  
  // Limpiar múltiples asteriscos
  normalized = normalized.replace(/\*+/g, '*')
  
  // Limpiar asteriscos al inicio de expresiones negativas: *-x -> -x
  normalized = normalized.replace(/^\*/, '')
  normalized = normalized.replace(/\(\*/g, '(')
  
  return normalized
}

/**
 * Detecta el tipo de ecuación y retorna información sobre ella
 */
export function analyzeEquation(expression) {
  const normalized = latexToMath(expression)
  
  const analysis = {
    original: expression,
    normalized: normalized,
    type: 'unknown',
    isLinear: false,
    hasTimeDependent: false,
    hasTrigonometric: false,
    hasExponential: false,
    degree: 1
  }
  
  // Detectar características
  analysis.hasTimeDependent = /[tx]/i.test(normalized)
  analysis.hasTrigonometric = /\b(sin|cos|tan|cot|sec|csc)\b/i.test(normalized)
  analysis.hasExponential = /\b(exp)\b|e\s*\^/i.test(normalized)
  
  // Detectar linealidad
  const hasSquaredY = /y\s*\^\s*2|y\s*\*\s*y/i.test(normalized)
  const hasHigherPowerY = /y\s*\^\s*[3-9]/i.test(normalized)
  analysis.isLinear = !hasSquaredY && !hasHigherPowerY
  
  // Clasificar tipo
  if (normalized.match(/^[\s-]*y\s*$/i)) {
    analysis.type = 'Crecimiento exponencial'
  } else if (normalized.match(/^[\s-]*[\d.]+\s*\*\s*y\s*$/i)) {
    analysis.type = 'Crecimiento/decaimiento exponencial'
  } else if (analysis.isLinear && !analysis.hasTimeDependent) {
    analysis.type = 'Lineal homogénea'
  } else if (analysis.isLinear && analysis.hasTimeDependent) {
    analysis.type = 'Lineal no homogénea'
  } else if (hasSquaredY) {
    analysis.type = 'No lineal (cuadrática)'
    analysis.degree = 2
  } else {
    analysis.type = 'No lineal'
  }
  
  return analysis
}

/**
 * Convierte una expresión (LaTeX o matemática) en una función evaluable
 * 
 * @param {string} expression - Expresión LaTeX o matemática
 * @param {Object} options - Opciones de parseo
 * @returns {Function} Función f(independent, dependent) que evalúa la expresión
 * @throws {Error} Si la expresión es inválida
 */
export function parseEquation(expression, options = {}) {
  const { 
    variables = { independent: 't', dependent: 'y' }
  } = options
  
  try {
    // Convertir LaTeX a expresión matemática
    const mathExpr = latexToMath(expression)
    
    if (!mathExpr) {
      throw new Error('Expresión vacía')
    }
    
    // Compilar la expresión
    const compiled = compile(mathExpr)
    
    // Retornar función evaluadora
    return (independentVal, dependentVal) => {
      const scope = {
        [variables.independent]: independentVal,
        [variables.dependent]: dependentVal,
        // Aliases
        t: independentVal,
        x: independentVal,
        y: dependentVal
      }
      return compiled.evaluate(scope)
    }
  } catch (error) {
    throw new Error(`Error al parsear la ecuación: ${error.message}`)
  }
}

// Alias para compatibilidad
export const parseODE = parseEquation

/**
 * Valida si una expresión es sintácticamente correcta
 */
export function validateExpression(expression) {
  try {
    const mathExpr = latexToMath(expression)
    parse(mathExpr)
    return { valid: true, error: null, normalized: mathExpr }
  } catch (error) {
    return { valid: false, error: error.message, normalized: null }
  }
}

/**
 * Ejemplos de expresiones válidas
 */
export const exampleExpressions = [
  { expr: 'y', latex: 'y', description: 'Crecimiento exponencial' },
  { expr: '-y', latex: '-y', description: 'Decaimiento exponencial' },
  { expr: '-0.2*(y-20)', latex: '-0.2\\cdot\\left(y-20\\right)', description: 'Enfriamiento Newton' },
  { expr: 'x*y', latex: 'x\\cdot y', description: 'Producto de variables' },
  { expr: 'sin(x)+y', latex: '\\sin(x)+y', description: 'Trigonométrica' },
]

export default parseODE
