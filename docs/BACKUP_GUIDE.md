# Guía de Respaldo y Restauración

Esta guía describe cómo instalar, configurar y usar el módulo de respaldo local, además de pruebas y solución de problemas.

## Instalación

- Requisitos: Windows con PowerShell disponible.
- Desde la raíz del proyecto:

```
cd tools/backup
npm install
```

## Configuración

- Parámetros principales del comando de respaldo (`npm run backup` o `node src/backup.js`):
  - `--out=<ruta>`: Carpeta raíz donde se guardarán los respaldos (default `./backups`).
  - `--configPaths=<lista>`: Rutas de archivos de configuración críticos, separadas por coma.
  - `--projectDirs=<lista>`: Directorios específicos del proyecto a respaldar, separados por coma.
  - `--mongoUri=<uri>`: URI de MongoDB para respaldo lógico de datos (opcional).
  - `--minFreeBytes=<n>`: Mínimo de bytes libres requeridos para ejecutar respaldo.

- Parámetros de restauración (`npm run restore` o `node src/restore.js`):
  - `--archive=<ruta.zip>`: Archivo ZIP creado por el respaldo.
  - `--dest=<ruta>`: Directorio destino para restaurar.
  - `--mongoUri=<uri>`: URI de MongoDB para restauración de datos (opcional).

## Uso Básico

Ejemplo de respaldo típico:

```
node src/backup.js --out=../../backups \
  --configPaths=../../backend/.env,../../backend/server.js \
  --projectDirs=../../backend/routes,../../frontend/src \
  --mongoUri="mongodb://localhost:27017/mi_db"
```

Ejemplo de restauración:

```
node src/restore.js --archive=../../backups/backup-YYYY-MM-DDTHH-MM-SS-sssZ/backup-YYYY-MM-DDTHH-MM-SS-sssZ.zip \
  --dest=../../restored \
  --mongoUri="mongodb://localhost:27017/mi_db"
```

## Uso Avanzado

- Validar espacio en disco antes del respaldo:

```
node src/backup.js --minFreeBytes=5000000000 --configPaths=... --projectDirs=...
```

- Respaldo sin base de datos (omitir `--mongoUri`).

## Pruebas Automatizadas

Ejecutar pruebas y generar cobertura:

```
npm test
```

- Las pruebas validan:
  - Integridad de archivos tras compresión y expansión.
  - Obtención de espacio libre en disco.
  - (Opcional) Respaldo y restauración de Mongo si se proporciona `MONGO_URI`.

## Solución de Problemas

- `Fallo al comprimir`:
  - Verifique que PowerShell esté disponible y que los comandos `Compress-Archive`/`Expand-Archive` funcionen.

- `Espacio insuficiente`:
  - Ajuste `--minFreeBytes` o libere espacio en la unidad destino.

- `Respaldo de DB falló`:
  - Confirme la accesibilidad de `MONGO_URI` y credenciales.

- Permisos:
  - Ejecute la terminal como usuario con permisos de lectura de las rutas configuradas y escritura en el directorio de salida.