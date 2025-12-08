/**
 * Componente DirectionField
 * Dibuja un campo direccional para una EDO x' = f(t,x) usando SVG
 */
export default function DirectionField({
  f,
  tMin,
  tMax,
  xMin,
  xMax,
  density = 25,
  width = 800,
  height = 400,
  arrowLength = 15,
  strokeColor = "#9ca3af",
  strokeWidth = 1,
  opacity = 0.5
}) {
  // Convertir coordenadas matemáticas (t, x) a coordenadas SVG (px, py)
  const toSVGX = (t) => ((t - tMin) / (tMax - tMin)) * width
  const toSVGY = (x) => height - ((x - xMin) / (xMax - xMin)) * height

  // Generar puntos de la rejilla
  const generateArrows = () => {
    const arrows = []
    const tStep = (tMax - tMin) / (density - 1)
    const xStep = (xMax - xMin) / (density - 1)

    for (let i = 0; i < density; i++) {
      for (let j = 0; j < density; j++) {
        const t = tMin + i * tStep
        const x = xMin + j * xStep

        try {
          const slope = f(t, x)

          // Evitar pendientes infinitas o muy grandes
          if (!isFinite(slope) || Math.abs(slope) > 1000) continue

          // Normalizar el vector (1, f(t,x))
          const dt = 1
          const dx = slope
          const magnitude = Math.sqrt(dt * dt + dx * dx)
          const normalizedDt = dt / magnitude
          const normalizedDx = dx / magnitude

          // Calcular los puntos del segmento
          const halfLength = arrowLength / 2
          const t1 = t - normalizedDt * halfLength * (tMax - tMin) / width
          const x1 = x - normalizedDx * halfLength * (xMax - xMin) / height
          const t2 = t + normalizedDt * halfLength * (tMax - tMin) / width
          const x2 = x + normalizedDx * halfLength * (xMax - xMin) / height

          // Convertir a coordenadas SVG
          const px1 = toSVGX(t1)
          const py1 = toSVGY(x1)
          const px2 = toSVGX(t2)
          const py2 = toSVGY(x2)

          // Calcular punta de flecha
          const angle = Math.atan2(py2 - py1, px2 - px1)
          const arrowHeadLength = 4
          const arrowHeadAngle = Math.PI / 6

          arrows.push({
            x1: px1,
            y1: py1,
            x2: px2,
            y2: py2,
            angle,
            arrowHeadLength,
            arrowHeadAngle
          })
        } catch {
          // Ignorar puntos problemáticos
          continue
        }
      }
    }

    return arrows
  }

  const arrows = generateArrows()

  return (
    <svg
      width={width}
      height={height}
      className="direction-field"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {arrows.map((arrow, index) => (
        <g key={index}>
          {/* Línea principal */}
          <line
            x1={arrow.x1}
            y1={arrow.y1}
            x2={arrow.x2}
            y2={arrow.y2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
          {/* Punta de flecha */}
          <path
            d={`M ${arrow.x2} ${arrow.y2}
                L ${arrow.x2 - arrow.arrowHeadLength * Math.cos(arrow.angle - arrow.arrowHeadAngle)} ${arrow.y2 - arrow.arrowHeadLength * Math.sin(arrow.angle - arrow.arrowHeadAngle)}
                M ${arrow.x2} ${arrow.y2}
                L ${arrow.x2 - arrow.arrowHeadLength * Math.cos(arrow.angle + arrow.arrowHeadAngle)} ${arrow.y2 - arrow.arrowHeadLength * Math.sin(arrow.angle + arrow.arrowHeadAngle)}`}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={opacity}
            fill="none"
          />
        </g>
      ))}
    </svg>
  )
}
