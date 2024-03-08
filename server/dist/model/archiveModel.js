"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archive = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const archiveSchema = new mongoose_1.default.Schema({
    title: String,
    content: String,
    isBold: Boolean,
    isItalic: Boolean,
    isListOpen: Boolean,
    listType: String,
    isPinned: Boolean,
    isFavorite: Boolean,
    bgColor: String,
    createdBy: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
    },
    noteId: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Notes",
    },
    owner: String,
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    archiveCreatedAt: {
        type: Date,
        default: () => new Date(),
    },
});
exports.Archive = mongoose_1.default.model("archives", archiveSchema);
