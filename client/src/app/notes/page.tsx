"use client";
import React from "react";
import { useEffect, useState } from "react";
import Alert from "@/components/ui/ExpiredToken";
// import checkToken from "@/utils/checkToken";
import { useRouter } from "next/navigation";
import { utilStore } from "@/store/util.store";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaCirclePlus } from "react-icons/fa6";
import AddNote from "../components/Notes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast as toaster } from "sonner";
import { UserNote } from "@/store/note.store";
import { TbNotes } from "react-icons/tb";
import { LuPin } from "react-icons/lu";
import Loading from "@/components/ui/Loading";
import { PiPushPinSlashLight } from "react-icons/pi";
import Image from "next/image";
import emptyNotes from "../components/img/emptyNote.png";
import { useMediaQuery } from "usehooks-ts";
import { motion } from "framer-motion";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiTrash2, FiHeart } from "react-icons/fi";
import { IoMdHeart, IoIosHeartEmpty } from "react-icons/io";
import { MdOutlinePushPin } from "react-icons/md";
import { MdOutlineHeartBroken } from "react-icons/md";
import noResult from "../components/img/no-result-found.png";
import { MdInfoOutline as CiCircleInfo } from "react-icons/md";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { BASE_URL } from "@/utils/baseUrl";
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

