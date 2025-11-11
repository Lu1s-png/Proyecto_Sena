# Documentación de API - MantenimientoExprés

## 📋 Información General

**Base URL**: `http://localhost:5000/api`

**Formato de Respuesta**: JSON

**Autenticación**: JWT Token en header `Authorization: Bearer <token>`

## 🔐 Autenticación

### POST /auth/register

Registra un nuevo usuario en el sistema.

**Endpoint**: `POST /api/auth/register`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "nombres": "string",
  "cargo": "Tecnico|Jefe de Mantenimiento|Jefe de Operaciones|Administrador",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Respuesta Exitosa (201)**:
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "nombres": "Juan Pérez",
    "cargo": "Tecnico",
    "email": "juan@example.com"
  }
}
```

**Errores**:
- `400`: Datos inválidos, usuario ya existe, o validaciones fallidas
- `500`: Error interno del servidor

---

### POST /auth/login

Autentica un usuario existente.

**Endpoint**: `POST /api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "nombres": "Juan Pérez",
    "cargo": "Conductor",
    "email": "juan@example.com"
  }
}
```

**Errores**:
- `400`: Credenciales inválidas o validaciones fallidas
- `500`: Error interno del servidor

---

### GET /auth/profile

Obtiene el perfil del usuario autenticado.

**Endpoint**: `GET /api/auth/profile`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "tecnico",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores**:
- `401`: Token inválido o expirado
- `500`: Error interno del servidor

## 🚗 Vehículos

### GET /vehicles

Obtiene la lista de todos los vehículos activos.

**Endpoint**: `GET /api/vehicles`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "numeroInterno": "VEH001",
    "placa": "ABC123",
    "marca": "Toyota",
    "tipo": "Camión",
    "modelo": "Hilux",
    "activo": true,
    "fechaCreacion": "2024-01-15T10:30:00.000Z"
  }
]
```

**Errores**:
- `401`: Token inválido o expirado
- `500`: Error interno del servidor

---

### GET /vehicles/:id

Obtiene un vehículo específico por ID.

**Endpoint**: `GET /api/vehicles/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "numeroInterno": "VEH001",
  "placa": "ABC123",
  "marca": "Toyota",
  "tipo": "Camión",
  "modelo": "Hilux",
  "activo": true,
  "fechaCreacion": "2024-01-15T10:30:00.000Z"
}
```

**Errores**:
- `401`: Token inválido o expirado
- `404`: Vehículo no encontrado
- `500`: Error interno del servidor

---

### POST /vehicles

Crea un nuevo vehículo. **Requiere permisos de Jefe de Mantenimiento o Técnico**.

**Endpoint**: `POST /api/vehicles`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "numeroInterno": "string",
  "placa": "string",
  "marca": "string",
  "tipo": "string",
  "modelo": "string"
}
```

**Respuesta Exitosa (201)**:
```json
{
  "message": "Vehículo creado exitosamente",
  "vehicle": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "numeroInterno": "VEH001",
    "placa": "ABC123",
    "marca": "Toyota",
    "tipo": "Camión",
    "modelo": "Hilux",
    "activo": true,
    "fechaCreacion": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores**:
- `400`: Datos inválidos, validaciones fallidas, o vehículo ya existe
- `401`: Token inválido o expirado
- `403`: Sin permisos suficientes
- `500`: Error interno del servidor

---

### PUT /vehicles/:id

Actualiza un vehículo existente. **Requiere permisos de Jefe de Mantenimiento o Técnico**.

**Endpoint**: `PUT /api/vehicles/:id`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "numeroInterno": "string",
  "placa": "string",
  "marca": "string",
  "tipo": "string",
  "modelo": "string"
}
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Vehículo actualizado exitosamente",
  "vehicle": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "numeroInterno": "VEH001",
    "placa": "ABC123",
    "marca": "Toyota",
    "tipo": "Camión",
    "modelo": "Hilux",
    "activo": true,
    "fechaCreacion": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores**:
- `400`: Datos inválidos o validaciones fallidas
- `401`: Token inválido o expirado
- `403`: Sin permisos suficientes
- `404`: Vehículo no encontrado
- `500`: Error interno del servidor

