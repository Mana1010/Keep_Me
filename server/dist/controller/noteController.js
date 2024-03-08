"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrash = exports.restoreNote = exports.deleteAllTrash = exports.getTrashNote = exports.deleteNote = exports.getEditNote = exports.editNoteFavorite = exports.editNotePin = exports.editNotes = exports.getNotes = exports.addNote = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const noteModel_1 = require("../model/noteModel");
const trashModel_1 = require("../model/trashModel");
const archiveModel_1 = require("../model/archiveModel");
exports.addNote = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const { title, content, isBold, isItalic, isFavorite, isListOpen, listType, isPinned, bgColor, } = req.body;
    console.log(req.body);
    try {
        const newNote = await noteModel_1.Notes.create({
            title,
            content,
            isBold,
            isItalic,
            isListOpen,
            listType,
            isPinned,
            isFavorite,
            bgColor,
            createdBy: req.user._id,
            owner: req.user.username,
        });
        newNote.noteId = newNote._id;
        await newNote.save();
        res.status(201).json({ message: "Successfully add your note" });
    }
    catch (err) {
        res.status(400);
        throw new Error("Failed to add note, please try again");
    }
});
exports.getNotes = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const userNote = await noteModel_1.Notes.find({ createdBy: req.user._id }).sort({
        updatedAt: -1,
    });
    if (!userNote) {
        res.status(200).json({ message: [] });
    }
    res.status(200).json({ message: userNote });
});
exports.editNotes = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { title, content, isBold, isItalic, isListOpen, listType, isPinned, isFavorite, bgColor, } = req.body;
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const editNote = await noteModel_1.Notes.findOne({ noteId: id });
    if (!editNote) {
        res.status(404);
        throw new Error("Note not found");
    }
    if (title !== editNote.title || content !== editNote.content) {
        editNote.updatedAt = new Date();
    }
    editNote.title = title;
    editNote.content = content;
    editNote.isBold = isBold;
    editNote.isItalic = isItalic;
    editNote.isFavorite = isFavorite;
    editNote.isListOpen = isListOpen;
    editNote.listType = listType;
    editNote.isPinned = isPinned;
    editNote.bgColor = bgColor;
    await editNote.save();
    res.status(200).json({ message: "Successfully updated your note." });
});
exports.editNotePin = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { isPinned } = req.body;
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const editNotePin = await noteModel_1.Notes.findOne({ noteId: id });
    if (!editNotePin) {
        res.status(404);
        throw new Error("Note not found");
    }
    editNotePin.isPinned = isPinned;
    await editNotePin.save();
    if (isPinned) {
        res.status(200).json({ message: "Note successfully pinned." });
        return;
    }
    res.status(200).json({ message: "Note successfully unpinned." });
});
exports.editNoteFavorite = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { isFavorite } = req.body;
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const editNoteFavorite = await noteModel_1.Notes.findOne({ noteId: id });
    if (!editNoteFavorite) {
        res.status(404);
        throw new Error("Note is not found");
    }
    editNoteFavorite.isFavorite = isFavorite;
    await editNoteFavorite.save();
    if (isFavorite) {
        res.status(200).json({ message: "Note successfully add to Favorites." });
        return;
    }
    res
        .status(200)
        .json({ message: "Note successfully remove from Favorites." });
});
exports.getEditNote = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const { id } = req.params;
    const getNote = await noteModel_1.Notes.findOne({ noteId: id }).select({
        createdAt: 0,
        owner: 0,
    });
    if (!getNote) {
        res.status(404);
        throw new Error("No note found");
    }
    res.status(200).json({ message: getNote });
});
exports.deleteNote = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const { id } = req.params;
    const getNote = await noteModel_1.Notes.findOne({ noteId: id });
    if (!getNote) {
        res.status(404);
        throw new Error("No note found with the provided ID");
    }
    await noteModel_1.Notes.deleteOne({ noteId: id });
    await trashModel_1.Trash.create({
        title: getNote.title,
        content: getNote.content,
        isBold: getNote.isBold,
        isItalic: getNote.isItalic,
        isListOpen: getNote.isListOpen,
        listType: getNote.listType,
        isPinned: getNote.isPinned,
        isFavorite: getNote.isFavorite,
        bgColor: getNote.bgColor,
        createdBy: getNote.createdBy,
        noteId: getNote.noteId,
        owner: getNote.owner,
        createdAt: getNote.createdAt,
        updatedAt: getNote.updatedAt,
        startDate: new Date().getTime(),
        endDate: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
    });
    res.status(202).json({ message: "Your note is being moved to the Trash" });
});
exports.getTrashNote = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const getAllTrashNote = await trashModel_1.Trash.find({
        createdBy: req.user?._id,
    })
        .sort({ createdTrashAt: -1 })
        .lean();
    await trashModel_1.Trash.updateMany({
        startDate: new Date().getTime(),
    });
    if (!getAllTrashNote) {
        res.status(200).json({ message: [] });
        return;
    }
    const filteredExpiredTrash = getAllTrashNote.filter((trash) => trash?.startDate > trash?.endDate);
    const mappedId = filteredExpiredTrash.map((expired) => expired.noteId);
    await trashModel_1.Trash.deleteMany({ noteId: { $in: mappedId } });
    res.status(200).json({ message: getAllTrashNote });
});
exports.deleteAllTrash = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const getNotes = await trashModel_1.Trash.find({ createdBy: req.user._id });
    await trashModel_1.Trash.deleteMany({ createdBy: req.user._id });
    await archiveModel_1.Archive.insertMany(getNotes);
    res
        .status(200)
        .json({ message: "Successfully deleted all your trash permanently." });
});
exports.restoreNote = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const { id } = req.params;
    const getNote = await trashModel_1.Trash.findOne({ noteId: id }).lean();
    if (!getNote) {
        res.status(400);
        throw new Error("Note ID not found, please try again");
    }
    await trashModel_1.Trash.deleteOne({ noteId: id });
    await noteModel_1.Notes.create({
        title: getNote.title,
        content: getNote.content,
        isBold: getNote.isBold,
        isItalic: getNote.isItalic,
        isListOpen: getNote.isListOpen,
        listType: getNote.listType,
        isPinned: getNote.isPinned,
        isFavorite: getNote.isFavorite,
        bgColor: getNote.bgColor,
        createdBy: getNote.createdBy,
        noteId: getNote.noteId,
        owner: getNote.owner,
        createdAt: getNote.createdAt,
        updatedAt: getNote.updatedAt,
    });
    res.status(201).json({ message: "Successfully restore the note" });
});
exports.deleteTrash = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const { id } = req.params;
    const getNote = await trashModel_1.Trash.findOne({ noteId: id }).lean();
    if (!getNote) {
        res.status(400);
        throw new Error("Note ID not found, please try again");
    }
    await trashModel_1.Trash.deleteOne({ noteId: id });
    await archiveModel_1.Archive.create({
        title: getNote.title,
        content: getNote.content,
        isBold: getNote.isBold,
        isItalic: getNote.isItalic,
        isListOpen: getNote.isListOpen,
        listType: getNote.listType,
        isPinned: getNote.isPinned,
        isFavorite: getNote.isFavorite,
        bgColor: getNote.bgColor,
        createdBy: getNote.createdBy,
        noteId: getNote.noteId,
        owner: getNote.owner,
        createdAt: getNote.createdAt,
        updatedAt: getNote.updatedAt,
    });
    res
        .status(200)
        .json({ message: "Successfully deleted the note permanently." });
});
