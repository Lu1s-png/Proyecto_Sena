---
title: "Manual Técnico — <MantenimientoExprés>"
version: "v1.0"
date: "2025-11-09"
company: "<Empresa de transporte de pasajeros>"
project: "Manual Técnico"
format: "Markdown"
---

# Objetivo

- Documentar la arquitectura, instalación, configuración, APIs, base de datos, seguridad, despliegue y operación técnica del sistema.
- Facilitar el registro de inspecciones preoperacionales de la flota vehicular para transporte de pasajeros, ingreso fechas de vencimiento de RTM "Revisión Técnico-Mecánica", SOAT y Revisiones Preventivas para garantizar las alertas de dichas fechas.

# Arquitectura

- Visión de componentes y dependencias.
- Diagrama:
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐    MongoDB    ┌─────────────────┐
│                 │    Requests      │                 │   Protocol    │                 │
│   Frontend      │◄────────────────►│    Backend      │◄─────────────►│    Database     │
│   (React SPA)   │                  │   (Node.js API) │               │   (MongoDB)     │
│                 │                  │                 │               │                 │
└─────────────────┘                  └─────────────────┘               └─────────────────┘

```mermaid
arquitectura backend

Backend (Node.js + Express)
├── Capa de Presentación (Routes)
├── Capa de Lógica de Negocio (Controllers)
├── Capa de Servicios (Services)
├── Capa de Acceso a Datos (Models)
└── Capa de Infraestructura (Middleware, Config)
```

```mermaid
arquitectura frontend

Frontend (React)
├── Componentes de Presentación (UI Components)
├── Páginas (Page Components)
├── Contextos (State Management)
├── Servicios (API Calls)
└── Utilidades (Helpers)
```

## diccionario técnico

| Termino         | Descripción                                    |
|-----------------|------------------------------------------------|
| `Frontend`      | Interfaz visual del sistema accesible por el   |
|                 | usuario (React, HTML, CSS).                    |
| `Backend`       | Logica del servidor que procesa datos y        |
|                 | gestiona la base de datos.                     |
| `API`           | Interfaz de programación que permite la        |
|                 | comunicación entre sistemas.                   |
| `Base de datos` | Sistema para almacenar y consultar información |
|                 | estructurada.                                  |
| `Microservicio` | Componente independiente que realiza una       |
|                 |función estructurada.                           |

diccionario de tipos de datos en bases de datos

| Campo           | Tipo de dato| Descripción                                    |
|-----------------|-------------|------------------------------------------------|
| `ID`            | number      | identificador del vehiculo                     |
| `Placa`         | string      | placa del vehiculo                             |
| `Marca`         | string      | Marca del vehiculo                             |
| `Modelo`        | string      | año del vehiculo                               |
| `Tipo`          | string      | tipo de vehiculo (bus, vehiculo, ruta, vans)   |
| `fecha`         | date        | fecha de inspección                            |
| `activo`        | boolean     | estado operativo del vehiculo                  |
| `inspector`     | string      | nombre del inspector                           |
| `observaciones` | string      | comentarios o hallazgos                        |
| `estado general`| string      | Resultados (aprobados, con observaciones,      |
|                 |             | rechazos)                                      |
| `nombre`        | string      | nombre del usuario                             |
| `correo`        | string      | correo institucional                           |
| `rol`           | string      | Rol de usuario (admin, tecnico, jefe de        |
|                 |             | operaciones, jefe de mantenimiento)            |
| `activo`        | boolean     | estado del usuario                             |

## Diagramas específicos de Ecommerce

- Componentes principales:

![Componentes MantenimientoExprés]("REQUERIMIENTO_LUIS\documentacion\diagrams\Diagrama-componentes.png" "Componentes MantenimientoExprés")

- Flujo de datos completo (selección → carrito → pago → confirmación → inventario):

![Flujo de Datos MantenimientoExprés](..diagrams\Diagrama estilo Draw.jpg"Flujo de Datos MantenimientoExprés")

  - Búsqueda y filtrado:

    ![Secuencia Búsqueda](../diagrams/ecommerce-secuencia-busqueda.svg "Secuencia Búsqueda")

  - Gestión de cuentas de usuario:

    ![Secuencia Cuentas](..diagrams\gestion-cuentas.png "Secuencia Cuentas")

  - fechas de vencimiento y notificaciones

    ![Secuencia Cuentas](..diagrams\fechas de vencimiento.svg.png "Secuencia Cuentas")

# Requisitos del sistema

- Lenguajes y runtimes: `<React/CSS3/JavaScript>` y versiones mínimas.
- Bases de datos soportadas: `<Mongo DB Compas>` base de datos no relacionales
- Infraestructura: `<Netlify>` proyecto con carpetas dist o buil

# Instalación

```bash
git clone <https://github.com/Lu1s-png/MantenimientoExpres.git> && cd <REQUERIMIENTO_LUIS>
npm ci # o el gestor correspondiente
```

# Configuración

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mantenimiento_expres
JWT_SECRET=tu_jwt_secret_muy_seguro
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

# Base de Datos

Tablas principales de la base de datos:
  - expirationdates
  - inspections
  - user
  - vehicles


# Seguridad

Autenticación
   - JWT tokens con expiración
   - Hashing de contraseñas (bcrypt)
Autorización
   - Control de acceso basado en roles
   - Validación de permisos por endpoint
Validación
   - Sanitización de inputs
   - Validación de esquemas
   Comunicación
   - HTTPS en producción
   - CORS configurado


# Testing

- Pruebas unitarias con jest
- Pruebas de integración con Supertest
- CI con GitHub Action

# Backup y Recuperación

- Backup diario a las 11:00 pm
- Retención: 30 dias
- Pruebas de restauración mensuales
