/**
 * Componente TangentField
 * Dibuja flechitas tangentes sobre una curva ya calculada
 */
export default function TangentField({
  points, // Array de {t, x}
  tMin,
  tMax,
  xMin,
  xMax,
  width = 800,
  height = 400,
  arrowLength = 15,
  strokeColor = "#ef4444",
  strokeWidth = 1.5,
  opacity = 0.8,
  skip = 1 // Dibujar una flecha cada 'skip' puntos
}) {
  // Convertir coordenadas matemáticas (t, x) a coordenadas SVG (px, py)
  const toSVGX = (t) => ((t - tMin) / (tMax - tMin)) * width
  const toSVGY = (x) => height - ((x - xMin) / (xMax - xMin)) * height

  // Generar flechas tangentes
  const generateTangentArrows = () => {
    const arrows = []

    for (let i = 0; i < points.length - 1; i += skip) {
      const p1 = points[i]
      const p2 = points[i + 1]

      if (!p1 || !p2) continue

      // Punto medio
      const t = (p1.t + p2.t) / 2
      const x = (p1.x + p2.x) / 2

      // Vector tangente (dirección entre puntos consecutivos)
      const dt = p2.t - p1.t
      const dx = p2.x - p1.x

      // Normalizar
      const magnitude = Math.sqrt(dt * dt + dx * dx)
      if (magnitude === 0) continue

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
    }

    return arrows
  }

  const arrows = generateTangentArrows()

  return (
    <svg
      width={width}
      height={height}
      className="tangent-field"
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
