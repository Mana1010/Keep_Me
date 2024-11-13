"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = new mongoose_1.default.Schema({
    title: String,
    content: String,
    isBold: {
        type: Boolean,
        default: false,
    },
    isItalic: {
        type: Boolean,
        default: false,
    },
    isListOpen: {
        type: Boolean,
        default: false,
    },
    listType: {
        type: String,
        default: "dot",
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    bgColor: {
        type: String,
        default: "white",
    },
    createdBy: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
exports.Notes = mongoose_1.default.models.Notes || mongoose_1.default.model("Note", noteSchema);
