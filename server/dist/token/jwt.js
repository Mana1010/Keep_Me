"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function createAccessToken(id) {
    return jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: "1d",
    });
}
exports.createAccessToken = createAccessToken;
