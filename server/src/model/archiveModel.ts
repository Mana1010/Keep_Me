import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema({
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
  archiveCreatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

type ArchiveSchema = mongoose.InferSchemaType<typeof archiveSchema>;

export const Archive =
  mongoose.models.Archive ||
  mongoose.model<ArchiveSchema>("Archive", archiveSchema);
