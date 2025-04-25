import { env } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

## Daily Monitoring Checklist
- [ ] Review error logs for unexpected patterns
- [ ] Check performance metrics for any degradation
- [ ] Verify all critical API endpoints are responding
- [ ] Monitor database connection pool usage
- [ ] Check user session counts and authentication failuresinterface LogOptions {
  context?: Record<string, any>;
  tags?: string[];
}

class Logger {
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private currentLogLevel: LogLevel = env.NEXT_PUBLIC_LOG_LEVEL;

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.currentLogLevel];
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): any {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      ...options?.context,
      ...(options?.tags ? { tags: options.tags } : {}),
      environment: env.NEXT_PUBLIC_APP_ENV,
    };
  }

  debug(message: string, options?: LogOptions): void {
    if (!this.shouldLog('debug')) return;
    
    console.debug(
      JSON.stringify(this.formatMessage('debug', message, options))
    );
  }

  info(message: string, options?: LogOptions): void {
    if (!this.shouldLog('info')) return;
    
    console.info(
      JSON.stringify(this.formatMessage('info', message, options))
    );
  }

  warn(message: string, options?: LogOptions): void {
    if (!this.shouldLog('warn')) return;
    
    console.warn(
      JSON.stringify(this.formatMessage('warn', message, options))
    );
  }

  error(message: string, error?: Error, options?: LogOptions): void {
    if (!this.shouldLog('error')) return;
    
    const context = {
      ...(options?.context || {}),
      ...(error ? {
        errorName: error.name,
        errorMessage: error.message,
        stackTrace: error.stack,
      } : {}),
    };
    
    console.error(
      JSON.stringify(this.formatMessage('error', message, { ...options, context }))
    );
  }
}

export const logger = new Logger();


## 10. Set Up Server Monitoring and Log Aggregation

Create a structured logging system:
```typescript
import { env } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  context?: Record<string, any>;
  tags?: string[];
}

class Logger {
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private currentLogLevel: LogLevel = env.NEXT_PUBLIC_LOG_LEVEL;

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.currentLogLevel];
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): any {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      ...options?.context,
      ...(options?.tags ? { tags: options.tags } : {}),
      environment: env.NEXT_PUBLIC_APP_ENV,
    };
  }

  debug(message: string, options?: LogOptions): void {
    if (!this.shouldLog('debug')) return;
    
    console.debug(
      JSON.stringify(this.formatMessage('debug', message, options))
    );
  }

  info(message: string, options?: LogOptions): void {
    if (!this.shouldLog('info')) return;
    
    console.info(
      JSON.stringify(this.formatMessage('info', message, options))
    );
  }

  warn(message: string, options?: LogOptions): void {
    if (!this.shouldLog('warn')) return;
    
    console.warn(
      JSON.stringify(this.formatMessage('warn', message, options))
    );
  }

  error(message: string, error?: Error, options?: LogOptions): void {
    if (!this.shouldLog('error')) return;
    
    const context = {
      ...(options?.context || {}),
      ...(error ? {
        errorName: error.name,
        errorMessage: error.message,
        stackTrace: error.stack,
      } : {}),
    };
    
    console.error(
      JSON.stringify(this.formatMessage('error', message, { ...options, context }))
    );
  }
}

export const logger = new Logger();