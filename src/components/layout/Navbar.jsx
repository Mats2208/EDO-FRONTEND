import { NavLink } from 'react-router-dom'
import { Home, BookOpen, FlaskConical, ListChecks, Info } from 'lucide-react'

export default function Navbar() {
  const navItems = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/theory', label: 'Teoría', icon: BookOpen },
    { to: '/laboratory', label: 'Laboratorio', icon: FlaskConical },
    { to: '/problems', label: 'Problemas', icon: ListChecks },
    { to: '/about', label: 'Sobre', icon: Info },
  ]

  return (
    <nav className="bg-white shadow-ms border-b-2 border-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">
              EDO: Euler vs RK4
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 transition-all ${
                      isActive
                        ? 'bg-academic text-white font-semibold border-b-4 border-academic'
                        : 'text-neutral-700 hover:bg-primary-lighter hover:text-primary'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-neutral-600 hover:text-neutral-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
