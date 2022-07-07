import {ConsoleLogger, Logger, LogLevel} from '@aries-framework/core';

const consoleLogger = new ConsoleLogger(LogLevel.trace);
type PersistLogParam = (message: string) => void;

export const frameworkLogger: (persistLog: PersistLogParam) => Logger = (
  persistLog: PersistLogParam,
) => {
  return {
    logLevel: LogLevel.trace,
    test: function (message: string, data?: Record<string, any>): void {
      persistLog(
        `${new Date().toISOString()} TEST ${message} ${
          data ? JSON.stringify(data) : ''
        }`,
      );
      consoleLogger.test(message, data);
    },
    trace: function (message: string, data?: Record<string, any>): void {
      persistLog(
        `${new Date().toISOString()} TRACE ${message} ${
          data ? JSON.stringify(data) : ''
        }`,
      );
      consoleLogger.trace(message, data);
    },
    debug: function (message: string, data?: Record<string, any>): void {
      persistLog(
        `${new Date().toISOString()} DEBUG ${message} ${
          data ? JSON.stringify(data) : ''
        }`,
      );
      consoleLogger.debug(message, data);
    },
    info: function (message: string, data?: Record<string, any>): void {
      persistLog(
        `${new Date().toISOString()} INFO ${message} ${
          data ? JSON.stringify(data) : ''
        }`,
      );
      consoleLogger.info(message, data);
    },
    warn: function (message: string, data?: Record<string, any>): void {
      persistLog(
        `${new Date().toISOString()} WARN ${message} ${
          data ? JSON.stringify(data) : ''
        }`,
      );
      consoleLogger.warn(message, data);
    },
    error: function (message: string, data?: Record<string, any>): void {
      persistLog(
        `${new Date().toISOString()} ERROR ${message} ${
          data ? JSON.stringify(data) : ''
        }`,
      );
      consoleLogger.error(message, data);
    },
    fatal: function (message: string, data?: Record<string, any>): void {
      persistLog(
        `${new Date().toISOString()} FATAL ${message} ${
          data ? JSON.stringify(data) : ''
        }`,
      );
      consoleLogger.fatal(message, data);
    },
  };
};
