interface LogContext {
  reqId?: string;
  userId?: string;
  plan?: string;
  source?: string;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
  priceId?: string;
  capDecision?: 'allowed' | 'blocked' | 'warning';
  latency?: number;
  [key: string]: any;
}

export function logStructured(
  level: 'info' | 'warn' | 'error',
  message: string,
  context: LogContext = {}
) {
  const log = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  const logString = JSON.stringify(log);

  switch (level) {
    case 'error':
      console.error(logString);
      break;
    case 'warn':
      console.warn(logString);
      break;
    default:
      console.log(logString);
  }

  // TODO: Send to external logging service (Datadog, LogDNA, etc.)
}

export const logger = {
  info: (message: string, context?: LogContext) => logStructured('info', message, context),
  warn: (message: string, context?: LogContext) => logStructured('warn', message, context),
  error: (message: string, context?: LogContext) => logStructured('error', message, context),
};
