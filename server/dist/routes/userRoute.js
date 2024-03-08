"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectedRoutes_1 = require("../middleware/protectedRoutes");
const noteController_1 = require("../controller/noteController");
const router = express_1.default.Router();
router
    .route("/notes")
    .get(protectedRoutes_1.protectedRoutes, noteController_1.getNotes)
    .post(protectedRoutes_1.protectedRoutes, noteController_1.addNote);
router
    .route("/notes/:id")
    .get(protectedRoutes_1.protectedRoutes, noteController_1.getEditNote)
    .patch(protectedRoutes_1.protectedRoutes, noteController_1.editNotes)
    .delete(protectedRoutes_1.protectedRoutes, noteController_1.deleteNote);
router.patch("/notes/pin/:id", protectedRoutes_1.protectedRoutes, noteController_1.editNotePin);
router.patch("/notes/favorite/:id", protectedRoutes_1.protectedRoutes, noteController_1.editNoteFavorite);
router
    .route("/trashes")
    .get(protectedRoutes_1.protectedRoutes, noteController_1.getTrashNote)
    .delete(protectedRoutes_1.protectedRoutes, noteController_1.deleteAllTrash);
router.route("/trashes/:id").delete(protectedRoutes_1.protectedRoutes, noteController_1.deleteTrash);
router.delete("/trashes/restore/:id", protectedRoutes_1.protectedRoutes, noteController_1.restoreNote);
exports.default = router;
