const { spawnSync } = require('child_process');
const path = require('path');

function getDriveLetter(targetPath) {
  const qualifier = path.parse(path.resolve(targetPath)).root; // e.g. D:\
  return qualifier.replace('\\', '').replace(':\\', '').replace(':', '') || 'C';
}

function getFreeBytes(targetPath) {
  const drive = getDriveLetter(targetPath);
  const ps = spawnSync('powershell', ['-NoProfile', '-Command', `($d = Get-PSDrive -Name '${drive}').Free`], { encoding: 'utf8' });
  if (ps.status !== 0) {
    throw new Error(`No se pudo obtener espacio libre del disco: ${ps.stderr || ps.stdout}`);
  }
  const freeStr = (ps.stdout || '').trim();
  const free = parseInt(freeStr, 10);
  if (isNaN(free)) {
    throw new Error(`Espacio libre inválido: '${freeStr}'`);
  }
  return free; // bytes
}

module.exports = { getFreeBytes };