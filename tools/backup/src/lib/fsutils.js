const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

function sumSizes(paths) {
  let total = 0;
  for (const p of paths) {
    if (!fs.existsSync(p)) continue;
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const stack = [p];
      while (stack.length) {
        const dir = stack.pop();
        for (const entry of fs.readdirSync(dir)) {
          const full = path.join(dir, entry);
          const st = fs.statSync(full);
          if (st.isDirectory()) stack.push(full);
          else total += st.size;
        }
      }
    } else {
      total += stat.size;
    }
  }
  return total;
}

module.exports = { ensureDir, copyRecursive, sumSizes };