/**
 * Constantes y configuración global de la aplicación
 */

// Configuración por defecto de simulación
export const DEFAULT_SIMULATION = {
  t0: 0,
  y0: 1,
  tf: 5,
  h: 0.1,
  equation: 'y', // dy/dt = y
}

// Rangos permitidos para parámetros
export const PARAMETER_RANGES = {
  t0: { min: -10, max: 10, step: 0.1 },
  y0: { min: -100, max: 100, step: 0.1 },
  tf: { min: 0.1, max: 100, step: 0.1 },
  h: { min: 0.001, max: 1, step: 0.001 },
}

// Colores para gráficos
export const CHART_COLORS = {
  euler: '#EF4444', // red-500
  rk4: '#3B82F6', // blue-500
  exact: '#10B981', // green-500
  grid: '#E5E7EB', // gray-200
  axis: '#6B7280', // gray-500
}

// Configuración de gráficos
export const CHART_CONFIG = {
  defaultWidth: '100%',
  defaultHeight: 400,
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  strokeWidth: 2,
  pointRadius: 0, // No mostrar puntos por defecto
}

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  INVALID_EQUATION: 'La ecuación ingresada no es válida',
  INVALID_PARAMETERS: 'Los parámetros ingresados no son válidos',
  INVALID_VARIABLES: 'Solo se permiten las variables t e y',
  COMPUTATION_ERROR: 'Error al calcular la solución',
  TIMEOUT: 'El cálculo está tomando demasiado tiempo',
}

// Límites de cálculo para prevenir sobrecarga
export const COMPUTATION_LIMITS = {
  MAX_STEPS: 100000, // Máximo número de pasos
  MAX_TIME_MS: 5000, // Máximo tiempo de cálculo en ms
}

// Tamaños de paso recomendados según intervalo
export function getRecommendedStepSize(tf, t0 = 0) {
  const interval = Math.abs(tf - t0)
  
  if (interval <= 1) return 0.01
  if (interval <= 5) return 0.05
  if (interval <= 10) return 0.1
  if (interval <= 50) return 0.5
  return 1
}

// Formateo de números
export function formatNumber(num, decimals = 4) {
  if (Math.abs(num) < 0.0001) return num.toExponential(2)
  return Number(num.toFixed(decimals))
}

export default {
  DEFAULT_SIMULATION,
  PARAMETER_RANGES,
  CHART_COLORS,
  CHART_CONFIG,
  ERROR_MESSAGES,
  COMPUTATION_LIMITS,
  getRecommendedStepSize,
  formatNumber,
}
