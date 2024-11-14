"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MdInfoOutline as CiCircleInfo } from "react-icons/md";
import { PiPushPinSlashLight } from "react-icons/pi";
import { motion } from "framer-motion";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiTrash2, FiHeart } from "react-icons/fi";
import { IoMdHeart, IoIosHeartEmpty } from "react-icons/io";
import { MdOutlinePushPin } from "react-icons/md";
import { MdOutlineHeartBroken } from "react-icons/md";
import { NoteData } from "@/types/shared.type";
import { useRouter } from "next/navigation";
import { dateFormatter } from "@/utils/dateFormatter.utils";
import useNoteMutation from "@/hooks/useNoteMutation.hook";

interface PinnedNotesSchema {
  allNotes: NoteData[] | undefined;
  handlePinAction: (noteId: string) => void;
  handleAddFavoriteAction: (noteId: string) => void;
  handleTrash: (noteId: string) => void;
}
function PinnedNotes({
  allNotes,
  handlePinAction,
  handleAddFavoriteAction,
  handleTrash,
}: PinnedNotesSchema) {
  const { mutateFavoriteNote, mutatePinNote, deleteNote } = useNoteMutation();
  const filterNotePinned = allNotes
    ?.filter((user) => user.isPinned)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  const router = useRouter();
  return (
    <div className={` py-2 px-2.5`}>
      <h6 className="font-semibold text-slate-700 text-[13px]">PINNED</h6>
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-3 pt-1 relative">
        {filterNotePinned?.map((filteredNote) => (
          <motion.div
            onClick={() => {
              router.push(`notes/${filteredNote._id}`);
            }}
            layout
            key={filteredNote._id}
            style={{ backgroundColor: filteredNote.bgColor }}
            className={`border-[1px] border-[#e0e0e0] h-[380px] rounded-md px-3 py-2 relative hover:shadow-xl shadow-black transition-shadow ease-in duration-200`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                mutatePinNote.mutate(filteredNote);
                handlePinAction(filteredNote._id);
              }}
              className="absolute w-6 h-6 rounded-full bg-black text-white md:flex justify-center items-center right-[-10px] top-[-7px] hidden"
            >
              <PiPushPinSlashLight />
            </button>
            <span
              className="absolute w-6 h-6 rounded-full bg-black text-white flex justify-center items-center right-[-10px] top-[-7px] md:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <PiPushPinSlashLight />
            </span>
            <header>
              <h3 className="font-extrabold text-sm break-all">
                {filteredNote.title}
              </h3>
            </header>
            <div
              style={{
                overflowWrap: "break-word",
                fontWeight: filteredNote.isBold ? "900" : "normal",
                fontStyle: filteredNote.isItalic ? "italic" : "normal",
              }}
              className=" pt-5 h-[87%] overflow-hidden"
            >
              <p
                style={{
                  whiteSpace: "pre-line",
                  fontWeight: filteredNote.isBold ? "bold" : "normal",
                }}
                className="text-sm"
              >
                {filteredNote.content}
              </p>
            </div>
            <footer className="flex justify-between items-center pt-1.5 absolute bottom-1 right-0 left-0 w-full px-2.5">
              <small>{filteredNote.createdAt.slice(0, 10)}</small>
              <div className="space-x-2" onClick={(e) => e.stopPropagation()}>
                <button
                  className={`hidden md:inline ${
                    filteredNote.isFavorite ? "text-red-500" : "text-black"
                  }`}
                  onClick={() => {
                    mutateFavoriteNote.mutate(filteredNote);
                    handleAddFavoriteAction(filteredNote._id);
                  }}
                >
                  {filteredNote.isFavorite ? <IoMdHeart /> : <FiHeart />}
                </button>
                <button
                  className="hidden md:inline"
                  onClick={() => {
                    deleteNote.mutate(filteredNote);
                    handleTrash(filteredNote._id);
                  }}
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
                      {dateFormatter.format(new Date(filteredNote.createdAt))}
                    </small>
                    <small>
                      <span>UPDATED AT:</span>{" "}
                      {dateFormatter.format(new Date(filteredNote.updatedAt))}
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
                        onClick={() => {
                          mutatePinNote.mutate(filteredNote);
                          handlePinAction(filteredNote._id);
                        }}
                      >
                        <span>
                          <MdOutlinePushPin />
                        </span>
                        {filteredNote.isPinned ? "Unpin" : "Pin"}
                      </MenubarItem>
                      <MenubarItem
                        className="cursor-pointer font-primary p-2 flex gap-2"
                        onClick={() => {
                          mutateFavoriteNote.mutate(filteredNote);
                        }}
                      >
                        <span>
                          {filteredNote.isFavorite ? (
                            <MdOutlineHeartBroken />
                          ) : (
                            <IoIosHeartEmpty />
                          )}
                        </span>
                        {filteredNote.isFavorite
                          ? "Remove from Favorites"
                          : "Add to Favorites"}
                      </MenubarItem>
                      <MenubarItem
                        className="cursor-pointer font-primary p-2 flex gap-2"
                        onClick={() => deleteNote.mutate(filteredNote)}
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
                      {dateFormatter.format(new Date(filteredNote.createdAt))}
                    </small>
                    <small>
                      <span>UPDATED AT:</span>{" "}
                      {dateFormatter.format(new Date(filteredNote.updatedAt))}
                    </small>
                  </PopoverContent>
                </Popover>
              </div>
            </footer>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PinnedNotes;
