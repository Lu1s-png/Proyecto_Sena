# MantenimientoExprés 🚗

Sistema integral de gestión de inspecciones preoperacionales y mantenimiento vehicular desarrollado con tecnologías modernas.

## 📋 Descripción

MantenimientoExprés es una aplicación web moderna que permite gestionar de manera eficiente la flota vehicular y el control de vencimientos de documentos importantes como RTM, SOAT y Revisiones Preventivas, con un sistema de notificaciones automáticas.

### ✨ Características Principales

- 🔐 **Sistema de Autenticación**: Login/registro con JWT y control por cargos
- 🚗 **Gestión de Vehículos**: CRUD completo para la flota vehicular
- 🔔 **Sistema de Notificaciones**: Control de vencimientos de RTM, SOAT y Revisiones Preventivas
- 👥 **Control de Cargos**: Administrador, Jefe de Operaciones, Jefe de Mantenimiento, Tecnico
- 🔍 **Búsqueda y Filtros**: Filtros avanzados para vehículos y notificaciones
- 📱 **Diseño Responsivo**: Compatible con desktop, tablet y móvil
- 🔒 **Seguridad**: Encriptación de contraseñas y tokens JWT seguros
- 📊 **Paginación**: Navegación eficiente entre grandes volúmenes de datos

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT (jsonwebtoken)** - Autenticación y autorización
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos
- **cors** - Manejo de CORS

### Frontend
- **React** - Biblioteca de interfaz de usuario
- **React Router DOM** - Navegación SPA
- **Lucide React** - Iconografía moderna
- **CSS3** - Estilos y animaciones responsivas

## 🚀 Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- [Git](https://git-scm.com/)

### 1. Clonar el Repositorio

```bash
git clone <https://github.com/Lu1s-png/MantenimientoExpres.git>
cd REQUERIMIENTO_LUIS
```

### 2. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con las siguientes variables:
```

Crear archivo `.env` en la carpeta `backend`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mantenimiento_expres
JWT_SECRET=tu_jwt_secret_muy_seguro
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### 3. Configurar el Frontend

```bash
# Navegar al directorio del frontend
cd ../frontend

# Instalar dependencias
npm install
```

### 4. Iniciar la Aplicación

#### Opción A: Iniciar manualmente

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Opción B: Script de inicio rápido

```bash
# Desde la raíz del proyecto
npm run dev
```

### 5. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👥 Cargos de Usuario

El sistema maneja cuatro tipos de cargos:

1. **Administrador**: Acceso completo al sistema y gestión de usuarios
2. **Jefe de Mantenimiento**: Supervisión general de la flota y reportes
3. **Tecnico**: Gestión de vehículos y control de vencimientos
4. **jefe de operaciones**: Consulta de notificaciones y acceso limitado

## 📖 Uso del Sistema

### Primer Acceso

1. Accede a http://localhost:3000
2. Regístrate como nuevo usuario
3. Inicia sesión con tus credenciales
4. Explora el dashboard principal

### Funcionalidades Principales

#### Gestión de Vehículos
- Registrar nuevos vehículos en la flota
- Editar información de vehículos existentes
- Consultar lista completa con búsqueda
- Control de estado activo/inactivo

#### Sistema de Notificaciones
- Crear notificaciones de vencimiento (RTM, SOAT, Revisión Preventiva)
- Marcar notificaciones como enviadas
- Filtrar por tipo, estado y fechas
- Paginación para grandes volúmenes de datos

#### Búsqueda y Filtros
- Buscar vehículos por número interno, placa, marca o modelo
- Filtrar notificaciones por tipo y estado
- Ordenar resultados por diferentes criterios
- Navegación eficiente con paginación

## 📁 Estructura del Proyecto

```
REQUERIMIENTO_LUIS/
├── backend/                 # Servidor Node.js
│   ├── middleware/         # Middlewares de autenticación
│   ├── models/            # Modelos de MongoDB
│   ├── routes/            # Rutas de la API
│   ├── services/          # Servicios (email, etc.)
│   ├── .env              # Variables de entorno
│   └── server.js         # Punto de entrada del servidor
├── frontend/              # Aplicación React
│   ├── public/           # Archivos públicos
│   ├── src/              # Código fuente
│   │   ├── components/   # Componentes reutilizables
│   │   ├── contexts/     # Contextos de React
│   │   ├── pages/        # Páginas principales
│   │   ├── App.js        # Componente principal
│   │   └── index.js      # Punto de entrada
│   └── package.json      # Dependencias del frontend
├── docs/                 # Documentación adicional
└── README.md            # Este archivo
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo
npm test           # Ejecutar pruebas
```

### Frontend
```bash
npm start          # Iniciar servidor de desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar pruebas
npm run eject      # Exponer configuración de Webpack
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a MongoDB**
   - Verificar que MongoDB esté ejecutándose
   - Revisar la URL de conexión en `.env`

2. **Error de autenticación de email**
   - Verificar credenciales en `.env`
   - Usar contraseña de aplicación para Gmail

3. **Puerto en uso**
   - Cambiar puerto en `.env` (backend) o `package.json` (frontend)

### Logs y Debugging

- Los logs del backend se muestran en la consola
- Usar herramientas de desarrollo del navegador para el frontend
- Revisar la pestaña Network para errores de API

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## 🔄 Actualizaciones

Para mantener el sistema actualizado:

```bash
# Actualizar dependencias del backend
cd backend && npm update

# Actualizar dependencias del frontend
cd frontend && npm update
```

---

**Desarrollado con ❤️ para optimizar la gestión de mantenimiento vehicular**