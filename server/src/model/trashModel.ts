import mongoose from "mongoose";

const trashSchema = new mongoose.Schema({
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
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  noteId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Notes",
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  createdTrashAt: {
    type: Date,
    default: () => new Date(),
  },
  startDate: {
    type: Number,
  },
  endDate: {
    type: Number,
  },
});

type TrashSchema = mongoose.InferSchemaType<typeof trashSchema>;

export const Trash =
  mongoose.models.Trash || mongoose.model<TrashSchema>("Trash", trashSchema);
