"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (password) {
                return password.length > 8;
            },
            message: "Password must be greater than 8 characters long.",
        },
    },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("users", userSchema);
