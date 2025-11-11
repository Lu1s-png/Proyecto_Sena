# Guía de Usuario - MantenimientoExprés

## 📖 Introducción

Esta guía te ayudará a utilizar todas las funcionalidades del sistema MantenimientoExprés de manera eficiente. El sistema está diseñado para ser intuitivo y fácil de usar.

## 🚀 Primeros Pasos

### 1. Acceso al Sistema

1. Abre tu navegador web
2. Navega a: `http://localhost:3000`
3. Verás la página de inicio del sistema

### 2. Registro de Usuario

Si es tu primera vez usando el sistema:

1. Haz clic en **"Registrarse"**
2. Completa el formulario:
   - **Nombres**: Tu nombre completo
   - **Email**: Tu dirección de correo electrónico (único en el sistema)
   - **Cargo**: Selecciona tu cargo (Conductor, Jefe de Mantenimiento, Jefe de Operaciones, Administrador)
   - **Contraseña**: Mínimo 6 caracteres
   - **Confirmar contraseña**: Debe coincidir exactamente
3. Haz clic en **"Registrarse"**

### 3. Inicio de Sesión

1. Haz clic en **"Iniciar Sesión"**
2. Ingresa tu **email** y **contraseña**
3. Haz clic en **"Iniciar Sesión"**

## 🏠 Dashboard Principal

Una vez que inicies sesión, verás el dashboard principal que incluye:

### Menú de Navegación
- **Vehículos**: Gestión completa de la flota vehicular
- **Notificaciones**: Sistema de alertas y vencimientos
- **Perfil**: Configuración de tu cuenta personal

### Funcionalidades Principales
- **Gestión de Vehículos**: Registro, edición y consulta de vehículos
- **Sistema de Notificaciones**: Control de vencimientos de RTM, SOAT y Revisiones Preventivas
- **Autenticación Segura**: Sistema de login con JWT
- **Interfaz Responsiva**: Compatible con dispositivos móviles y escritorio

## 🚗 Gestión de Vehículos

### Registrar Nuevo Vehículo

1. Haz clic en **"Vehículos"** en el menú principal
2. Haz clic en **"Agregar Vehículo"**
3. Completa el formulario:
   - **Número Interno**: Código único del vehículo en la empresa
   - **Placa**: Placa del vehículo (se convierte automáticamente a mayúsculas)
   - **Marca**: Marca del vehículo (ej: Toyota, Chevrolet)
   - **Tipo**: Tipo de vehículo (ej: Camión, Automóvil, Motocicleta)
   - **Modelo**: Modelo específico del vehículo
4. Haz clic en **"Guardar"**

### Ver Lista de Vehículos

La lista de vehículos muestra:
- **Número Interno**
- **Placa**
- **Marca y Modelo**
- **Tipo de vehículo**
- **Estado** (Activo/Inactivo)
- **Acciones disponibles** (Ver, Editar, Eliminar)

### Buscar Vehículos

Utiliza la barra de búsqueda para encontrar vehículos por:
- Número interno
- Placa
- Marca
- Modelo

## 🔔 Sistema de Notificaciones

### Crear Nueva Notificación

1. Haz clic en **"Notificaciones"** en el menú principal
2. Haz clic en **"Agregar Notificación"**
3. Completa el formulario:
   - **Vehículo**: Selecciona el vehículo de la lista
   - **Tipo**: Selecciona el tipo de vencimiento:
     - **RTM**: Revisión Técnico Mecánica
     - **SOAT**: Seguro Obligatorio de Accidentes de Tránsito
     - **Revisión Preventiva**: Mantenimiento preventivo
   - **Fecha de Vencimiento**: Fecha cuando vence el documento
4. Haz clic en **"Guardar"**

### Ver Notificaciones

