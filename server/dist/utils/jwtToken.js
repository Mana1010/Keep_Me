"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = exports.createRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function createRefreshToken(id) {
    return jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_KEY, {
        expiresIn: "1d",
    });
}
exports.createRefreshToken = createRefreshToken;
function createAccessToken(id) {
    return jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: process.env.NODE_ENV === "development" ? "10s" : "10m",
    });
}
exports.createAccessToken = createAccessToken;
