# CEA - Centro de Educación Ambiental

Plataforma web interactiva para educación ambiental, gestión de eventos ecológicos y puntos de reciclaje.

## 🌿 Características

- **Modo Oscuro/Claro**: Toggle visual para cambiar entre temas
- **Sistema de Autenticación**: Login unificado con distinción de roles (usuario/admin)
- **Gestión de Eventos**: Calendario interactivo de eventos ambientales
- **Puntos de Reciclaje**: Mapa y listado de centros de reciclaje
- **Chatbot Interactivo**: Asistente virtual para consultas
- **Panel de Administración**: Gestión de contenido para administradores
- **Recursos Educativos**: Videos y guías sobre huertos urbanos

## 🚀 Tecnologías

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Backend**: Appwrite (BaaS)
- **Estilos**: CSS Modules
- **Iconos**: React Icons

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta de Appwrite (cloud o self-hosted)

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/cea-react.git
cd cea-react
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env` y completa con tus credenciales de Appwrite:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=tu_project_id
VITE_APPWRITE_DATABASE_ID=tu_database_id
VITE_APPWRITE_RECYCLING_COLLECTION_ID=tu_recycling_collection_id
VITE_APPWRITE_EVENTS_COLLECTION_ID=tu_events_collection_id
VITE_APPWRITE_USERS_COLLECTION_ID=tu_users_collection_id
VITE_APPWRITE_API_KEY=tu_api_key
```

4. **Configurar Appwrite**

Crea las siguientes colecciones en tu proyecto de Appwrite:

**Colección `recycling_points`:**
- `name` (string)
- `address` (string)
- `schedule` (string)

**Colección `events`:**
- `title` (string)
- `date` (datetime)
- `description` (string)

**Colección `users`:**
- `userId` (string) - ID del usuario de Appwrite
- `email` (string)
- `name` (string)
- `role` (string) - "user" o "admin"

**Permisos recomendados:**
- `recycling_points` y `events`: Lectura pública, escritura solo para admins
- `users`: Lectura/escritura solo para el usuario propietario y admins

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
cea-react/
├── src/
│   ├── components/
│   │   ├── admin/          # Componentes de administración
│   │   ├── auth/           # Autenticación (Login, ProtectedRoute)
│   │   ├── chatbot/        # Chatbot interactivo
│   │   ├── common/         # Componentes reutilizables (Card, Hero, ThemeToggle)
│   │   ├── events/         # Calendario y lista de eventos
│   │   ├── layout/         # Header, Footer
│   │   └── location/       # Mapa de ubicación
│   ├── config/             # Configuración de Appwrite
│   ├── context/            # Context API (Auth, Theme)
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas de la aplicación
│   │   ├── admin/          # Páginas de administración
│   │   └── ...             # Páginas públicas
│   ├── styles/             # Estilos globales y variables
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── .env.example            # Template de variables de entorno
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Dependencias y scripts
└── vite.config.js          # Configuración de Vite
```

## 👥 Roles de Usuario

### Usuario Regular
- Ver eventos y puntos de reciclaje
- Acceder a recursos educativos
- Usar el chatbot
- Enviar mensajes de contacto

### Administrador
- Todas las funciones de usuario regular
- Acceder al panel de administración
- Gestionar eventos
- Gestionar puntos de reciclaje
- Ver estadísticas

## 🔐 Seguridad

- Las credenciales de Appwrite están en `.env` (no se suben a Git)
- Autenticación basada en sesiones de Appwrite
- Rutas protegidas por rol
- Validación de permisos en backend (Appwrite)

## 🛠️ Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción

## 📦 Despliegue

### Vercel / Netlify

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en el panel
3. El build se ejecutará automáticamente

### Variables de entorno en producción

Asegúrate de configurar todas las variables de `.env.example` en tu plataforma de despliegue.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

CEA - Centro de Educación Ambiental

---

**Nota**: Recuerda nunca subir tu archivo `.env` al repositorio. Usa `.env.example` como template.
