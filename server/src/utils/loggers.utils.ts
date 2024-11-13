import winston from "winston";

const { json, prettyPrint, timestamp, combine, errors, colorize } =
  winston.format;

const authenticationLogger = winston.createLogger({
  level: "info",
  format: combine(
    json(),
    prettyPrint(),
    timestamp(),
    errors({ stack: true }),
    colorize({ all: true })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "authentication.log" }),
  ],
  defaultMeta: { service: "authentication-service" },
});

const noteLogger = winston.createLogger({
  level: "info",
  format: combine(json(), prettyPrint(), timestamp(), errors()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "note.log" }),
  ],
  defaultMeta: { service: "note-service" },
});

export { authenticationLogger, noteLogger };
