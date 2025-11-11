const fs = require('fs');
const path = require('path');
const { ensureDir, copyRecursive } = require('../src/lib/fsutils');
const { compressDirectory, expandArchive } = require('../src/lib/compress');
const { getFreeBytes } = require('../src/lib/disk');
const { spawnSync } = require('child_process');

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content);
}

function dirEquals(a, b) {
  const list = (dir) => {
    const files = [];
    const stack = [dir];
    while (stack.length) {
      const d = stack.pop();
      for (const e of fs.readdirSync(d)) {
        const full = path.join(d, e);
        const st = fs.statSync(full);
        if (st.isDirectory()) stack.push(full);
        else files.push(path.relative(dir, full));
      }
    }
    return files.sort();
  };
  const af = list(a);
  const bf = list(b);
  if (af.length !== bf.length) return false;
  for (let i = 0; i < af.length; i++) {
    const fa = path.join(a, af[i]);
    const fb = path.join(b, bf[i]);
    const ca = fs.readFileSync(fa, 'utf8');
    const cb = fs.readFileSync(fb, 'utf8');
    if (ca !== cb) return false;
  }
  return true;
}

describe('Backup tools', () => {
  const tmp = path.join(__dirname, 'tmp');
  const sample = path.join(tmp, 'sample');
  const staging = path.join(tmp, 'staging');
  const out = path.join(tmp, 'out');
  const restore = path.join(tmp, 'restore');

  beforeAll(() => {
    ensureDir(sample);
    ensureDir(staging);
    ensureDir(out);
    ensureDir(restore);

    writeFile(path.join(sample, 'config', 'app.env'), 'KEY=VALUE');
    writeFile(path.join(sample, 'project', 'file1.txt'), 'hello');
    writeFile(path.join(sample, 'project', 'dir', 'file2.txt'), 'world');

    copyRecursive(path.join(sample, 'config'), path.join(staging, 'config'));
    copyRecursive(path.join(sample, 'project'), path.join(staging, 'project'));
  });

  afterAll(() => {
    // Clean up not strictly necessary
  });

  test('Compress and Expand round-trip preserves files', () => {
    const zip = path.join(out, 'backup.zip');
    compressDirectory(staging, zip);
    expandArchive(zip, restore);
    // Expand-Archive coloca el contenido directamente en 'restore'
    expect(dirEquals(staging, restore)).toBe(true);
  });

  test('Disk free bytes returns a positive integer', () => {
    const free = getFreeBytes(out);
    expect(typeof free).toBe('number');
    expect(free).toBeGreaterThan(0);
  });
  
  test('Backup CLI handles insufficient disk space error', () => {
    const cmd = spawnSync('node', [
      path.join(__dirname, '..', 'src', 'backup.js'),
      `--out=${out}`,
      `--configPaths=${path.join(sample, 'config')}`,
      `--projectDirs=${path.join(sample, 'project')}`,
      `--minFreeBytes=${Number.MAX_SAFE_INTEGER}`
    ], { encoding: 'utf8' });
    expect(cmd.status).toBe(1);
    expect(cmd.stdout + cmd.stderr).toMatch(/Espacio insuficiente/);
  });
});