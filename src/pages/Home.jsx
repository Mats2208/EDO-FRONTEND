import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, FlaskConical, Target, Calculator, TrendingUp, GitCompare, Lightbulb, Zap, Sparkles } from 'lucide-react'
import logo from '../assets/EDOLab-Logo.png'
import CTA from '../assets/EDOLab-CTA.png'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section Mejorado */}
      <section className="relative bg-gradient-to-br from-primary-lighter via-white to-neutral-50 border-b-4 border-primary overflow-hidden">
        {/* Background Pattern Sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-academic rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header con Logo */}
            <div className="flex items-center justify-center mb-10 animate-fadeIn">
              <img src={logo} alt="EDOLab Logo" className="h-24 md:h-32 object-contain" />
            </div>

            {/* Badge */}
            <div className="text-center mb-6 animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <span className="inline-block px-6 py-2 bg-academic text-white text-sm font-bold uppercase tracking-wide shadow-ms">
                CÁLCULO III - UPSA 2025
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-800 text-center animate-fadeIn leading-tight" style={{animationDelay: '0.2s'}}>
              Análisis Comparativo:<br />
              <span className="text-primary">Euler vs Runge-Kutta RK4</span>
            </h1>

            {/* Descripción */}
            <p className="text-xl md:text-2xl text-neutral-700 mb-10 max-w-4xl mx-auto text-center leading-relaxed animate-fadeIn" style={{animationDelay: '0.3s'}}>
              Plataforma interactiva con <strong className="text-primary">inteligencia artificial</strong> para visualizar, 
              analizar y comprender métodos numéricos en la resolución de Ecuaciones Diferenciales Ordinarias
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fadeIn" style={{animationDelay: '0.4s'}}>
              <Link
                to="/laboratory"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-success text-white hover:bg-success-light transition-all text-xl font-bold shadow-ms-lg hover:shadow-ms-xl transform hover:scale-105"
              >
                <FlaskConical size={28} />
                Ir al Laboratorio
                <ArrowRight size={24} />
              </Link>
              <Link
                to="/theory"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white border-4 border-primary text-primary hover:bg-primary hover:text-white transition-all text-xl font-bold shadow-ms hover:shadow-ms-lg transform hover:scale-105"
              >
                <BookOpen size={28} />
                Explorar Teoría
              </Link>
            </div>

            {/* Banner */}
            <div className="mb-10 animate-fadeIn" style={{animationDelay: '0.5s'}}>
              <img src={CTA} alt="EDOLab Platform Preview" className="w-full max-w-5xl mx-auto shadow-ms-xl border-4 border-neutral-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Solver IA Destacado */}
      <section className="py-12 bg-gradient-to-r from-purple-600 via-primary to-primary-dark border-y-4 border-purple-700">
        <div className="container mx-auto px-4">
          <Link
            to="/solver-ia"
            className="block max-w-6xl mx-auto bg-white shadow-ms-xl hover:shadow-ms-2xl transition-all transform hover:scale-[1.02] border-4 border-purple-200 group"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 p-10">
              {/* Icono */}
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-purple-500 to-primary p-8 border-4 border-purple-700 shadow-ms-lg">
                  <Sparkles size={64} className="text-white" />
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-block bg-warning text-white px-4 py-2 text-sm font-bold uppercase mb-4 shadow-ms">
                  🔥 NUEVO - Powered by AI
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                  Solver con Inteligencia Artificial
                </h3>

                <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                  Describe tu problema en lenguaje natural y deja que la <strong className="text-primary">IA identifique la ecuación diferencial</strong>, 
                  determine los parámetros óptimos y resuelva automáticamente usando Euler y RK4.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-100 border-l-4 border-purple-600 p-4">
                    <div className="font-bold text-purple-800 mb-1">✨ Análisis Inteligente</div>
                    <p className="text-sm text-purple-700">GPT-4 interpreta problemas</p>
                  </div>
                  <div className="bg-primary-lighter border-l-4 border-primary p-4">
                    <div className="font-bold text-primary-dark mb-1">🎯 Auto-Detecta</div>
                    <p className="text-sm text-primary-dark">Parámetros automáticos</p>
                  </div>
                  <div className="bg-success-lighter border-l-4 border-success p-4">
                    <div className="font-bold text-success-dark mb-1">📊 Simulación</div>
                    <p className="text-sm text-success-dark">Resultados instantáneos</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-purple-600 to-primary text-white px-8 py-5 font-bold text-lg shadow-ms-lg group-hover:shadow-ms-xl transition-all flex items-center gap-3">
                  Probar Ahora
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Secciones Principales */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                Explora la Plataforma
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Accede directamente a las herramientas y recursos principales
              </p>
            </div>

            {/* Grid de 3 Cards */}
            <div className="grid md:grid-cols-3 gap-6">
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
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-neutral-50 border-y-4 border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4 text-center">
              Plataforma Completa de EDOs
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto text-center mb-12">
              Todo lo que necesitas para dominar métodos numéricos en un solo lugar
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white border-4 border-primary p-6 text-center shadow-ms hover:shadow-ms-lg transition-all transform hover:scale-105">
                <div className="text-5xl font-bold text-primary mb-2">4</div>
                <div className="text-sm font-semibold text-neutral-700 uppercase">Temas Teóricos</div>
              </div>
              <div className="bg-white border-4 border-success p-6 text-center shadow-ms hover:shadow-ms-lg transition-all transform hover:scale-105">
                <div className="text-5xl font-bold text-success mb-2">2</div>
                <div className="text-sm font-semibold text-neutral-700 uppercase">Métodos Numéricos</div>
              </div>
              <div className="bg-white border-4 border-warning p-6 text-center shadow-ms hover:shadow-ms-lg transition-all transform hover:scale-105">
                <div className="text-5xl font-bold text-warning mb-2">8</div>
                <div className="text-sm font-semibold text-neutral-700 uppercase">Categorías</div>
              </div>
              <div className="bg-white border-4 border-academic p-6 text-center shadow-ms hover:shadow-ms-lg transition-all transform hover:scale-105">
                <div className="text-5xl font-bold text-academic mb-2">25+</div>
                <div className="text-sm font-semibold text-neutral-700 uppercase">Ejemplos Reales</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 bg-white">
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
      <section className="py-20 bg-gradient-to-br from-academic via-primary to-primary-dark border-t-4 border-academic">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comienza Tu Aprendizaje Ahora
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Domina los métodos numéricos con herramientas interactivas, visuales y potenciadas por IA
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/laboratory"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary hover:bg-primary-lighter transition-all text-xl font-bold shadow-ms-xl hover:shadow-ms-2xl transform hover:scale-105"
              >
                <FlaskConical size={28} />
                Ir al Laboratorio
                <ArrowRight size={24} />
              </Link>
              <Link
                to="/theory"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border-4 border-white text-white hover:bg-white hover:text-primary transition-all text-xl font-bold shadow-ms hover:shadow-ms-lg transform hover:scale-105"
              >
                <BookOpen size={28} />
                Explorar Teoría
              </Link>
            </div>

            {/* Info Proyecto */}
            <div className="bg-white/10 border-4 border-white/30 p-8 max-w-2xl mx-auto shadow-ms-lg">
              <p className="text-white/90 text-base leading-relaxed">
                <strong className="text-white text-xl block mb-3">Proyecto Académico - UPSA 2025</strong>
                Plataforma desarrollada para Cálculo III que combina rigor matemático con herramientas 
                interactivas modernas para facilitar la comprensión de métodos numéricos aplicados a 
                Ecuaciones Diferenciales Ordinarias.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
