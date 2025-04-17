import winston from "winston"
import config from "../config/config.js"

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
)

// Create logger instance
export const logger = winston.createLogger({
  level: config?.server?.env === "production" ? "info" : "debug",
  format: logFormat,
  defaultMeta: { service: "cloudwise-api" },
  transports: [
    // Write logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`
        }),
      ),
    }),
  ],
})

// Create a stream object for Morgan
export const logStream = {
  write: (message) => {
    logger.info(message.trim())
  },
}
