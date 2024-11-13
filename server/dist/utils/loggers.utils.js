"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteLogger = exports.authenticationLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const { json, prettyPrint, timestamp, combine, errors, colorize } = winston_1.default.format;
const authenticationLogger = winston_1.default.createLogger({
    level: "info",
    format: combine(json(), prettyPrint(), timestamp(), errors({ stack: true }), colorize({ all: true })),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: "authentication.log" }),
    ],
    defaultMeta: { service: "authentication-service" },
});
exports.authenticationLogger = authenticationLogger;
const noteLogger = winston_1.default.createLogger({
    level: "info",
    format: combine(json(), prettyPrint(), timestamp(), errors()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: "note.log" }),
    ],
    defaultMeta: { service: "note-service" },
});
exports.noteLogger = noteLogger;
