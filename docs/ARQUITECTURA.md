# Arquitectura del Sistema MantenimientoExprés

## 🏗️ Visión General de la Arquitectura

MantenimientoExprés sigue una arquitectura de **separación de responsabilidades** con un backend API REST y un frontend SPA (Single Page Application).

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐    MongoDB    ┌─────────────────┐
│                 │    Requests      │                 │   Protocol    │                 │
│   Frontend      │◄────────────────►│    Backend      │◄─────────────►│    Database     │
│   (React SPA)   │                  │   (Node.js API) │               │   (MongoDB)     │
│                 │                  │                 │               │                 │
└─────────────────┘                  └─────────────────┘               └─────────────────┘
```

## 🎯 Arquitectura del Backend

### Estructura de Capas

```
Backend (Node.js + Express)
├── Capa de Presentación (Routes)
├── Capa de Lógica de Negocio (Controllers)
├── Capa de Servicios (Services)
├── Capa de Acceso a Datos (Models)
└── Capa de Infraestructura (Middleware, Config)
```

### Componentes Principales

#### 1. **Servidor Principal** (`server.js`)
- Configuración de Express
- Conexión a MongoDB
- Configuración de middleware global
- Definición de rutas principales

#### 2. **Modelos de Datos** (`/models`)
- **User.js**: Gestión de usuarios con campos nombres, cargo, email
- **Vehicle.js**: Información de vehículos con numeroInterno, placa, marca, tipo, modelo
- **Inspection.js**: Inspecciones preoperacionales
- **ExpirationDate.js**: Notificaciones de vencimiento (RTM, SOAT, Revisión Preventiva)

#### 3. **Rutas de API** (`/routes`)
- **auth.js**: Autenticación y autorización con JWT
- **vehicles.js**: CRUD de vehículos con validaciones
- **inspections.js**: CRUD de inspecciones
- **dates.js**: Gestión de fechas de vencimiento
- **notifications.js**: Sistema de notificaciones con paginación y filtros

#### 4. **Middleware** (`/middleware`)
- **auth.js**: Verificación de tokens JWT
- Validación de roles y permisos

#### 5. **Servicios** (`/services`)
- **notificationService.js**: Envío de emails y notificaciones

### Flujo de Datos Backend

```
Request → Routes → Middleware → Controllers → Services → Models → Database
                     ↓
Response ← JSON ← Business Logic ← Data Processing ← Query Results
```

## 🎨 Arquitectura del Frontend

### Estructura de Componentes

```
Frontend (React)
├── Componentes de Presentación (UI Components)
├── Páginas (Page Components)
├── Contextos (State Management)
├── Servicios (API Calls)
└── Utilidades (Helpers)
```

### Componentes Principales

#### 1. **Aplicación Principal** (`App.js`)
- Configuración de rutas
- Proveedor de contexto de autenticación
- Layout principal

#### 2. **Contextos** (`/contexts`)
- **AuthContext.js**: Estado global de autenticación
- Gestión de tokens y usuario actual

#### 3. **Páginas** (`/pages`)
- **Home.js**: Página de inicio
- **Login.js**: Autenticación
- **Register.js**: Registro de usuarios
- **Dashboard.js**: Panel principal
- **Inspections.js**: Gestión de inspecciones
- **Search.js**: Búsqueda avanzada
- **ExpirationDates.js**: Control de vencimientos
- **Notifications.js**: Centro de notificaciones

#### 4. **Componentes Reutilizables** (`/components`)
- **LoadingSpinner.js**: Indicador de carga
- **Navbar.js**: Navegación principal
- Componentes de UI comunes

### Flujo de Datos Frontend

```
User Interaction → Component → Context/State → API Call → Backend
                     ↓
UI Update ← State Update ← Response Processing ← JSON Response
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación JWT

```
1. Usuario envía credenciales
2. Backend valida credenciales
3. Backend genera JWT token
4. Frontend almacena token
5. Frontend incluye token en headers
6. Backend valida token en cada request
```

### Roles y Permisos

```
Administrador
├── Gestión completa de usuarios
├── Acceso a todas las funcionalidades
├── Configuración del sistema
└── Gestión de vehículos y notificaciones

Tecnicos
├── Supervisión general
├── Reportes y estadísticas
├── Gestión de vehículos
└── Acceso a notificaciones

Jefe de Mantenimiento
├── Gestión de inspecciones
├── Gestión de vehículos
├── Control de vencimientos
└── Supervisión de técnicos

Jefe de Operaciones
├── Consulta de información básica
├── Visualización de notificaciones
└── Acceso limitado al sistema
```

