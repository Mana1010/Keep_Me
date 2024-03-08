"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const authController_2 = require("../controller/authController");
const protectedRoutes_1 = require("../middleware/protectedRoutes");
const router = express_1.default.Router();
router.post("/signup", authController_1.getSignUp);
router.post("/login", authController_1.getLogIn);
router.get("/refresh", authController_2.newAccessToken);
router.patch("/changepassword", protectedRoutes_1.protectedRoutes, authController_2.changePassword);
router.post("/logout", protectedRoutes_1.protectedRoutes, authController_2.logOut);
router.get("/userDetails", protectedRoutes_1.protectedRoutes, authController_2.getUserDetails);
exports.default = router;
