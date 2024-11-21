import { UserNote } from "@/store/note.store";
export interface NoteData extends UserNote {
  _id: string;
  createdBy: string;
  updatedAt: string;
  createdAt: string;
  owner: string;
}

export interface NoteTrashData extends NoteData {
  createdTrashAt: string;
}
