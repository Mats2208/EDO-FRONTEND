import { Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-800 text-white border-t-4 border-academic mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Proyecto Info */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-success"></span>
              EDO: Euler vs RK4
            </h3>
            <p className="text-sm text-neutral-300">
              Plataforma interactiva para el análisis comparativo de métodos numéricos
              en la resolución de Ecuaciones Diferenciales Ordinarias.
            </p>
          </div>

          {/* Universidad Info */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary"></span>
              Universidad Privada de Santa Cruz
            </h3>
            <p className="text-sm text-neutral-300">
              Facultad de Ingeniería<br />
              MI 220 - Cálculo III<br />
              Año Académico 2025<br />
              Prof. Silvestre Igor García Osinaga
            </p>
          </div>

          {/* Estudiantes */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-warning"></span>
              Autores del Proyecto
            </h3>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>Mateo Andrés Soto Gareca</li>
              <li>Carlos Moisés Zambrana Hurtado</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-neutral-600 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400">
            © {currentYear} EDO-RK4. Proyecto académico con fines educativos.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-success transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
