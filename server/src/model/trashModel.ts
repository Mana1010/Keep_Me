import mongoose from "mongoose";

const trashSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    noteId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Notes",
      required: true,
    },
    createdTrashAt: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Number,
    },
    endDate: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

type TrashSchema = mongoose.InferSchemaType<typeof trashSchema>;

export const Trash =
  mongoose.models.Trash || mongoose.model<TrashSchema>("Trash", trashSchema);
