import * as fs from 'fs';
import * as path from 'path';

const logDirectory = path.join(__dirname, '..', '..', 'logs'); // logs folder at the root of 'api'
const logFilePath = path.join(logDirectory, 'sync.log');

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const log = (message: string, level: 'info' | 'error' = 'info') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  // Append to file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });

  // Also log to console
  if (level === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
};

export const logger = {
  info: (message: string) => log(message, 'info'),
  error: (message: string) => log(message, 'error'),
};
