"use client";
import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdInfoOutline as CiCircleInfo } from "react-icons/md";
import noResult from "../../../assets/images/no-result-found.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiTrash2, FiHeart } from "react-icons/fi";
import { IoMdHeart, IoIosHeartEmpty } from "react-icons/io";
import { MdOutlinePushPin } from "react-icons/md";
import { MdOutlineHeartBroken } from "react-icons/md";
import { PiPushPinSlashLight } from "react-icons/pi";
import { LuPin } from "react-icons/lu";
import { NoteData } from "@/types/shared.type";
import Image from "next/image";
import useNoteMutation from "@/hooks/useNoteMutation.hook";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { dateFormatter } from "@/utils/dateFormatter.utils";
interface SearchNotesSchema {
  searchedNoteTitle: string;
  searchedNotes: NoteData[] | undefined;
}
function SearchedNotes({
  searchedNoteTitle,
  searchedNotes,
}: SearchNotesSchema) {
  const { mutatePinNote, mutateFavoriteNote, deleteNote } = useNoteMutation();
  const router = useRouter();
  return (
    <div
      id="searchNote-parent-container"
      className={`${
        searchedNoteTitle ? "block" : "hidden"
      } overflow-y-auto w-full h-[76%] md:h-[82%]`}
    >
      {searchedNotes?.length === 0 ? (
        <div className="flex justify-center items-center flex-col w-full h-full space-y-2">
          <Image width={210} src={noResult} alt="no-result-found" priority />
          <h1 className="font-bold text-slate-400 text-3xl text-center">
            NO RESULT FOUND
          </h1>
          <div className="space-x-2 "></div>
        </div>
      ) : (
        <div className=" w-full h-full px-2.5">
          <h6 className="font-semibold text-slate-700 text-[13px] pt-2">
            RESULT NOTES
          </h6>
          <div
            id="searchNote-container"
            className="grid w-full h-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-1"
          >
            {searchedNotes?.map((notes: NoteData) => (
              <motion.div
                onClick={() => {
                  router.push(`notes/${notes._id}`);
                }}
                layout
                key={notes._id}
                style={{ backgroundColor: notes.bgColor }}
                className={`border-[1px] border-[#e0e0e0] h-[380px] rounded-md px-3 py-2 relative hover:shadow-xl shadow-black transition-shadow ease-in duration-200 `}
              >
                <header className="flex justify-between items-center w-full">
                  <h3 className="font-extrabold text-sm break-all">
                    {notes.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      mutatePinNote.mutate(notes);
                    }}
                    className={`text-black ${
                      notes.isPinned ? "hidden" : "md:flex"
                    }`}
                  >
                    <LuPin />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      mutatePinNote.mutate(notes);
                    }}
                    className={`absolute w-6 h-6 rounded-full bg-black text-white justify-center items-center right-[-10px] top-[-7px] hidden ${
                      !notes.isPinned ? "hidden" : "md:flex"
                    }`}
                  >
                    <PiPushPinSlashLight />
                  </button>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`absolute w-6 h-6 rounded-full bg-black text-white justify-center items-center right-[-10px] top-[-7px] md:hidden ${
                      notes.isPinned ? "flex" : "hidden"
                    }`}
                  >
                    <PiPushPinSlashLight />
                  </span>
                </header>
                <div
                  style={{
                    overflowWrap: "break-word",
                    fontWeight: notes.isBold ? "900" : "normal",
                    fontStyle: notes.isItalic ? "italic" : "normal",
                  }}
                  className=" pt-5 h-[87%] overflow-hidden"
                >
                  <p
                    style={{
                      whiteSpace: "pre-line",
                      fontWeight: notes.isBold ? "bold" : "normal",
                    }}
                    className="text-sm"
                  >
                    {notes.content}
                  </p>
                </div>
                <footer className="flex justify-between items-center pt-1.5 absolute bottom-1 right-0 left-0 w-full px-2.5">
                  <small>{notes.createdAt.slice(0, 10)}</small>
                  <div
                    className="space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={`hidden md:inline ${
                        notes.isFavorite ? "text-red-500" : "text-black"
                      }`}
                      onClick={() => mutateFavoriteNote.mutate(notes)}
                    >
                      {notes.isFavorite ? <IoMdHeart /> : <FiHeart />}
                    </button>
                    <button
                      className="hidden md:inline"
                      onClick={() => deleteNote.mutate(notes)}
                    >
                      <FiTrash2 />
                    </button>
                    <Popover>
                      <PopoverTrigger>
                        <span className="hidden md:inline">
                          <CiCircleInfo />
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="bg-[#0A0F13] text-white w-[400px] z-50 flex flex-col">
                        <h1>NOTE DETAILS</h1>
                        <small>
                          <span>CREATED AT:</span>{" "}
                          {dateFormatter.format(new Date(notes.createdAt))}
                        </small>
                        <small>
                          <span>UPDATED AT:</span>{" "}
                          {dateFormatter.format(new Date(notes.updatedAt))}
                        </small>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div
                    className="md:hidden flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Menubar>
                      <MenubarMenu>
                        <MenubarTrigger>
                          <BsThreeDotsVertical />
                        </MenubarTrigger>
                        <MenubarContent className="bg-black text-white rounded-md divide-y-[1px] divide-[#27272A]">
                          <MenubarItem
                            className="cursor-pointer font-primary p-2 flex gap-2"
                            onClick={() => mutatePinNote.mutate(notes)}
                          >
                            <span>
                              <MdOutlinePushPin />
                            </span>
                            {notes.isPinned ? "Unpin" : "Pin"}
                          </MenubarItem>
                          <MenubarItem
                            className="cursor-pointer font-primary p-2 flex gap-2"
                            onClick={() => {
                              mutateFavoriteNote.mutate(notes);
                            }}
                          >
                            <span>
                              {notes.isFavorite ? (
                                <MdOutlineHeartBroken />
                              ) : (
                                <IoIosHeartEmpty />
                              )}
                            </span>
                            {notes.isFavorite
                              ? "Remove from Favorites"
                              : "Add to Favorites"}
                          </MenubarItem>
                          <MenubarItem
                            className="cursor-pointer font-primary p-2 flex gap-2"
                            onClick={() => deleteNote.mutate(notes)}
                          >
                            <span>
                              <FiTrash2 />
                            </span>
                            Delete
                          </MenubarItem>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                    <Popover>
                      <PopoverTrigger>
                        <span className="cursor-pointer font-primary p-2 flex gap-2">
                          <CiCircleInfo />
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="bg-[#0A0F13] text-white z-50 flex flex-col">
                        <h1>NOTE DETAILS</h1>
                        <small>
                          <span>CREATED AT:</span>{" "}
                          {dateFormatter.format(new Date(notes.createdAt))}
                        </small>
                        <small>
                          <span>UPDATED AT:</span>{" "}
                          {dateFormatter.format(new Date(notes.updatedAt))}
                        </small>
                      </PopoverContent>
                    </Popover>
                  </div>
                </footer>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchedNotes;
