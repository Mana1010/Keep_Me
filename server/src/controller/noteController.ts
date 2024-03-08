import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Notes, NotesDocument } from "../model/noteModel";
import { Trash } from "../model/trashModel";
import { Archive } from "../model/archiveModel";
export const addNote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const {
    title,
    content,
    isBold,
    isItalic,
    isFavorite,
    isListOpen,
    listType,
    isPinned,
    bgColor,
  } = req.body;
  console.log(req.body);
  try {
    const newNote = await Notes.create({
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
  } catch (err) {
    res.status(400);
    throw new Error("Failed to add note, please try again");
  }
});
export const getNotes = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const userNote = await Notes.find({ createdBy: req.user._id }).sort({
    updatedAt: -1,
  });
  if (!userNote) {
    res.status(200).json({ message: [] });
  }
  res.status(200).json({ message: userNote });
});
export const editNotes = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    content,
    isBold,
    isItalic,
    isListOpen,
    listType,
    isPinned,
    isFavorite,
    bgColor,
  } = req.body;
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const editNote = await Notes.findOne({ noteId: id });
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
export const editNotePin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isPinned } = req.body;
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const editNotePin = await Notes.findOne({ noteId: id });
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
export const editNoteFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isFavorite } = req.body;
    if (!req.user) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    const editNoteFavorite = await Notes.findOne({ noteId: id });
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
  }
);
export const getEditNote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const { id } = req.params;
  const getNote = await Notes.findOne({ noteId: id }).select({
    createdAt: 0,
    owner: 0,
  });
  if (!getNote) {
    res.status(404);
    throw new Error("No note found");
  }
  res.status(200).json({ message: getNote });
});

export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const { id } = req.params;
  const getNote = await Notes.findOne({ noteId: id });
  if (!getNote) {
    res.status(404);
    throw new Error("No note found with the provided ID");
  }
  await Notes.deleteOne({ noteId: id });
  await Trash.create({
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

export const getTrashNote = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    const getAllTrashNote = await Trash.find({
      createdBy: req.user?._id,
    })
      .sort({ createdTrashAt: -1 })
      .lean();
    await Trash.updateMany({
      startDate: new Date().getTime(),
    });
    if (!getAllTrashNote) {
      res.status(200).json({ message: [] });
      return;
    }
    const filteredExpiredTrash = getAllTrashNote.filter(
      (trash) => trash?.startDate! > trash?.endDate!
    );
    const mappedId = filteredExpiredTrash.map((expired) => expired.noteId);
    await Trash.deleteMany({ noteId: { $in: mappedId } });

    res.status(200).json({ message: getAllTrashNote });
  }
);

export const deleteAllTrash = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    const getNotes = await Trash.find({ createdBy: req.user._id });
    await Trash.deleteMany({ createdBy: req.user._id });
    await Archive.insertMany(getNotes);
    res
      .status(200)
      .json({ message: "Successfully deleted all your trash permanently." });
  }
);
export const restoreNote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const { id } = req.params;
  const getNote = await Trash.findOne({ noteId: id }).lean();
  if (!getNote) {
    res.status(400);
    throw new Error("Note ID not found, please try again");
  }
  await Trash.deleteOne({ noteId: id });
  await Notes.create({
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
export const deleteTrash = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  const { id } = req.params;
  const getNote = await Trash.findOne({ noteId: id }).lean();
  if (!getNote) {
    res.status(400);
    throw new Error("Note ID not found, please try again");
  }
  await Trash.deleteOne({ noteId: id });
  await Archive.create({
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
