import * as fs from 'fs';
import * as path from 'path';

const logDirectory = path.join(__dirname, '..', '..', 'logs'); // logs folder at the root of 'api'
const logFilePath = path.join(logDirectory, 'sync.log');

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const writeToFile = (message: string, level: 'info' | 'error' | 'debug' = 'info') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

export const logger: {
  info: (message: string) => void;
  error: (message: string) => void;
  debug: (message: string) => void;
} = {
  info: (message: string) => {
    console.log(`[INFO] ${message}`);
    writeToFile(message, 'info');
  },
  error: (message: string) => {
    console.error(`[ERROR] ${message}`);
    writeToFile(message, 'error');
  },
  debug: (message: string) => {
    // O modo de depuração está desativado. Nenhuma ação é executada.
  },
};