export interface NoteData extends UserNote {
  _id: string;
  createdBy: string;
  updatedAt: string;
  createdAt: string;
  owner: string;
  noteId: string;
}
function Notes() {
  const axiosIntercept = useAxiosIntercept();
  const matches = useMediaQuery("(min-width: 640px)");
  const [addNote, setAddNote] = useState(false);
  const [searchedNoteTitle, setSearchedNoteTitle] = useState<string>("");
  const router = useRouter();
  const { openAlert } = utilStore();
  const {
    isLoading,
    data,
  }: {
    isError: boolean;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    data?: NoteData[];
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await axiosIntercept.get(`${BASE_URL}/user/notes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        withCredentials: true,
      });
      return response.data.message;
    },
  });
  const queryClient = useQueryClient();
  const mutatePinNote = useMutation({
    mutationFn: async (data: NoteData) => {
      const response = await axiosIntercept.patch(
        `${BASE_URL}/user/notes/pin/${data.noteId}`,
        { isPinned: !data.isPinned },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      toaster.success(data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
    onError: (error: any) => {
      toaster.error(error.response?.data?.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });
  const mutateFavoriteNote = useMutation({
    mutationFn: async (data: NoteData) => {
      const response = await axiosIntercept.patch(
        `${BASE_URL}/user/notes/favorite/${data.noteId}`,
        { isFavorite: !data.isFavorite },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      toaster.success(data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
    onError: (error: any) => {
      toaster.error(error.response.data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });
  const deleteNote = useMutation({
    mutationFn: async (data: NoteData) => {
      const response = await axiosIntercept.delete(
        `${BASE_URL}/user/notes/${data.noteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      toaster.success(data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
    onError: (error: any) => {
      toaster.error(error.response.data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });

  if (isLoading) {
    return <Loading>Your Notes is Loading...</Loading>;
  }
  const searchedNotes: NoteData[] | undefined = data?.filter((note) =>
    new RegExp(searchedNoteTitle as string, "i").test(note.title)
  );
  const checkIsPinned = data?.some((user) => user.isPinned);
  const checkisUnpinned = data?.every((user) => user.isPinned);
  const filterNotePinned = data?.filter((user) => user.isPinned);
  const filteredNotenotPinned = data?.filter((user) => !user.isPinned);
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="h-screen w-full px-4 py-2 relative">
      <div className="flex justify-between items-center w-full md:pt-0 pt-[35px]">
        <h2 className="text-black text-[2.5rem] font-bold">MY NOTES</h2>
        <div className="flex gap-2">
          <div className="flex space-x-2 items-center shadow-md px-1.5 rounded-md">
            <span className="text-lg">
              <TbNotes />
            </span>
            <h5 className="font-bold">{data?.length}</h5>
          </div>
        </div>
      </div>
      <div className="w-full rounded-md h-[45px] flex shadow shadow-black mt-2 gap-2 items-center px-2 relative z-10">
        <label htmlFor="searchbox-notes" className=" text-xl px-1">
          {" "}
          <CiSearch />
        </label>
        <input
          onChange={(e) => {
            setSearchedNoteTitle((prev) => e.target.value);
          }}
          value={searchedNoteTitle as string}
          autoComplete="off"
          id="searchbox-notes"
          type="text"
          placeholder="Search your Notes"
          className="outline-none bg-transparent caret-black w-[95%]"
        />
      </div>{" "}
      <div
        className={` w-full h-[76%] md:h-[82%] pt-1 ${
          searchedNoteTitle ? "hidden" : "block"
        }`}
      >
        {data?.length === 0 ? (
          <div className="flex justify-center items-center flex-col w-full h-full space-y-2">
            <Image width={210} src={emptyNotes} alt="emptynote" priority />
            <h1 className="font-bold text-slate-400 text-3xl text-center">
              YOU HAVE NO NOTES
            </h1>
            <div className="space-x-2 ">
              <h1 className="flex items-center gap-2 text-slate-400 text-xl">
                Click the{" "}
                <span>
                  <FaCirclePlus />
                </span>
                to add note
              </h1>
            </div>
          </div>
        ) : (
          // For Pinned Notes
          <div
            id="note-with-pin-container"
            className={`${checkIsPinned && "overflow-y-auto"} w-full h-full`}
          >
            <div className={`${!checkIsPinned && "hidden"} py-2 px-2.5`}>
              <h6 className="font-semibold text-slate-700 text-[13px]">
                PINNED
              </h6>
              <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-3 pt-1 relative">
                {filterNotePinned?.map((filteredNote) => (
                  <motion.div
                    onClick={() => {
                      router.push(`notes/${filteredNote.noteId}`);
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
                      <div
                        className="space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className={`hidden md:inline ${
                            filteredNote.isFavorite
                              ? "text-red-500"
                              : "text-black"
                          }`}
                          onClick={() => {
                            mutateFavoriteNote.mutate(filteredNote);
                          }}
                        >
                          {filteredNote.isFavorite ? (
                            <IoMdHeart />
                          ) : (
                            <FiHeart />
                          )}
                        </button>
                        <button
                          className="hidden md:inline"
                          onClick={() => deleteNote.mutate(filteredNote)}
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
                              {dateFormatter.format(
                                new Date(filteredNote.createdAt)
                              )}
                            </small>
                            <small>
                              <span>UPDATED AT:</span>{" "}
                              {dateFormatter.format(
                                new Date(filteredNote.updatedAt)
                              )}
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
                                onClick={() =>
                                  mutatePinNote.mutate(filteredNote)
                                }
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
                              {dateFormatter.format(
                                new Date(filteredNote.createdAt)
                              )}
                            </small>
                            <small>
                              <span>UPDATED AT:</span>{" "}
                              {dateFormatter.format(
                                new Date(filteredNote.updatedAt)
                              )}
                            </small>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </footer>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* For the unPinned Notes */}
            <div
              id="notes"
              className={`${!checkIsPinned && "overflow-y-auto"} ${
                checkisUnpinned && "hidden"
              } grid w-full h-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 `}
            >
              {filteredNotenotPinned?.map((notes: NoteData) => (
                <motion.div
                  onClick={() => {
                    router.push(`notes/${notes.noteId}`);
                  }}
                  layout
                  key={notes._id}
                  style={{ backgroundColor: notes.bgColor }}
                  className="border-[1px] border-[#e0e0e0] h-[380px] rounded-md px-3 py-2 relative hover:shadow-xl shadow-black transition-shadow ease-in duration-200"
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
                      className=" text-black md:flex hidden"
                    >
                      <LuPin />
                    </button>
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
      {/* For Search Note Div */}
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
                    router.push(`notes/${notes.noteId}`);
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
      <button
        onClick={() => {
          setAddNote((prev) => !prev);
        }}
        className="absolute right-[20px] bottom-[20px] rounded-full w-[50px] h-[50px] bg-[#2E2E2E] flex justify-center items-center animate-bounce"
      >
        <span className="text-white">
          {" "}
          <FaPlus />
        </span>
      </button>
      {addNote && <AddNote setAddNote={setAddNote} />}
      {openAlert && <Alert />}
    </div>
  );
}

export default Notes;
