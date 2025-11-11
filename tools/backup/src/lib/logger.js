const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    const dir = path.dirname(logFile);
    fs.mkdirSync(dir, { recursive: true });
  }

  write(level, message) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level}] ${message}`;
    console.log(line);
    fs.appendFileSync(this.logFile, line + '\n');
  }

  info(msg) { this.write('INFO', msg); }
  warn(msg) { this.write('WARN', msg); }
  error(msg) { this.write('ERROR', msg); }
  debug(msg) { this.write('DEBUG', msg); }
}

module.exports = { Logger };