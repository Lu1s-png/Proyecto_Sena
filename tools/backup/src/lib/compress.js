const { spawnSync } = require('child_process');
const path = require('path');

function compressDirectory(dirPath, destZip) {
  const command = `Compress-Archive -Path '${dirPath}/*' -DestinationPath '${destZip}' -Force`;
  const ps = spawnSync('powershell', ['-NoProfile', '-Command', command], { encoding: 'utf8' });
  if (ps.status !== 0) {
    throw new Error(`Fallo al comprimir: ${ps.stderr || ps.stdout}`);
  }
  return destZip;
}

function expandArchive(zipPath, destDir) {
  const command = `Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force`;
  const ps = spawnSync('powershell', ['-NoProfile', '-Command', command], { encoding: 'utf8' });
  if (ps.status !== 0) {
    throw new Error(`Fallo al descomprimir: ${ps.stderr || ps.stdout}`);
  }
  return destDir;
}

module.exports = { compressDirectory, expandArchive };