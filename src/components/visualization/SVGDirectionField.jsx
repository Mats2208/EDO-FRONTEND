import { useMemo } from 'react'

/**
 * Componente SVGDirectionField
 * Genera un campo de direcciones SVG estático para una EDO dy/dt = f(t, y)
 * 
 * Este componente genera las flechas una vez por cada cambio de parámetros,
 * lo cual es más preciso aunque puede ser ligeramente más lento.
 * 
 * @param {Function} f - Función f(t, y) que define dy/dt
 * @param {number} tMin - Límite inferior del eje t
 * @param {number} tMax - Límite superior del eje t
 * @param {number} yMin - Límite inferior del eje y
 * @param {number} yMax - Límite superior del eje y
 * @param {number} gridCountX - Número de flechas en dirección horizontal
 * @param {number} gridCountY - Número de flechas en dirección vertical
 * @param {number} arrowScale - Escala de las flechas (0-1)
 * @param {string} color - Color de las flechas
 * @param {number} opacity - Opacidad de las flechas
 */
export default function SVGDirectionField({
  f,
  tMin,
  tMax,
  yMin,
  yMax,
  gridCountX = 20,
  gridCountY = 15,
  arrowScale = 0.7,
  color = '#6b7280',
  opacity = 0.5,
  strokeWidth = 1.2
}) {
  // Calcular todas las flechas con useMemo para evitar recálculos innecesarios
  const arrows = useMemo(() => {
    const result = []

    // Espaciado entre flechas en coordenadas matemáticas
    const tStep = (tMax - tMin) / (gridCountX + 1)
    const yStep = (yMax - yMin) / (gridCountY + 1)

    // Longitud máxima de las flechas (en coordenadas matemáticas)
    const maxArrowLengthT = tStep * arrowScale
    const maxArrowLengthY = yStep * arrowScale

    for (let i = 1; i <= gridCountX; i++) {
      for (let j = 1; j <= gridCountY; j++) {
        const t = tMin + i * tStep
        const y = yMin + j * yStep

        try {
          const slope = f(t, y)
          
          // Evitar pendientes problemáticas
          if (!isFinite(slope) || Math.abs(slope) > 1000) continue
          
          // El vector de dirección es (1, slope) normalizado
          // Pero debemos escalar considerando los rangos de los ejes
          const tRange = tMax - tMin
          const yRange = yMax - yMin
          
          // Calcular el ángulo real considerando la escala de los ejes
          // angle = atan2(dy * scaleY, dt * scaleX) donde scaleY/scaleX corrige la proporción
          const normalizedSlope = slope * (tRange / yRange)
          const angle = Math.atan(normalizedSlope)
          
          // Componentes del vector normalizado
          const cosAngle = Math.cos(angle)
          const sinAngle = Math.sin(angle)
          
          // Calcular puntos de inicio y fin de la flecha
          // Los deltas están en coordenadas matemáticas
          const halfLengthT = (maxArrowLengthT * cosAngle) / 2
          const halfLengthY = (maxArrowLengthY * sinAngle) / 2
          
          result.push({
            t,
            y,
            t1: t - halfLengthT,
            y1: y - halfLengthY,
            t2: t + halfLengthT,
            y2: y + halfLengthY,
            slope
          })
        } catch {
          // Ignorar puntos problemáticos
          continue
        }
      }
    }
    
    return result
  }, [f, tMin, tMax, yMin, yMax, gridCountX, gridCountY, arrowScale])
  
  // Funciones de conversión de coordenadas matemáticas a porcentaje SVG
  const toPercentX = (t) => ((t - tMin) / (tMax - tMin)) * 100
  const toPercentY = (y) => (1 - (y - yMin) / (yMax - yMin)) * 100
  
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L6,3 z"
            fill={color}
            opacity={opacity}
          />
        </marker>
      </defs>
      
      {arrows.map((arrow, index) => {
        const x1 = toPercentX(arrow.t1)
        const y1 = toPercentY(arrow.y1)
        const x2 = toPercentX(arrow.t2)
        const y2 = toPercentY(arrow.y2)
        
        // Calcular ángulo para la punta de flecha manual
        const dx = x2 - x1
        const dy = y2 - y1
        const angle = Math.atan2(dy, dx)
        const arrowHeadSize = 0.8
        
        return (
          <g key={index}>
            {/* Línea principal */}
            <line
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={color}
              strokeWidth={strokeWidth}
              opacity={opacity}
              vectorEffect="non-scaling-stroke"
            />
            {/* Punta de flecha manual */}
            <path
              d={`
                M ${x2}% ${y2}%
                L ${x2 - arrowHeadSize * Math.cos(angle - Math.PI/6)}% ${y2 - arrowHeadSize * Math.sin(angle - Math.PI/6)}%
                M ${x2}% ${y2}%
                L ${x2 - arrowHeadSize * Math.cos(angle + Math.PI/6)}% ${y2 - arrowHeadSize * Math.sin(angle + Math.PI/6)}%
              `}
              stroke={color}
              strokeWidth={strokeWidth}
              opacity={opacity}
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )
      })}
    </svg>
  )
}
