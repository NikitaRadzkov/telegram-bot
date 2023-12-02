import { container } from "tsyringe";
import winston, { format } from "winston";

class LoggerService {
  logger: winston.Logger;

  constructor() {
    const logFormat = format.combine(
      format.timestamp(),
      format.simple()
    );

    this.logger = winston.createLogger({
      level: 'info',
      format: logFormat,
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
  }
}

export const Logger = container.resolve(LoggerService).logger;