---

### DELETE /vehicles/:id

Desactiva un vehículo (eliminación lógica). **Requiere permisos de Jefe de Mantenimiento o Técnico**.

**Endpoint**: `DELETE /api/vehicles/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Vehículo eliminado exitosamente"
}
```

**Errores**:
- `401`: Token inválido o expirado
- `403`: Sin permisos suficientes
- `404`: Vehículo no encontrado
- `500`: Error interno del servidor

## 🔔 Notificaciones

### GET /notifications

Obtiene las notificaciones con paginación y filtros.

**Endpoint**: `GET /api/notifications`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `tipo` (opcional): Filtrar por tipo (RTM, SOAT, Revisión Preventiva)
- `prioridad` (opcional): Filtrar por prioridad
- `estado` (opcional): Filtrar por estado (leida, no_leida)
- `fechaDesde` (opcional): Fecha desde (YYYY-MM-DD)
- `fechaHasta` (opcional): Fecha hasta (YYYY-MM-DD)

**Respuesta Exitosa (200)**:
```json
{
  "notifications": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "vehiculo": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "numeroInterno": "VEH001",
        "placa": "ABC123",
        "marca": "Toyota",
        "tipo": "Camión",
        "modelo": "Hilux",
        "activo": true,
        "fechaCreacion": "2024-01-15T10:30:00.000Z"
      },
      "numeroInterno": "VEH001",
      "placa": "ABC123",
      "tipo": "RTM",
      "fechaVencimiento": "2024-02-15T00:00:00.000Z",
      "notificacionEnviada": false,
      "usuario": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "nombres": "Juan Pérez",
        "cargo": "Conductor"
      },
      "activo": true,
      "fechaCreacion": "2024-01-15T10:30:00.000Z",
      "fechaActualizacion": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Errores**:
- `401`: Token inválido o expirado
- `500`: Error interno del servidor

---

### GET /notifications/pending

Obtiene las notificaciones pendientes (próximas a vencer).

**Endpoint**: `GET /api/notifications/pending`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `days` (opcional): Días de anticipación (default: 30)

**Respuesta Exitosa (200)**:
```json
{
  "notifications": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "vehiculo": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "numeroInterno": "VEH001",
        "placa": "ABC123",
        "marca": "Toyota",
        "tipo": "Camión",
        "modelo": "Hilux"
      },
      "tipo": "RTM",
      "fechaVencimiento": "2024-02-15T00:00:00.000Z",
      "diasRestantes": 15,
      "prioridad": "alta"
    }
  ],
  "total": 5
}
```

---

### GET /notifications/history

Obtiene el historial de notificaciones enviadas.

**Endpoint**: `GET /api/notifications/history`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)

**Respuesta Exitosa (200)**:
```json
{
  "notifications": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "vehiculo": {
        "numeroInterno": "VEH001",
        "placa": "ABC123"
      },
      "tipo": "RTM",
      "fechaVencimiento": "2024-02-15T00:00:00.000Z",
      "fechaNotificacion": "2024-01-15T10:30:00.000Z",
      "notificacionEnviada": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### POST /notifications/:id/mark-sent

Marca una notificación como enviada.

**Endpoint**: `POST /api/notifications/:id/mark-sent`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Notificación marcada como enviada",
  "notification": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "notificacionEnviada": true,
    "fechaNotificacion": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores**:
- `401`: Token inválido o expirado
- `404`: Notificación no encontrada
- `500`: Error interno del servidor

## 📝 Inspecciones

### GET /inspections

Obtiene la lista de inspecciones.

**Endpoint**: `GET /api/inspections`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (opcional): Número de página
- `limit` (opcional): Elementos por página
- `placa` (opcional): Filtrar por placa
- `conductor` (opcional): Filtrar por conductor
- `estado` (opcional): Filtrar por estado
- `fechaDesde` (opcional): Fecha desde (YYYY-MM-DD)
- `fechaHasta` (opcional): Fecha hasta (YYYY-MM-DD)

**Respuesta Exitosa (200)**:
```json
{
  "inspections": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "vehicleId": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "placa": "ABC123",
        "conductor": "Juan Pérez"
      },
      "inspectorId": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "username": "johndoe"
      },
      "fecha": "2024-01-15T08:00:00.000Z",
      "tipoInspeccion": "Preoperacional",
      "estado": "Completada",
      "kilometraje": 45000,
      "observaciones": "Vehículo en buen estado",
      "items": [
        {
          "categoria": "Motor",
          "item": "Nivel de aceite",
          "estado": "Conforme",
          "observacion": ""
        }
      ]
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "totalInspections": 25
}
```

---

### POST /inspections

Crea una nueva inspección.

**Endpoint**: `POST /api/inspections`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "vehicleId": "string",
  "fecha": "2024-01-15T08:00:00.000Z",
  "tipoInspeccion": "string",
  "kilometraje": "number",
  "observaciones": "string",
  "items": [
    {
      "categoria": "string",
      "item": "string",
      "estado": "Conforme|No Conforme",
      "observacion": "string"
    }
  ]
}
```

**Respuesta Exitosa (201)**:
```json
{
  "message": "Inspección creada exitosamente",
  "inspection": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "vehicleId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "inspectorId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fecha": "2024-01-15T08:00:00.000Z",
    "tipoInspeccion": "Preoperacional",
    "estado": "Completada",
    "kilometraje": 45000,
    "observaciones": "Vehículo en buen estado",
    "items": [...]
  }
}
```

---

### GET /inspections/:id

Obtiene una inspección específica.

**Endpoint**: `GET /api/inspections/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "inspection": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "vehicleId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "placa": "ABC123",
      "marca": "Toyota",
      "modelo": "Corolla",
      "conductor": "Juan Pérez"
    },
    "inspectorId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "fecha": "2024-01-15T08:00:00.000Z",
    "tipoInspeccion": "Preoperacional",
    "estado": "Completada",
    "kilometraje": 45000,
    "observaciones": "Vehículo en buen estado",
    "items": [...]
  }
}
```

---

### PUT /inspections/:id

Actualiza una inspección existente.

**Endpoint**: `PUT /api/inspections/:id`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**: Mismo formato que POST

**Respuesta Exitosa (200)**:
```json
{
  "message": "Inspección actualizada exitosamente",
  "inspection": {...}
}
```

---

### DELETE /inspections/:id

Elimina una inspección.

**Endpoint**: `DELETE /api/inspections/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Inspección eliminada exitosamente"
}
```

---

### GET /inspections/export

Exporta inspecciones a Excel.

**Endpoint**: `GET /api/inspections/export`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**: Mismos filtros que GET /inspections

**Respuesta Exitosa (200)**:
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Archivo Excel descargable

## 📅 Fechas de Vencimiento

### GET /dates

Obtiene fechas de vencimiento.

**Endpoint**: `GET /api/dates`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `tipo` (opcional): RTM|SOAT|RevisionPreventiva
- `upcoming` (opcional): true para próximos vencimientos

**Respuesta Exitosa (200)**:
```json
{
  "dates": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "vehicleId": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "placa": "ABC123",
        "conductor": "Juan Pérez"
      },
      "tipo": "RTM",
      "fechaVencimiento": "2024-06-15T00:00:00.000Z",
      "fechaNotificacion": "2024-05-15T00:00:00.000Z",
      "estado": "Vigente",
      "observaciones": "Renovar antes del vencimiento"
    }
  ]
}
```

---

### POST /dates

Crea una nueva fecha de vencimiento.

**Endpoint**: `POST /api/dates`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "vehicleId": "string",
  "tipo": "RTM|SOAT|RevisionPreventiva",
  "fechaVencimiento": "2024-06-15T00:00:00.000Z",
  "observaciones": "string"
}
```

