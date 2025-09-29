import * as fs from 'fs';
import * as path from 'path';

const logDirectory = path.join(__dirname, '..', '..', 'logs'); // logs folder at the root of 'api'
const logFilePath = path.join(logDirectory, 'sync.log');

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const log = (...args: any[]) => {
  const level = typeof args[0] === 'string' && ['info', 'warn', 'error', 'debug'].includes(args[0].toLowerCase()) ? args.shift().toLowerCase() : 'info';
  const timestamp = new Date().toLocaleString();
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  // Append to file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });

  // Also log to console (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const consoleLogLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : 'info';

    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(level);
    const consoleLevelIndex = levels.indexOf(consoleLogLevel);

    if (currentLevelIndex >= consoleLevelIndex) {
      if (level === 'error') {
        console.error(logMessage);
      } else if (level === 'warn') {
        console.warn(logMessage);
      } else if (level === 'debug') {
        console.debug(logMessage);
      } else {
        console.log(logMessage);
      }
    }
  }
};

export const logger = {
  info: (...args: any[]) => log('info', ...args),
  warn: (...args: any[]) => log('warn', ...args),
  error: (...args: any[]) => log('error', ...args),
  debug: (...args: any[]) => log('debug', ...args),
};
