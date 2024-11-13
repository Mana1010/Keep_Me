import e from "express";
import mongoose, { Model } from "mongoose";

const noteSchema = new mongoose.Schema(
  {
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
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
export type NoteSchema = mongoose.InferSchemaType<typeof noteSchema>;
export const Notes =
  mongoose.models.Notes || mongoose.model<NoteSchema>("Note", noteSchema);
