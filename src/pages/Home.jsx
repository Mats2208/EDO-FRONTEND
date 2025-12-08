import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, FlaskConical, LineChart, Calculator, TrendingUp, GitCompare, CheckCircle2, Target, Lightbulb } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function Home() {
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center border-b-4 border-primary bg-gradient-to-br from-primary-lighter via-white to-neutral-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-academic rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4 animate-fadeIn">
              <span className="inline-block px-4 py-1 bg-academic text-white text-sm font-semibold">
                CÁLCULO III - UPSA 2025
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-neutral-800 animate-fadeIn" style={{animationDelay: '0.1s'}}>
              Análisis Comparativo:<br />
              Método de Euler vs Runge-Kutta de 4º Orden
            </h1>
            <p className="text-xl md:text-2xl text-neutral-700 mb-12 max-w-3xl leading-relaxed animate-fadeIn" style={{animationDelay: '0.2s'}}>
              Plataforma interactiva para la visualización, análisis y comprensión de métodos numéricos
              en la resolución de Ecuaciones Diferenciales Ordinarias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <Link
                to="/laboratory"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white hover:bg-primary-dark transition-all text-lg font-semibold shadow-ms-lg hover:shadow-ms hover:scale-[0.98]"
              >
                <FlaskConical size={24} />
                Acceder al Laboratorio
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/theory"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all text-lg font-semibold"
              >
                <BookOpen size={24} />
                Fundamentos Teóricos
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 text-center animate-bounce">
              <div className="inline-block text-neutral-400">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <p className="text-xs mt-1">Explora más</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section 1: Theory - Fundamentos */}
      <section className="min-h-screen flex items-center py-20 scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Contenido */}
            <div className="order-2 md:order-1">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-primary-lighter text-primary text-xs font-bold uppercase tracking-wide">
                  01 — Fundamentos
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-800">
                Teoría de<br/>
                <span className="text-primary">Ecuaciones Diferenciales</span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Comprende los fundamentos matemáticos de las EDOs, desde su definición formal hasta
                las aplicaciones en ciencias e ingeniería. Aprende sobre métodos numéricos y su
                convergencia.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white border-l-4 border-primary p-4 shadow-ms">
                  <div className="text-3xl font-bold text-primary mb-1">4</div>
                  <div className="text-sm text-neutral-600">Temas principales</div>
                </div>
                <div className="bg-white border-l-4 border-academic p-4 shadow-ms">
                  <div className="text-3xl font-bold text-academic mb-1">∞</div>
                  <div className="text-sm text-neutral-600">Ejemplos interactivos</div>
                </div>
              </div>

              <Link
                to="/theory"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-all font-semibold shadow-ms-md hover:shadow-ms group"
              >
                <BookOpen size={20} />
                Explorar Teoría
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Visual */}
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-academic opacity-10 rounded-lg blur-2xl"></div>
                <div className="relative bg-white border-4 border-primary shadow-ms-lg p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4">
                      <BookOpen className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 mb-2">¿Qué aprenderás?</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">Definición y clasificación de EDOs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">Método de Euler explicado paso a paso</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">Runge-Kutta de 4º orden (RK4)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">Análisis comparativo de precisión</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section 2: Laboratory - Experimentación */}
      <section className="min-h-screen flex items-center py-20 bg-gradient-to-br from-neutral-50 to-success-lighter scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Visual */}
            <div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-success to-primary opacity-10 rounded-lg blur-2xl"></div>
                <div className="relative bg-white border-4 border-success shadow-ms-lg p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-success to-success-light flex items-center justify-center mb-4">
                      <FlaskConical className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 mb-2">Herramientas disponibles</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-neutral-50 p-4 border-l-2 border-primary">
                      <LineChart size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-800">Visualización gráfica</div>
                        <div className="text-sm text-neutral-600">Compara métodos en tiempo real</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-neutral-50 p-4 border-l-2 border-academic">
                      <Calculator size={20} className="text-academic mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-800">Análisis de error</div>
                        <div className="text-sm text-neutral-600">Métricas de convergencia</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-neutral-50 p-4 border-l-2 border-warning">
                      <TrendingUp size={20} className="text-warning mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-800">Parámetros ajustables</div>
                        <div className="text-sm text-neutral-600">Control total del experimento</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-success-lighter text-success text-xs font-bold uppercase tracking-wide">
                  02 — Experimentación
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-800">
                Laboratorio<br/>
                <span className="text-success">Interactivo</span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Experimenta con ecuaciones diferenciales en tiempo real. Modifica parámetros, observa
                las gráficas y compara la precisión de Euler vs RK4 en diferentes escenarios.
              </p>

              <div className="bg-white border-l-4 border-success p-6 shadow-ms mb-8">
                <h4 className="font-semibold text-neutral-800 mb-3">¿Qué puedes hacer?</h4>
                <ul className="space-y-2 text-neutral-700 text-sm">
                  <li>• Definir ecuaciones personalizadas o usar plantillas</li>
                  <li>• Ajustar condiciones iniciales y tamaño de paso</li>
                  <li>• Ver comparación en vivo de ambos métodos</li>
                  <li>• Analizar métricas de error y convergencia</li>
                </ul>
              </div>

              <Link
                to="/laboratory"
                className="inline-flex items-center gap-2 px-6 py-3 bg-success text-white hover:bg-success-light transition-all font-semibold shadow-ms-md hover:shadow-ms group"
              >
                <FlaskConical size={20} />
                Acceder al Laboratorio
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section 3: Problems - Aplicaciones */}
      <section className="min-h-screen flex items-center py-20 scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Contenido */}
            <div className="order-2 md:order-1">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-warning-lighter text-warning text-xs font-bold uppercase tracking-wide">
                  03 — Aplicaciones
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-800">
                Problemas<br/>
                <span className="text-warning">del Mundo Real</span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Explora aplicaciones prácticas de EDOs en física, biología, ingeniería y más.
                Problemas pre-configurados listos para analizar y comprender.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white border-l-4 border-warning p-4 shadow-ms">
                  <div className="text-3xl font-bold text-warning mb-1">8</div>
                  <div className="text-xs text-neutral-600">Categorías</div>
                </div>
                <div className="bg-white border-l-4 border-primary p-4 shadow-ms">
                  <div className="text-3xl font-bold text-primary mb-1">50+</div>
                  <div className="text-xs text-neutral-600">Aplicaciones</div>
                </div>
                <div className="bg-white border-l-4 border-academic p-4 shadow-ms">
                  <div className="text-3xl font-bold text-academic mb-1">25</div>
                  <div className="text-xs text-neutral-600">Ejemplos</div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-warning p-6 shadow-ms mb-8">
                <h4 className="font-semibold text-neutral-800 mb-3">Categorías disponibles</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-neutral-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-warning flex-shrink-0" />
                    <span>Física</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-warning flex-shrink-0" />
                    <span>Biología</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-warning flex-shrink-0" />
                    <span>Ingeniería</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-warning flex-shrink-0" />
                    <span>Economía</span>
                  </div>
                </div>
              </div>

              <Link
                to="/problems"
                className="inline-flex items-center gap-2 px-6 py-3 bg-warning text-white hover:bg-warning-light transition-all font-semibold shadow-ms-md hover:shadow-ms group"
              >
                <Target size={20} />
                Explorar Problemas
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Visual */}
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-warning to-error opacity-10 rounded-lg blur-2xl"></div>
                <div className="relative bg-white border-4 border-warning shadow-ms-lg p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning-light flex items-center justify-center mb-4">
                      <Target className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 mb-2">Ejemplos incluidos</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 bg-neutral-50 p-3 border-l-2 border-primary">
                      <TrendingUp size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">Crecimiento poblacional</div>
                        <div className="text-xs text-neutral-600">Modelos demográficos</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 bg-neutral-50 p-3 border-l-2 border-error">
                      <Calculator size={18} className="text-error mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">Transferencia de calor</div>
                        <div className="text-xs text-neutral-600">Ley de Newton</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 bg-neutral-50 p-3 border-l-2 border-success">
                      <Lightbulb size={18} className="text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">Circuitos eléctricos</div>
                        <div className="text-xs text-neutral-600">Análisis RC/RL</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 bg-neutral-50 p-3 border-l-2 border-academic">
                      <GitCompare size={18} className="text-academic mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">Reacciones químicas</div>
                        <div className="text-xs text-neutral-600">Cinética de reacción</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-academic via-primary to-primary-dark py-20 border-t-4 border-academic scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-white/10 text-white text-sm font-bold uppercase tracking-wide backdrop-blur-sm">
                Plataforma Completa
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Comienza tu Exploración
            </h2>
            <p className="text-xl md:text-2xl text-primary-lighter mb-12 max-w-3xl mx-auto leading-relaxed">
              Accede a todas las herramientas y recursos para dominar los métodos numéricos
              en la resolución de ecuaciones diferenciales ordinarias
            </p>

            {/* Grid de acciones */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Link
                to="/theory"
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white hover:border-white p-6 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/20 group-hover:bg-primary flex items-center justify-center mx-auto mb-4 transition-all">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary mb-2 transition-colors">Teoría</h3>
                <p className="text-sm text-primary-lighter group-hover:text-neutral-600 transition-colors">
                  Fundamentos y conceptos matemáticos
                </p>
              </Link>

              <Link
                to="/laboratory"
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white hover:border-white p-6 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-white/20 group-hover:bg-success flex items-center justify-center mx-auto mb-4 transition-all">
                  <FlaskConical className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-success mb-2 transition-colors">Laboratorio</h3>
                <p className="text-sm text-primary-lighter group-hover:text-neutral-600 transition-colors">
                  Simulador interactivo en vivo
                </p>
                <div className="mt-3 text-xs text-white/60 group-hover:text-success-light font-semibold uppercase">Recomendado</div>
              </Link>

              <Link
                to="/problems"
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white hover:border-white p-6 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/20 group-hover:bg-warning flex items-center justify-center mx-auto mb-4 transition-all">
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-warning mb-2 transition-colors">Problemas</h3>
                <p className="text-sm text-primary-lighter group-hover:text-neutral-600 transition-colors">
                  Aplicaciones del mundo real
                </p>
              </Link>
            </div>

            {/* Información adicional */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 max-w-3xl mx-auto">
              <div className="flex items-start gap-4 text-left">
                <div className="bg-white/10 p-3 rounded-lg flex-shrink-0">
                  <Lightbulb className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Proyecto Académico - UPSA 2025</h4>
                  <p className="text-primary-lighter text-sm leading-relaxed">
                    Plataforma desarrollada como proyecto de investigación para el curso de Cálculo III.
                    Combina rigor matemático con herramientas interactivas para facilitar la comprensión
                    de métodos numéricos aplicados a ecuaciones diferenciales ordinarias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
