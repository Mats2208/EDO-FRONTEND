# EDOLab - Frontend

Plataforma interactiva con IA para visualizar y resolver Ecuaciones Diferenciales Ordinarias usando métodos numéricos Euler y Runge-Kutta RK4.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ y npm
- Backend FastAPI corriendo en `http://127.0.0.1:8000`

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

Ver [ENV_CONFIG.md](ENV_CONFIG.md) para más detalles sobre configuración de entornos.

### Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── chat/        # ChatBox con IA
│   ├── laboratory/  # Simulador y gráficos
│   ├── layout/      # Navbar, Footer, Layout
│   ├── shared/      # Botones, Cards, Inputs
│   ├── theory/      # Componentes teóricos
│   └── visualization/ # Campo de direcciones
├── pages/           # Páginas principales
│   ├── Home.jsx    # Página de inicio
│   ├── Theory.jsx  # Teoría de EDOs
│   ├── Laboratory.jsx # Laboratorio interactivo
│   ├── SolverIA.jsx   # Solver con IA ✨
│   ├── Problems.jsx   # Catálogo de problemas
│   └── About.jsx      # Acerca de
├── services/        # Servicios API
│   └── backendApi.js  # Comunicación con FastAPI
├── utils/           # Utilidades
│   ├── parser.js    # Parser de ecuaciones
│   └── solvers/     # Solvers numéricos
└── data/            # Datos estáticos

```

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
```

## 🎨 Tecnologías

- **React 19** - UI Library
- **Vite 7** - Build tool
- **TailwindCSS 3** - Estilos
- **Recharts** - Gráficos interactivos
- **KaTeX** - Renderizado de matemáticas
- **Math.js** - Parser de ecuaciones
- **React Router** - Navegación

## 🤖 Integración con IA

El frontend se comunica con el backend FastAPI que usa:
- **OpenRouter GPT-4** - Análisis de problemas en lenguaje natural
- **SymPy** - Soluciones analíticas de EDOs

## 📦 Backend Requerido

Este frontend requiere el backend FastAPI corriendo. Ver el README del backend en `../Comparativo-Euler-Runge-Kutta/`.

Endpoints usados:
- `POST /api/v1/chat` - Chat con IA
- `POST /api/v1/ode/analytic` - Solución analítica
- `POST /api/v1/ode/euler` - Método de Euler
- `POST /api/v1/ode/rk4` - Método Runge-Kutta RK4
- `POST /api/v1/ode/errors` - Análisis de errores

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
