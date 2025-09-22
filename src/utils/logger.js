/**
 * Production-safe logger that only logs in development
 */
class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
  }

  log(...args) {
    if (this.isDevelopment) {
      console.log('[SAMVAD]', ...args);
    }
  }

  error(...args) {
    if (this.isDevelopment) {
      console.error('[SAMVAD ERROR]', ...args);
    }
  }

  warn(...args) {
    if (this.isDevelopment) {
      console.warn('[SAMVAD WARN]', ...args);
    }
  }

  info(...args) {
    if (this.isDevelopment) {
      console.info('[SAMVAD INFO]', ...args);
    }
  }

  debug(...args) {
    if (this.isDevelopment) {
      console.debug('[SAMVAD DEBUG]', ...args);
    }
  }

  // Production-safe error reporting
  reportError(error, context = 'Unknown') {
    if (this.isDevelopment) {
      console.error(`[${context}] Error:`, error);
    } else {
      // In production, you could send to error reporting service
      // Example: Sentry, LogRocket, etc.
      // For now, we'll just silently handle it
    }
  }
}

export const logger = new Logger();
