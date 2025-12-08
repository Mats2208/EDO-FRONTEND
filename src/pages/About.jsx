export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-neutral-800">Información del Proyecto</h1>

        <div className="bg-white border border-neutral-200 shadow-ms p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">
            Análisis Comparativo: Euler vs Runge-Kutta de 4º Orden
          </h2>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-neutral-800">Datos Académicos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 border-primary pl-4">
                <p className="text-sm text-neutral-600 mb-1">Materia</p>
                <p className="font-semibold text-neutral-900">MI 220 - Cálculo III</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="text-sm text-neutral-600 mb-1">Institución</p>
                <p className="font-semibold text-neutral-900">Universidad Privada de Santa Cruz</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="text-sm text-neutral-600 mb-1">Facultad</p>
                <p className="font-semibold text-neutral-900">Ingeniería</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="text-sm text-neutral-600 mb-1">Año Académico</p>
                <p className="font-semibold text-neutral-900">2025</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-neutral-800">Docente</h3>
            <p className="text-neutral-700">Prof. Silvestre Igor García Osinaga</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-neutral-800">Autores</h3>
            <ul className="space-y-2">
              <li className="text-neutral-700">• Mateo Andrés Soto Gareca</li>
              <li className="text-neutral-700">• Carlos Moisés Zambrana Hurtado</li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-neutral-800">Objetivo del Proyecto</h3>
            <p className="text-neutral-700 leading-relaxed">
              Desarrollo de una plataforma interactiva de análisis para la visualización,
              comparación y comprensión de métodos numéricos aplicados a la resolución de
              Ecuaciones Diferenciales Ordinarias. El sistema permite la experimentación
              controlada con parámetros, análisis de convergencia y evaluación cuantitativa
              del error de truncamiento.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-neutral-800">Stack Tecnológico</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="border border-neutral-200 px-3 py-2 text-center">
                <span className="text-neutral-900 font-medium">React 18+</span>
              </div>
              <div className="border border-neutral-200 px-3 py-2 text-center">
                <span className="text-neutral-900 font-medium">Vite</span>
              </div>
              <div className="border border-neutral-200 px-3 py-2 text-center">
                <span className="text-neutral-900 font-medium">Tailwind CSS</span>
              </div>
              <div className="border border-neutral-200 px-3 py-2 text-center">
                <span className="text-neutral-900 font-medium">Recharts</span>
              </div>
              <div className="border border-neutral-200 px-3 py-2 text-center">
                <span className="text-neutral-900 font-medium">math.js</span>
              </div>
              <div className="border border-neutral-200 px-3 py-2 text-center">
                <span className="text-neutral-900 font-medium">KaTeX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-100 border border-neutral-200 p-6">
          <p className="text-sm text-neutral-600 text-center">
            Este proyecto constituye un trabajo académico con fines exclusivamente educativos,
            desarrollado como parte del programa de Cálculo III en la UPSA.
          </p>
        </div>
      </div>
    </div>
  )
}
