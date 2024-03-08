import React from "react";
import { create } from "zustand";
export interface UserNote {
  title: string;
  content: string;
  isBold: boolean;
  isItalic: boolean;
  isFavorite: boolean;
  isPinned: boolean;
  isListOpen: boolean;
  listType: string;
  bgColor: string;
}
interface StateNote {
  note: UserNote;
  openBg: boolean;
  openListStyle: boolean;
}
export interface TypeList {
  name: string;
  icon: any;
  symbol: string;
}
export interface UserNoteStore extends StateNote {
  setNote: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  colorPickonMouseOver: (color: string) => void;
  colorPickOnClick: (color: string) => void;
  setOpenListStyle: () => void;
  setPinned: () => void;
  setFavorite: () => void;
  setBold: () => void;
  setItalic: () => void;
  setOpenBg: () => void;
  setOpenBgPropagate: () => void;
  setOpenListStylePropagate: () => void;
  setListOpen: () => void;
  listType: (type: string) => void;
  setListSymbol: (filterSymbols: TypeList | undefined) => void;
  removeDuplicateSymbols: (filterSymbols: TypeList | undefined) => void;
  resetNote: () => void;
}

const store = (set: any) => ({
  note: {
    title: "Untitled Note",
    content: "",
    isBold: false,
    isItalic: false,
    isFavorite: false,
    isPinned: false,
    isListOpen: false,
    listType: "dot",
    bgColor: "white",
  },
  openBg: false,
  openListStyle: false,
  setNote: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    set((state: StateNote) => ({
      note: {
        ...state.note,
        [name]: value,
      },
    }));
  },
  colorPickonMouseOver: (color: string) => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        bgColor: color,
      },
    }));
  },
  colorPickOnClick: (color: string) => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        bgColor: color,
      },
    }));
  },

  setOpenListStyle: () =>
    set((state: StateNote) => ({
      openListStyle: !state.openListStyle,
    })),
  setOpenBg: () => {
    set((state: StateNote) => ({
      openBg: !state.openBg,
    }));
  },
  setOpenBgPropagate: () => {
    set({ openBg: false });
  },
  setOpenListStylePropagate: () => {
    set({ openListStyle: false });
  },
  setPinned: () => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        isPinned: !state.note.isPinned,
      },
    }));
  },
  setFavorite: () => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        isFavorite: !state.note.isFavorite,
      },
    }));
  },
  setBold: () => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        isBold: !state.note.isBold,
      },
    }));
  },
  setItalic: () => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        isItalic: !state.note.isItalic,
      },
    }));
  },
  setListOpen: () => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        isListOpen: !state.note.isListOpen,
      },
    }));
  },
  listType: (type: string) => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        listType: type,
      },
    }));
  },
  setListSymbol: (filterSymbols: TypeList | undefined) => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        content: state.note.content + filterSymbols?.symbol + " ",
      },
    }));
  },
  removeDuplicateSymbols: (filterSymbols: TypeList | undefined) => {
    set((state: StateNote) => ({
      note: {
        ...state.note,
        content: filterSymbols?.symbol + " " + state.note.content,
      },
    }));
  },
  resetNote: () => {
    set({
      note: {
        title: "Untitled Note",
        content: "",
        isBold: false,
        isItalic: false,
        isFavorite: false,
        isPinned: false,
        isListOpen: false,
        listType: "dot",
        bgColor: "white",
      },
    });
  },
});

export const noteStore = create<UserNoteStore>(store);
