"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectedRoutes_1 = require("../middleware/protectedRoutes");
const router = express_1.default.Router();
router.get("/notes", protectedRoutes_1.protectedRoutes, (req, res) => {
    res.send("Hello World Notes");
});
