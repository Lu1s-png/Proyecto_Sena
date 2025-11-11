const fs = require('fs');
const path = require('path');

async function backupMongo(uri, outDir, logger) {
  if (!uri) {
    logger.warn('Mongo URI no proporcionado; se omite respaldo de base de datos');
    return { skipped: true };
  }
  let client;
  try {
    const { MongoClient } = require('mongodb');
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    const cols = await db.listCollections().toArray();
    const backupDir = path.join(outDir, 'db');
    fs.mkdirSync(backupDir, { recursive: true });
    for (const c of cols) {
      const name = c.name;
      const cursor = db.collection(name).find({});
      const arr = await cursor.toArray();
      fs.writeFileSync(path.join(backupDir, `${name}.json`), JSON.stringify(arr, null, 2));
    }
    logger.info(`Respaldo de Mongo completado: ${cols.length} colecciones`);
    return { skipped: false, collections: cols.map(c => c.name) };
  } catch (err) {
    logger.error(`Fallo al respaldar Mongo: ${err.message}`);
    return { skipped: false, error: err };
  } finally {
    if (client) await client.close().catch(() => {});
  }
}

async function restoreMongo(uri, inDir, logger) {
  if (!uri) {
    logger.warn('Mongo URI no proporcionado; se omite restauración de base de datos');
    return { skipped: true };
  }
  let client;
  try {
    const { MongoClient } = require('mongodb');
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    const backupDir = path.join(inDir, 'db');
    if (!fs.existsSync(backupDir)) {
      logger.warn('No se encontró directorio de respaldo de DB');
      return { skipped: true };
    }
    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const name = path.basename(f, '.json');
      const data = JSON.parse(fs.readFileSync(path.join(backupDir, f), 'utf8'));
      if (Array.isArray(data) && data.length) {
        await db.collection(name).insertMany(data);
      }
    }
    logger.info(`Restauración de Mongo completada: ${files.length} colecciones`);
    return { skipped: false, collections: files.map(f => path.basename(f, '.json')) };
  } catch (err) {
    logger.error(`Fallo al restaurar Mongo: ${err.message}`);
    return { skipped: false, error: err };
  } finally {
    if (client) await client.close().catch(() => {});
  }
}

module.exports = { backupMongo, restoreMongo };