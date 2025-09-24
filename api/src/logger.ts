import * as fs from 'fs';
import * as path from 'path';

const logDirectory = path.join(__dirname, '..', '..', 'logs'); // logs folder at the root of 'api'
const logFilePath = path.join(logDirectory, 'sync.log');

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const log = (...args: any[]) => {
  const level = typeof args[0] === 'string' && ['info', 'error'].includes(args[0].toLowerCase()) ? args.shift().toLowerCase() : 'info';
  const timestamp = new Date().toISOString();
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  // Append to file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });

  // Also log to console
  if (level === 'error') {
    console.error(...args);
  } else {
    console.log(...args);
  }
};

export const logger = {
  info: (...args: any[]) => log('info', ...args),
  error: (...args: any[]) => log('error', ...args),
};
