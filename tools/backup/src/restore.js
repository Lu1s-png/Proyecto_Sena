#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { Logger } = require('./lib/logger');
const { expandArchive } = require('./lib/compress');
const { restoreMongo } = require('./lib/db');

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
  const archive = args.archive;
  const dest = args.dest || path.join(process.cwd(), 'restore');

  if (!archive) {
    console.error('Debe proporcionar --archive=<ruta .zip>');
    process.exit(1);
  }

  const logPath = path.join(dest, 'logs', 'restore.log');
  const logger = new Logger(logPath);

  try {
    logger.info(`Iniciando restauración desde: ${archive}`);
    expandArchive(archive, dest);
    logger.info('Descompresión completada');

    const mongoUri = args.mongoUri || process.env.MONGO_URI;
    const dbResult = await restoreMongo(mongoUri, dest, logger);
    if (dbResult.error) {
      logger.warn('Restauración de DB falló; restauración de archivos continúa válida');
    }
    logger.info('Restauración completada');
    console.log(JSON.stringify({ ok: true, dest }, null, 2));
  } catch (err) {
    logger.error(`Fallo en restauración: ${err.message}`);
    console.error(err);
    process.exitCode = 1;
  }
}

run();