**Respuesta Exitosa (201)**:
```json
{
  "message": "Fecha de vencimiento creada exitosamente",
  "date": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "vehicleId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "tipo": "RTM",
    "fechaVencimiento": "2024-06-15T00:00:00.000Z",
    "fechaNotificacion": "2024-05-15T00:00:00.000Z",
    "estado": "Vigente",
    "observaciones": "Renovar antes del vencimiento"
  }
}
```

---

### PUT /dates/:id

Actualiza una fecha de vencimiento.

**Endpoint**: `PUT /api/dates/:id`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**: Mismo formato que POST

**Respuesta Exitosa (200)**:
```json
{
  "message": "Fecha de vencimiento actualizada exitosamente",
  "date": {...}
}
```

---

### DELETE /dates/:id

Elimina una fecha de vencimiento.

**Endpoint**: `DELETE /api/dates/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Fecha de vencimiento eliminada exitosamente"
}
```

---

### GET /dates/upcoming

Obtiene vencimientos próximos (próximos 30 días).

**Endpoint**: `GET /api/dates/upcoming`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "upcomingDates": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "vehicleId": {
        "placa": "ABC123",
        "conductor": "Juan Pérez"
      },
      "tipo": "RTM",
      "fechaVencimiento": "2024-02-15T00:00:00.000Z",
      "diasRestantes": 15,
      "estado": "Próximo a vencer"
    }
  ]
}
```

## 🔔 Notificaciones

### GET /notifications

Obtiene notificaciones del usuario.

**Endpoint**: `GET /api/notifications`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `leida` (opcional): true|false
- `tipo` (opcional): Filtrar por tipo

**Respuesta Exitosa (200)**:
```json
{
  "notifications": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "titulo": "Vencimiento próximo",
      "mensaje": "El RTM del vehículo ABC123 vence en 7 días",
      "tipo": "vencimiento",
      "leida": false,
      "fechaCreacion": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### POST /notifications/send

Envía una nueva notificación.

**Endpoint**: `POST /api/notifications/send`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body**:
```json
{
  "userId": "string",
  "titulo": "string",
  "mensaje": "string",
  "tipo": "string"
}
```

**Respuesta Exitosa (201)**:
```json
{
  "message": "Notificación enviada exitosamente",
  "notification": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "titulo": "Vencimiento próximo",
    "mensaje": "El RTM del vehículo ABC123 vence en 7 días",
    "tipo": "vencimiento",
    "leida": false,
    "fechaCreacion": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### PUT /notifications/:id/read

Marca una notificación como leída.

**Endpoint**: `PUT /api/notifications/:id/read`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "message": "Notificación marcada como leída",
  "notification": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "leida": true,
    "fechaLectura": "2024-01-15T11:30:00.000Z"
  }
}
```

## 📊 Estadísticas

### GET /stats/dashboard

Obtiene estadísticas para el dashboard.

**Endpoint**: `GET /api/stats/dashboard`

**Headers**:
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200)**:
```json
{
  "stats": {
    "totalInspections": 150,
    "pendingInspections": 5,
    "upcomingExpirations": 8,
    "unreadNotifications": 3,
    "monthlyInspections": [
      {"month": "Enero", "count": 25},
      {"month": "Febrero", "count": 30}
    ],
    "inspectionsByStatus": {
      "Completada": 120,
      "Pendiente": 20,
      "Rechazada": 10
    }
  }
}
```

## ❌ Códigos de Error

### Códigos HTTP Comunes

- **200**: OK - Solicitud exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos
- **401**: Unauthorized - Token inválido o faltante
- **403**: Forbidden - Sin permisos suficientes
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

### Formato de Respuesta de Error

```json
{
  "error": "Descripción del error",
  "message": "Mensaje detallado del error",
  "code": "ERROR_CODE"
}
```

## 🔒 Autenticación y Autorización

### Headers Requeridos

Para endpoints protegidos:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Roles y Permisos

- **admin**: Acceso completo a todos los endpoints
- **jefe de mantenimiento y tecnico**: Acceso a inspecciones, vehículos, fechas y notificaciones
- **jefe de operaciones**: Acceso limitado a crear/ver inspecciones y actualizar fechas

### Expiración de Tokens

Los tokens JWT expiran en 24 horas. Después de la expiración, se debe realizar login nuevamente.

---

**Documentación actualizada**: Enero 2024  
**Versión de API**: 1.0.0