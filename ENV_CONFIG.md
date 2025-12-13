# Configuración de Variables de Entorno

## Archivo `.env.local`

Este proyecto usa variables de entorno para configurar la URL del backend.

### Configuración Local

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` con tus valores:
   ```env
   VITE_BACKEND_URL=http://127.0.0.1:8000
   ```

### Variables Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_BACKEND_URL` | URL del servidor backend FastAPI | `http://127.0.0.1:8000` |

### Uso en el Código

Las variables de entorno se acceden con `import.meta.env`:

```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'
```

### Notas Importantes

- Las variables **DEBEN** empezar con `VITE_` para ser expuestas al cliente
- El archivo `.env.local` está en `.gitignore` (no se sube a Git)
- El archivo `.env.example` sirve como plantilla para otros desarrolladores
- Si cambias `.env.local`, reinicia el servidor de desarrollo (Vite)

### Entornos

**Desarrollo Local:**
```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

**Producción:**
```env
VITE_BACKEND_URL=https://tu-backend.com
```

**Docker/Contenedores:**
```env
VITE_BACKEND_URL=http://backend:8000
```
