---
title: "Guía de Instalación y Configuración"
version: "v1.0"
date: "2025-11-09"
company: "<Empresa de transporte de pasajeros>"
project: "Instalación"
format: "Markdown/PDF"
---

# Objetivo

- Proveer pasos claros para instalar, configurar y verificar el sistema en entornos locales y de pruebas, asegurando que los desarrolladores y técnicos puedan replicar el entorno correctamente.

# Requisitos previos

- SO: Windows 10/11, Linux o macOS.
- Herramientas: `git`, `Node >= 18` (se recomienda LTS), `Docker` (opcional).
- Accesos: repositorio rpivados, claves de entornos y endpoints autorizados.

# Instalación

```bash
git clone <https://github.com/Lu1s-png/MantenimientoExpres.git>
cd <REQUERIMIENTOS_LUIS>


Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- [Git](https://git-scm.com/)

# Configuración

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


# Verificación

```bash fronten
**Terminal 1 - frontend:**
```bash
cd REQUERIMIENTO_LUIS
cd frontend
npm start
curl http://localhost:3000
```

```bash fronten
**Terminal 2 - backtend:**
```bash
cd REQUERIMIENTO_LUIS
cd backend
npm start
curl http://localhost:5000
```