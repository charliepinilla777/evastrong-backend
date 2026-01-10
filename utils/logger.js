const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const logger = {
  info: (message, data = {}) => {
    const log = `[${getTimestamp()}] INFO: ${message}`;
    console.log(`ℹ️  ${log}`);
    if (process.env.NODE_ENV === 'production') {
      fs.appendFileSync(
        path.join(logsDir, 'info.log'),
        `${log} ${JSON.stringify(data)}\n`
      );
    }
  },

  error: (message, error = {}) => {
    const log = `[${getTimestamp()}] ERROR: ${message}`;
    console.error(`❌ ${log}`);
    if (process.env.NODE_ENV === 'production') {
      fs.appendFileSync(
        path.join(logsDir, 'error.log'),
        `${log} ${JSON.stringify(error)}\n`
      );
    }
  },

  warn: (message, data = {}) => {
    const log = `[${getTimestamp()}] WARN: ${message}`;
    console.warn(`⚠️  ${log}`);
    if (process.env.NODE_ENV === 'production') {
      fs.appendFileSync(
        path.join(logsDir, 'warn.log'),
        `${log} ${JSON.stringify(data)}\n`
      );
    }
  },

  debug: (message, data = {}) => {
    if (process.env.LOG_LEVEL === 'debug') {
      const log = `[${getTimestamp()}] DEBUG: ${message}`;
      console.log(`🐛 ${log}`);
    }
  },
};

module.exports = logger;