## 📊 Modelo de Datos

### Esquema de Base de Datos

```
Users Collection
├── _id (ObjectId)
├── nombres (String, required)
├── cargo (String, enum: Conductor|Jefe de Mantenimiento|Jefe de Operaciones|Administrador)
├── email (String, unique, required)
├── password (String, hashed, required)
├── activo (Boolean, default: true)
└── fechaCreacion (Date, default: now)

Vehicles Collection
├── _id (ObjectId)
├── numeroInterno (String, unique, required)
├── placa (String, unique, required, uppercase)
├── marca (String, required)
├── tipo (String, required)
├── modelo (String, required)
├── activo (Boolean, default: true)
└── fechaCreacion (Date, default: now)

Inspections Collection
├── _id (ObjectId)
├── vehicleId (ObjectId, ref: Vehicle)
├── inspectorId (ObjectId, ref: User)
├── fecha (Date)
├── tipoInspeccion (String)
├── estado (String)
├── observaciones (String)
├── items (Array of Objects)
└── timestamps

ExpirationDates Collection (Notificaciones)
├── _id (ObjectId)
├── vehiculo (ObjectId, ref: Vehicle, required)
├── numeroInterno (String, required)
├── placa (String, required)
├── tipo (String, enum: RTM|SOAT|Revisión Preventiva, required)
├── fechaVencimiento (Date, required)
├── notificacionEnviada (Boolean, default: false)
├── fechaNotificacion (Date)
├── usuario (ObjectId, ref: User, required)
├── activo (Boolean, default: true)
├── fechaCreacion (Date, default: now)
├── fechaActualizacion (Date, default: now)
└── usuarioActualizacion (ObjectId, ref: User)
```

### Relaciones entre Entidades

```
User (1) ──── (N) Inspection
Vehicle (1) ──── (N) Inspection
Vehicle (1) ──── (N) ExpirationDate
```

## 🔄 APIs y Endpoints

### Estructura de Endpoints

```
/api/auth
├── POST /register
├── POST /login
└── GET /profile

/api/vehicles
├── GET /
├── POST /
├── GET /:id
├── PUT /:id
└── DELETE /:id

/api/inspections
├── GET /
├── POST /
├── GET /:id
├── PUT /:id
├── DELETE /:id
└── GET /export

/api/dates
├── GET /
├── POST /
├── PUT /:id
├── DELETE /:id
└── GET /upcoming

/api/notifications
├── GET /
├── POST /send
└── PUT /:id/read
```

## 🚀 Despliegue y Escalabilidad

### Arquitectura de Despliegue

```
Production Environment
├── Frontend (Static Files)
│   ├── CDN/Web Server (Nginx)
│   └── Build optimizado
├── Backend (Node.js)
│   ├── Process Manager (PM2)
│   ├── Load Balancer
│   └── Multiple instances
└── Database (MongoDB)
    ├── Replica Set
    └── Backup automático
```

### Consideraciones de Escalabilidad

1. **Horizontal Scaling**
   - Múltiples instancias del backend
   - Load balancer para distribución

2. **Database Scaling**
   - MongoDB Replica Set
   - Sharding para grandes volúmenes

3. **Caching**
   - Redis para sesiones
   - Cache de consultas frecuentes

4. **CDN**
   - Distribución de assets estáticos
   - Optimización de imágenes

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación**
   - JWT tokens con expiración
   - Hashing de contraseñas (bcrypt)

2. **Autorización**
   - Control de acceso basado en roles
   - Validación de permisos por endpoint

3. **Validación**
   - Sanitización de inputs
   - Validación de esquemas

4. **Comunicación**
   - HTTPS en producción
   - CORS configurado

### Mejoras de Seguridad Recomendadas

1. Rate limiting
2. Validación de archivos subidos
3. Logging de seguridad
4. Monitoreo de intentos de acceso
5. Backup cifrado

## 📈 Monitoreo y Logging

### Logs del Sistema

```
Application Logs
├── Error logs (errores del sistema)
├── Access logs (requests HTTP)
├── Security logs (intentos de acceso)
└── Performance logs (métricas)
```

### Métricas Recomendadas

1. **Performance**
   - Tiempo de respuesta de APIs
   - Uso de memoria y CPU
   - Conexiones a base de datos

2. **Business**
   - Número de inspecciones por día
   - Usuarios activos
   - Notificaciones enviadas

3. **Errores**
   - Rate de errores 4xx/5xx
   - Fallos de conexión a DB
   - Timeouts de requests

---

Esta arquitectura proporciona una base sólida, escalable y mantenible para el sistema MantenimientoExprés.