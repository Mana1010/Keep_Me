"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    res.status(statusCode).json({
        message: err.message,
        stack: null,
        statusCode: res.statusCode,
    });
    console.log("running");
};
exports.default = errorHandler;
