import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, FlaskConical, Target, Calculator, TrendingUp, GitCompare, Lightbulb, Zap } from 'lucide-react'
// import banner from '../assets/EDOLab-banner.png'
import logo from '../assets/EDOLab-Logo.png'
import CTA from '../assets/EDOLab-CTA.png'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section Compacto con Banner */}
      <section className="relative bg-gradient-to-br from-primary-lighter via-white to-neutral-50 border-b-4 border-primary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-academic rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header con Logo */}
            <div className="flex items-center justify-center mb-8 animate-fadeIn">
              <img src={logo} alt="EDOLab Logo" className="h-20 md:h-28 object-contain" />
            </div>

            {/* Badge */}
            <div className="text-center mb-4 animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <span className="inline-block px-4 py-1 bg-academic text-white text-sm font-semibold">
                CÁLCULO III - UPSA 2025
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-neutral-800 text-center animate-fadeIn" style={{animationDelay: '0.2s'}}>
              Análisis Comparativo: Euler vs Runge-Kutta RK4
            </h1>

            {/* Descripción */}
            <p className="text-lg md:text-xl text-neutral-700 mb-8 max-w-3xl mx-auto text-center leading-relaxed animate-fadeIn" style={{animationDelay: '0.3s'}}>
              Plataforma interactiva para visualizar, analizar y comprender métodos numéricos en la resolución de Ecuaciones Diferenciales Ordinarias
            </p>

            {/* Banner */}
            <div className="mb-8 animate-fadeIn" style={{animationDelay: '0.4s'}}>
              <img src={CTA} alt="EDOLab CTA" className="w-full max-w-4xl mx-auto rounded-lg shadow-ms-lg border-2 border-neutral-200" />
            </div>
          </div>
        </div>
      </section>

      {/* HUB Central - Secciones Principales */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header del Hub */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                Explora la Plataforma
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Accede directamente a las herramientas y recursos principales
              </p>
            </div>

            {/* Grid de Secciones Principales */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Teoría */}
              <Link
                to="/theory"
                className="group bg-white border-4 border-primary hover:border-primary-dark shadow-ms-md hover:shadow-ms-lg transition-all p-8 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-3 text-center">Teoría</h3>
                <p className="text-neutral-600 text-center mb-4 text-sm leading-relaxed">
                  Fundamentos matemáticos de EDOs, desde definiciones hasta métodos numéricos y convergencia
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <Zap size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>¿Qué son las EDOs?</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <Zap size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Método de Euler</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <Zap size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Runge-Kutta RK4</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <Zap size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Análisis comparativo</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    Explorar Teoría
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>

              {/* Laboratorio */}
              <Link
                to="/laboratory"
                className="group bg-white border-4 border-success hover:border-success-light shadow-ms-lg hover:shadow-ms-xl transition-all p-8 transform hover:scale-105 relative"
              >
                {/* Badge Recomendado */}
                <div className="absolute -top-3 -right-3 bg-warning text-white px-3 py-1 text-xs font-bold uppercase shadow-ms">
                  Recomendado
                </div>

                <div className="w-16 h-16 bg-gradient-to-br from-success to-success-light flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-3 text-center">Laboratorio</h3>
                <p className="text-neutral-600 text-center mb-4 text-sm leading-relaxed">
                  Experimenta en tiempo real: define ecuaciones, ajusta parámetros y compara métodos visualmente
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <TrendingUp size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Gráficas interactivas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <Calculator size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Análisis de error</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <GitCompare size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Comparación en vivo</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <Lightbulb size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Parámetros ajustables</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-success font-semibold group-hover:gap-3 transition-all">
                    Acceder al Lab
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>

              {/* Problemas */}
              <Link
                to="/problems"
                className="group bg-white border-4 border-warning hover:border-warning-light shadow-ms-md hover:shadow-ms-lg transition-all p-8 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning-light flex items-center justify-center mx-auto mb-4">
                  <Target className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-3 text-center">Problemas</h3>
                <p className="text-neutral-600 text-center mb-4 text-sm leading-relaxed">
                  Aplicaciones del mundo real: física, biología, ingeniería y más con ejemplos pre-configurados
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <TrendingUp size={16} className="text-warning mt-0.5 flex-shrink-0" />
                    <span>Crecimiento poblacional</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <Calculator size={16} className="text-warning mt-0.5 flex-shrink-0" />
                    <span>Transferencia de calor</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <Lightbulb size={16} className="text-warning mt-0.5 flex-shrink-0" />
                    <span>Circuitos eléctricos</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-700">
                    <GitCompare size={16} className="text-warning mt-0.5 flex-shrink-0" />
                    <span>Reacciones químicas</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-warning font-semibold group-hover:gap-3 transition-all">
                    Ver Problemas
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-primary-lighter border-l-4 border-primary p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">4</div>
                <div className="text-sm text-neutral-700">Temas teóricos</div>
              </div>
              <div className="bg-success-lighter border-l-4 border-success p-4 text-center">
                <div className="text-3xl font-bold text-success mb-1">2</div>
                <div className="text-sm text-neutral-700">Métodos numéricos</div>
              </div>
              <div className="bg-warning-lighter border-l-4 border-warning p-4 text-center">
                <div className="text-3xl font-bold text-warning mb-1">8</div>
                <div className="text-sm text-neutral-700">Categorías</div>
              </div>
              <div className="bg-academic-lighter border-l-4 border-academic p-4 text-center">
                <div className="text-3xl font-bold text-academic mb-1">25+</div>
                <div className="text-sm text-neutral-700">Ejemplos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Rápida de Características */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary-lighter border-t-2 border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-neutral-800 mb-8 text-center">
              ¿Por qué usar EDOLab?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-l-4 border-primary p-6 shadow-ms">
                <h4 className="font-bold text-lg text-neutral-800 mb-2 flex items-center gap-2">
                  <BookOpen size={20} className="text-primary" />
                  Aprendizaje Visual
                </h4>
                <p className="text-neutral-600 text-sm">
                  Visualiza conceptos matemáticos complejos con gráficas interactivas y animaciones que facilitan la comprensión
                </p>
              </div>

              <div className="bg-white border-l-4 border-success p-6 shadow-ms">
                <h4 className="font-bold text-lg text-neutral-800 mb-2 flex items-center gap-2">
                  <FlaskConical size={20} className="text-success" />
                  Experimentación Práctica
                </h4>
                <p className="text-neutral-600 text-sm">
                  Prueba diferentes ecuaciones y parámetros en tiempo real, observa cómo cambian los resultados instantáneamente
                </p>
              </div>

              <div className="bg-white border-l-4 border-warning p-6 shadow-ms">
                <h4 className="font-bold text-lg text-neutral-800 mb-2 flex items-center gap-2">
                  <GitCompare size={20} className="text-warning" />
                  Análisis Comparativo
                </h4>
                <p className="text-neutral-600 text-sm">
                  Compara directamente Euler vs RK4: precisión, velocidad de convergencia y errores en diferentes escenarios
                </p>
              </div>

              <div className="bg-white border-l-4 border-academic p-6 shadow-ms">
                <h4 className="font-bold text-lg text-neutral-800 mb-2 flex items-center gap-2">
                  <Target size={20} className="text-academic" />
                  Aplicaciones Reales
                </h4>
                <p className="text-neutral-600 text-sm">
                  Conecta la teoría con la práctica mediante ejemplos del mundo real en física, biología, ingeniería y más
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 bg-gradient-to-br from-academic via-primary to-primary-dark border-t-4 border-academic">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Comienza Ahora
            </h2>
            <p className="text-xl text-primary-lighter mb-8 max-w-2xl mx-auto">
              Domina los métodos numéricos con herramientas interactivas y visuales
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/laboratory"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary hover:bg-primary-lighter transition-all text-lg font-semibold shadow-ms-lg hover:shadow-ms"
              >
                <FlaskConical size={24} />
                Ir al Laboratorio
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/theory"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all text-lg font-semibold"
              >
                <BookOpen size={24} />
                Ver Teoría
              </Link>
            </div>

            {/* Info Proyecto */}
            <div className="mt-12 bg-white/10 backdrop-blur-sm border border-white/20 p-6 max-w-2xl mx-auto">
              <p className="text-primary-lighter text-sm leading-relaxed">
                <strong className="text-white">Proyecto Académico - UPSA 2025</strong><br />
                Plataforma desarrollada para el curso de Cálculo III. Combina rigor matemático con herramientas interactivas para facilitar la comprensión de métodos numéricos aplicados a EDOs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
