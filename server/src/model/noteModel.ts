import e from "express";
import mongoose, { Model } from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "Untitled Note" },
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
  },
  {
    timestamps: true,
  }
);
export type NoteSchema = mongoose.InferSchemaType<typeof noteSchema>;
export const Notes =
  mongoose.models.Notes || mongoose.model<NoteSchema>("Note", noteSchema);
