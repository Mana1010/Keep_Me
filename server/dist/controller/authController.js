"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = exports.logOut = exports.newAccessToken = exports.verifyAccount = exports.changePassword = exports.getLogIn = exports.getSignUp = void 0;
const userModel_1 = require("../model/userModel");
const token_1 = require("../utils/token");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.getSignUp = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 16);
        await userModel_1.User.create({ email, username, password: hashedPassword });
        res.status(201).json({ message: "Successfully Sign Up" });
    }
    catch (err) {
        res.status(400).json({
            message: err.code === 11000
                ? "Oops! Email address already used"
                : "Oops! Something went wrong while signing up. Please try again later.",
        });
    }
});
exports.getLogIn = (0, express_async_handler_1.default)(async (req, res) => {
    const { username, password } = req.body;
    const findUser = await userModel_1.User.findOne({ username });
    if (!findUser) {
        res.status(401);
        throw new Error("Opps, Wrong Credentials");
    }
    const passwordCompare = await bcrypt_1.default.compare(password, findUser?.password);
    if (!findUser || !passwordCompare) {
        res.status(401);
        throw new Error("Opps, Wrong Credentials");
    }
    const accessToken = (0, token_1.createAccessToken)(findUser?._id.toString());
    const refreshToken = (0, token_1.createRefreshToken)(findUser?._id.toString());
    res
        .status(200)
        .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000,
        sameSite: "none",
        secure: true,
    })
        .json({
        message: "Successfully Log In",
        token: accessToken,
    });
});
exports.changePassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { password, newpassword } = req.body;
    if (!req.user) {
        res.status(401);
        throw new Error("User not authorized, please log in first");
    }
    const findUser = await userModel_1.User.findById(req.user._id);
    if (!findUser) {
        res.status(401);
        throw new Error("User not authorized, please log in first");
    }
    const passwordCompare = await bcrypt_1.default.compare(password, findUser.password);
    if (!passwordCompare) {
        res.status(400);
        throw new Error("Invalid current password, please try again");
    }
    findUser.password = await bcrypt_1.default.hash(newpassword, 16);
    await findUser.save();
    res.status(200).json({ message: "Password successfully change" });
});
const verifyAccount = (req, res) => {
    if (req.user) {
        res.status(200).json({ message: req.user });
    }
    else {
        res.status(400).json({ message: "Error" });
    }
};
exports.verifyAccount = verifyAccount;
exports.newAccessToken = (0, express_async_handler_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(403);
            throw new Error("Forbidden");
        }
        else {
            const token = (0, token_1.createAccessToken)(decoded.id.toString());
            res.status(200).json({ token });
        }
    });
});
exports.logOut = (0, express_async_handler_1.default)(async (req, res) => {
    const cookie = req.cookies?.refreshToken;
    if (!cookie) {
        res.status(403);
        throw new Error("Forbidden");
    }
    res
        .status(200)
        .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    })
        .json({ message: "Log out Successfully" });
});
exports.getUserDetails = (0, express_async_handler_1.default)(async (req, res) => {
    const getUser = await userModel_1.User.findById(req.user?._id)
        .select(["username", "email"])
        .lean();
    if (!getUser) {
        res.status(401);
        throw new Error("User not authorized");
    }
    res.status(200).json({ message: getUser });
});
