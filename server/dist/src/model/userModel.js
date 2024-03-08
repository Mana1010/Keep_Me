"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
userSchema.pre("save", async function (next) {
    const salt = await bcrypt_1.default.genSalt();
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
exports.User = mongoose_1.default.model("users", userSchema);
