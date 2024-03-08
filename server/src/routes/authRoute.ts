import express from "express";
import { getSignUp, getLogIn } from "../controller/authController";
import {
  newAccessToken,
  changePassword,
  logOut,
  getUserDetails,
} from "../controller/authController";
import { protectedRoutes } from "../middleware/protectedRoutes";
const router = express.Router();
router.post("/signup", getSignUp);
router.post("/login", getLogIn);
router.get("/refresh", newAccessToken);
router.patch("/changepassword", protectedRoutes, changePassword);
router.post("/logout", protectedRoutes, logOut);
router.get("/userDetails", protectedRoutes, getUserDetails);

export default router;
