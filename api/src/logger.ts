import * as fs from 'fs';
import * as path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
let logDirectory: string;
let logFilePath: string;

// Only set up file logging if not in production
if (!isProduction) {
  logDirectory = path.join(__dirname, '..', '..', 'logs');
  logFilePath = path.join(logDirectory, 'sync.log');

  // Ensure the log directory exists
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }
}

const log = (...args: any[]) => {
  const level = typeof args[0] === 'string' && ['info', 'warn', 'error', 'debug'].includes(args[0].toLowerCase()) ? args.shift().toLowerCase() : 'info';
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  // Always log to console
  if (level === 'error') {
    console.error(logMessage);
  } else if (level === 'warn') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }

  // Only write to file if not in production
  if (!isProduction && logFilePath) {
    fs.appendFile(logFilePath, logMessage + '\n', (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }
};

export const logger = {
  info: (...args: any[]) => log('info', ...args),
  warn: (...args: any[]) => log('warn', ...args),
  error: (...args: any[]) => log('error', ...args),
  debug: (...args: any[]) => log('debug', ...args),
};