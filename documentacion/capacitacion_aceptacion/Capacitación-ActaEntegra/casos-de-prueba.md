---
title: "Caso de Prueba"
version: "v1.0"
date: "2025-11-06"
company: "<Empresa>"
project: "UAT"
format: "Markdown"
---

# Identificación

- ID: `<UAT-001>`
- Título: `<Registro exitoso de inspección preoperacional>`
- Prioridad: `<Alta>`

# Precondiciones

- `<usuarios con rol de tecnico registrado>`
- `<Vehiculo activo con placa registrada en el sistema>`
- `<Fecha actual dentro del rango permitido para inspecciones>`

# Pasos

1. `<iniciar sesión como tecnico>`
2. `<Navegar al módulo "inspecciones">`
3. `<Ingresar la placa del vehiculo>`
4. `<Completar todos los campos del formulario con estado general "aprobado">`
5. `<Guardar y confirmar el registro>`

# Resultado esperado

- `<El sistema guarda la inspección sin errores>`
- `<Se muestra mensaje de confirmación: "inspección registrada correctamente">`
- `<El registro aparece Registro recientes>`
