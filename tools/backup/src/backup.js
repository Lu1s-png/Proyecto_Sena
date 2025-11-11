#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { Logger } = require('./lib/logger');
const { getFreeBytes } = require('./lib/disk');
const { ensureDir, copyRecursive, sumSizes } = require('./lib/fsutils');
const { compressDirectory } = require('./lib/compress');
const { backupMongo } = require('./lib/db');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const [k, v] = argv[i].split('=');
    const key = k.replace(/^--/, '');
    args[key] = v === undefined ? true : v;
  }
  return args;
}

async function run() {
  const args = parseArgs(process.argv);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outRoot = args.out || path.join(process.cwd(), 'backups');
  const outDir = path.join(outRoot, `backup-${timestamp}`);
  const logPath = path.join(outDir, 'logs', 'backup.log');
  const logger = new Logger(logPath);

  try {
    logger.info('Iniciando proceso de respaldo');
    ensureDir(outDir);

    const configPaths = (args.configPaths || '').split(',').filter(Boolean);
    const projectDirs = (args.projectDirs || '').split(',').filter(Boolean);
    const mongoUri = args.mongoUri || process.env.MONGO_URI || (fs.existsSync(path.join(process.cwd(), 'backend', '.env')) ? require('dotenv').config({ path: path.join(process.cwd(), 'backend', '.env') }).parsed?.MONGO_URI : undefined);
    const minFree = args.minFreeBytes ? parseInt(args.minFreeBytes, 10) : 0;

    const stagingDir = path.join(outDir, 'staging');
    ensureDir(stagingDir);

    const allPaths = [...configPaths, ...projectDirs];
    const estimatedSize = sumSizes(allPaths);
    const freeBytes = getFreeBytes(outDir);
    logger.info(`Espacio libre en disco: ${freeBytes} bytes`);
    logger.info(`Tamaño estimado de respaldo: ${estimatedSize} bytes`);

    if (minFree && freeBytes < minFree) {
      throw new Error(`Espacio insuficiente: libre=${freeBytes}, requerido(minFree)=${minFree}`);
    }
    if (freeBytes < estimatedSize * 1.2) {
      throw new Error(`Espacio insuficiente para respaldo (requiere ~20% adicional): libre=${freeBytes}, estimado=${estimatedSize}`);
    }

    // Copiar archivos y directorios
    for (const p of allPaths) {
      if (!p) continue;
      const abs = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
      if (!fs.existsSync(abs)) {
        logger.warn(`Ruta no encontrada, se omite: ${abs}`);
        continue;
      }
      const dest = path.join(stagingDir, path.relative(process.cwd(), abs));
      logger.info(`Copiando: ${abs} -> ${dest}`);
      copyRecursive(abs, dest);
    }

    // Respaldo de base de datos
    const dbResult = await backupMongo(mongoUri, stagingDir, logger);
    if (dbResult.error) {
      logger.warn('Respaldo de DB falló; se continúa con archivos');
    }

    // Comprimir
    const zipPath = path.join(outDir, `backup-${timestamp}.zip`);
    logger.info(`Comprimiendo a: ${zipPath}`);
    compressDirectory(stagingDir, zipPath);
    logger.info('Respaldo completado exitosamente');
    console.log(JSON.stringify({ ok: true, outDir, zipPath }, null, 2));
  } catch (err) {
    logger.error(`Fallo en respaldo: ${err.message}`);
    console.error(err);
    process.exitCode = 1;
  }
}

run();