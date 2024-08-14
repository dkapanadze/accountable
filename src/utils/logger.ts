import winston from "winston";
import "winston-daily-rotate-file";

const fileLogFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${message}\n${stack || ""}`;
  },
);

const consoleLogFormat = winston.format.printf(({ level, message, stack }) => {
  return `${level}: ${message}\n${stack || ""}`;
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-errors.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  level: "error",
  format: winston.format.combine(winston.format.timestamp(), fileLogFormat),
});

const infoTransport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-combined.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), fileLogFormat),
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize(), consoleLogFormat),
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), fileLogFormat),
  transports: [errorTransport, infoTransport, consoleTransport],
});

export default logger;