1. Haz clic en **"Notificaciones"** en el menú
2. Verás la lista de todas las notificaciones con:
   - **Información del vehículo** (número interno, placa)
   - **Tipo de vencimiento**
   - **Fecha de vencimiento**
   - **Estado de notificación** (Enviada/Pendiente)
   - **Usuario responsable**

### Filtrar Notificaciones

Utiliza los filtros disponibles:
- **Por tipo**: RTM, SOAT, Revisión Preventiva
- **Por estado**: Enviadas, Pendientes
- **Por fecha**: Rango de fechas de vencimiento
- **Por vehículo**: Buscar por placa o número interno

### Marcar Notificación como Enviada

1. En la lista de notificaciones, encuentra la notificación pendiente
2. Haz clic en **"Marcar como Enviada"**
3. La notificación cambiará su estado automáticamente

## 📅 Control de Fechas de Vencimiento

### Tipos de Vencimientos

El sistema controla tres tipos principales:
- **RTM (Revisión Técnico Mecánica)**
- **SOAT (Seguro Obligatorio de Accidentes de Tránsito)**
- **Revisiones Preventivas**

### Agregar Nueva Fecha de Vencimiento

1. Haz clic en **"Fechas de Vencimiento"**
2. Haz clic en **"Agregar Nueva Fecha"**
3. Completa el formulario:
   - **Placa del vehículo**
   - **Tipo de vencimiento**
   - **Fecha de vencimiento**
   - **Observaciones** (opcional)
4. Haz clic en **"Guardar"**

### Ver Vencimientos Próximos

1. En **"Fechas de Vencimiento"**, verás:
   - **Vencimientos de hoy** (en rojo)
   - **Próximos 7 días** (en naranja)
   - **Próximos 30 días** (en amarillo)
   - **Futuros** (en verde)

### Actualizar Fecha de Vencimiento

1. Encuentra la fecha que necesitas actualizar
2. Haz clic en **"Editar"**
3. Modifica la fecha de vencimiento
4. Haz clic en **"Actualizar"**

### Exportar Reporte de Vencimientos

1. En la página de vencimientos
2. Haz clic en **"Exportar a Excel"**
3. El reporte incluirá todas las fechas próximas a vencer

## 🔔 Sistema de Notificaciones

### Ver Notificaciones

1. Haz clic en **"Notificaciones"** en el menú
2. Verás todas tus notificaciones organizadas por:
   - **No leídas** (destacadas)
   - **Leídas** (atenuadas)

### Tipos de Notificaciones

- **Vencimientos próximos**: RTM, SOAT, Revisiones
- **Inspecciones pendientes**: Recordatorios de inspecciones
- **Alertas del sistema**: Mensajes importantes
- **Actualizaciones**: Cambios en el sistema

### Marcar como Leída

1. Haz clic en una notificación
2. Automáticamente se marcará como leída
3. O usa el botón **"Marcar como leída"**

### Eliminar Notificaciones

1. Selecciona las notificaciones que deseas eliminar
2. Haz clic en **"Eliminar seleccionadas"**
3. Confirma la acción

### Filtrar Notificaciones

Usa los filtros disponibles:
- **Todas**: Mostrar todas las notificaciones
- **No leídas**: Solo notificaciones pendientes
- **Por tipo**: Filtrar por tipo específico
- **Por fecha**: Rango de fechas

## 👥 Gestión por Cargos

### jefe de operaciones

**Permisos**:
- ✅ Ver notificaciones asignadas
- ✅ Consultar información de vehículos
- ✅ Acceso limitado al sistema
- ❌ Crear o editar vehículos
- ❌ Gestionar notificaciones
- ❌ Administrar usuarios

**Flujo de trabajo típico**:
1. Consultar notificaciones de vencimientos
2. Revisar información de vehículos asignados
3. Reportar novedades al supervisor

### Jefe de Mantenimiento

**Permisos**:
- ✅ Gestión completa de vehículos
- ✅ Crear y gestionar notificaciones
- ✅ Control de vencimientos (RTM, SOAT, Revisiones)
- ✅ Supervisión de conductores
- ❌ Gestionar usuarios del sistema

