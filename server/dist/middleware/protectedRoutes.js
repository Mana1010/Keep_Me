"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoutes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
require("dotenv/config");
const protectedRoutes = (req, res, next) => {
    const accessToken = req.headers["authorization"];
    if (accessToken) {
        const token = accessToken.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, async (err, decode) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }
            else {
                const jwtPayload = decode;
                console.log(`Token ${jwtPayload}`);
                req.user = await userModel_1.User.findById(jwtPayload.id).select("-password");
                next();
            }
        });
    }
    else {
        req.user = null;
        next();
    }
};
exports.protectedRoutes = protectedRoutes;
