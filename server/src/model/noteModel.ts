import mongoose, { Model } from "mongoose";

export interface NotesDocument extends Document {
  title: string;
  content: string;
  isBold: boolean;
  isItalic: boolean;
  isListOpen: boolean;
  listType: string;
  isPinned: boolean;
  isFavorite: boolean;
  bgColor: string;
  createdBy: any;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}
const noteSchema = new mongoose.Schema({
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
  owner: {
    type: String,
  },
  noteId: mongoose.SchemaTypes.ObjectId,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});
// noteSchema.pre("save", function (next) {
//   if (this.isModified("title") || this.isModified("content")) {
//     this.updatedAt = new Date();
//     console.log("Run!");
//   }
//   next();
// });
export const Notes = mongoose.model("notes", noteSchema);