**Flujo de trabajo típico**:
1. Registrar nuevos vehículos en la flota
2. Crear notificaciones de vencimientos
3. Supervisar el estado de documentos
4. Coordinar mantenimientos preventivos

### Técnico

**Permisos**:
- ✅ Supervisión general de la flota
- ✅ Acceso a reportes y estadísticas
- ✅ Gestión de vehículos
- ✅ Control de notificaciones
- ❌ Gestionar usuarios del sistema

**Flujo de trabajo típico**:
1. Supervisar operaciones de la flota
2. Revisar reportes de vencimientos
3. Coordinar con mantenimiento
4. Tomar decisiones operativas

### Administrador

**Permisos**:
- ✅ Acceso completo al sistema
- ✅ Gestionar usuarios y cargos
- ✅ Configuración del sistema
- ✅ Todas las funcionalidades disponibles
- ✅ Eliminar registros del sistema

**Flujo de trabajo típico**:
1. Gestionar usuarios del sistema
2. Configurar parámetros generales
3. Supervisar uso del sistema
4. Mantener integridad de datos
5. Realizar respaldos y mantenimiento

## 📊 Consultas y Filtros

### Consulta de Vehículos

1. **Lista Completa**: Ve todos los vehículos registrados
2. **Búsqueda**: Filtra por número interno, placa, marca o modelo
3. **Estado**: Filtra vehículos activos o inactivos
4. **Ordenamiento**: Ordena por cualquier columna

### Consulta de Notificaciones

1. **Vista General**: Todas las notificaciones del sistema
2. **Filtros Disponibles**:
   - Por tipo de vencimiento (RTM, SOAT, Revisión Preventiva)
   - Por estado (Enviadas, Pendientes)
   - Por rango de fechas
   - Por vehículo específico
3. **Paginación**: Navega entre páginas de resultados
4. **Búsqueda**: Busca por placa o número interno

### Información Detallada

- **Vehículos**: Información completa de cada vehículo
- **Notificaciones**: Detalles de vencimientos con datos del vehículo y usuario responsable
- **Historial**: Seguimiento de cambios y actualizaciones

## 🔧 Configuración Personal

### Ver Perfil de Usuario

1. Haz clic en **"Perfil"** en el menú principal
2. Verás tu información personal:
   - **Nombres**: Tu nombre completo
   - **Email**: Tu dirección de correo electrónico
   - **Cargo**: Tu cargo en la empresa
   - **Estado**: Activo/Inactivo

### Cerrar Sesión

1. Haz clic en **"Cerrar Sesión"** en el menú
2. Serás redirigido a la página de inicio de sesión
3. Tu sesión se cerrará de forma segura

### Seguridad de la Cuenta

- Las contraseñas están encriptadas en el sistema
- Las sesiones utilizan tokens JWT seguros
- El sistema registra la fecha de creación de cada cuenta

## ❓ Preguntas Frecuentes

### ¿Cómo recupero mi contraseña?

Actualmente, contacta al administrador del sistema para restablecer tu contraseña.

### ¿Puedo usar el sistema en mi móvil?

Sí, el sistema es completamente responsivo y funciona en dispositivos móviles.

### ¿Los datos se guardan automáticamente?

Debes hacer clic en "Guardar" para que los cambios se almacenen permanentemente.

### ¿Puedo trabajar sin conexión a internet?

No, el sistema requiere conexión a internet para funcionar correctamente.

### ¿Cómo reporto un problema?

Contacta al administrador del sistema o al equipo de soporte técnico.

## 📞 Soporte Técnico

Para asistencia técnica:
- **Email**: soporte@mantenimientoexpres.com
- **Teléfono**: +57 (1) 234-5678
- **Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

---

**¡Gracias por usar MantenimientoExprés!** 🚗✨