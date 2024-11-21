"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { PiBellSimpleRinging } from "react-icons/pi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Loading from "@/components/ui/Loading";
import { motion } from "framer-motion";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { LiaTrashAlt, LiaTrashRestoreAltSolid } from "react-icons/lia";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdInfoOutline as CiCircleInfo } from "react-icons/md";
import { utilStore } from "@/store/util.store";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { BASE_URL } from "@/utils/baseUrl";
import { dateFormatter } from "@/utils/dateFormatter.utils";
import SearchedTrash from "./_components/SearchedTrash";
import { NoteTrashData } from "@/types/shared.type";
import useTrashMutation from "@/hooks/useTrashMutation.hook";
import Searchbar from "@/components/Searchbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Alert from "@/components/ui/ExpiredToken";
import { AxiosError } from "axios";

function Trash() {
  const { openAlert } = utilStore();
  const axiosIntercept = useAxiosIntercept();
  const { deleteAllTrash, deleteTrash, restoreNote } = useTrashMutation();
  const [searchTrash, setSearchedTrash] = useState<string>("");
  const getTrash: UseQueryResult<
    NoteTrashData[],
    AxiosError<{ message: string }>
  > = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const response = await axiosIntercept.get(`${BASE_URL}/user/trashes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        withCredentials: true,
      });
      return response.data.message;
    },
    refetchOnWindowFocus: false,
  });

  if (getTrash.isLoading) {
    return <Loading>Your Trash is Loading...</Loading>;
  }
  return (
    <div className="w-full h-screen px-3 relative">
      <Searchbar
        searchedNoteTitle={searchTrash}
        setSearchedNote={setSearchedTrash}
      />
      {/* For Trash */}
      <div className={`w-full h-[72%] md:h-[76%] oveflow-y-auto`}>
        <div className="py-1.5">
          <div
            className={`flex justify-between items-center w-full border-[1px] border-[#E5E7EB] px-2.5 py-3`}
          >
            <div className="flex items-center gap-2">
              <span>
                <PiBellSimpleRinging />
              </span>
              <p className="text-[0.87rem]">
                Your trash will be automatically deleted permanently after 7
                days
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                style={{
                  pointerEvents: getTrash.data?.length === 0 ? "none" : "auto",
                }}
              >
                {" "}
                <span
                  className={`text-sm px-6 py-2 lg:block hidden text-white rounded-lg ${
                    getTrash.data?.length === 0
                      ? "bg-slate-400"
                      : "bg-[#2e2e2e]"
                  }`}
                >
                  Empty Trash
                </span>
                <span
                  className={`text-lg px-4 py-2 lg:hidden block text-white rounded-lg ${
                    getTrash.data?.length === 0
                      ? "bg-slate-400"
                      : "bg-[#2e2e2e]"
                  }`}
                >
                  <MdOutlineDeleteSweep />
                </span>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#101012] text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete{" "}
                    {(getTrash.data?.length as number) <= 1 ? "this" : "these"}{" "}
                    {getTrash.data?.length}{" "}
                    {(getTrash.data?.length as number) <= 1 ? "note" : "notes"}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your trash and remove your trash from our database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAllTrash.mutate()}
                    className="bg-[#1E1C1D]"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {getTrash.data?.length === 0 ? (
          <div className="space-y-4 flex flex-col justify-center items-center h-full">
            <span className="text-slate-400 text-[5rem]">
              {<FaRegTrashAlt />}
            </span>
            <h1 className="text-2xl text-[#BFC8D4] font-bold">NO TRASH</h1>
          </div>
        ) : (
          <div
            id="notes"
            className="overflow-y-auto grid w-full h-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-center items-center py-3"
          >
            {" "}
            {getTrash.data?.map((notes: NoteTrashData) => (
              <motion.div
                layout
                key={notes._id}
                style={{ backgroundColor: notes.bgColor }}
                className="border-[1px] border-[#e0e0e0] h-[380px] rounded-md px-3 py-2 relative hover:shadow-xl shadow-black transition-shadow ease-in duration-200"
              >
                <header className="flex justify-between items-center w-full">
                  <h3 className="font-extrabold text-sm break-all">
                    {notes.title}
                  </h3>
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
                  <div className="space-x-2">
                    <button
                      onClick={() => restoreNote.mutate(notes)}
                      className={`hidden md:inline text-lg 
                      `}
                    >
                      <LiaTrashRestoreAltSolid />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <span className="hidden md:inline text-lg">
                          <LiaTrashAlt />
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#101012] text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this trash?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.{" "}
                            <span className="font-bold">{notes.title}</span>{" "}
                            will be deleted permanently.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteTrash.mutate(notes)}
                            className="bg-[#1E1C1D]"
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Popover>
                      <PopoverTrigger>
                        <span className="hidden md:inline text-lg">
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
                        <small>
                          <span>DELETED AT:</span>{" "}
                          {dateFormatter.format(new Date(notes.createdTrashAt))}
                        </small>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="md:hidden flex">
                    <Menubar>
                      <MenubarMenu>
                        <MenubarTrigger>
                          <BsThreeDotsVertical />
                        </MenubarTrigger>
                        <MenubarContent className="bg-black text-white rounded-md divide-y-[1px] divide-[#27272A]">
                          <MenubarItem
                            className="cursor-pointer font-primary p-2 flex gap-2 text-sm"
                            onClick={() => restoreNote.mutate(notes)}
                          >
                            <span>
                              <LiaTrashRestoreAltSolid />
                            </span>
                            Restore
                          </MenubarItem>
                          <AlertDialog>
                            <AlertDialogTrigger className="w-full text-sm">
                              {" "}
                              <span className="cursor-pointer font-primary p-2 flex gap-2 w-full items-center">
                                <span>
                                  <LiaTrashAlt />
                                </span>
                                Delete
                              </span>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#101012] text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this trash?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.{" "}
                                  <span className="font-bold">
                                    {notes.title}
                                  </span>{" "}
                                  will be deleted permanently.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteTrash.mutate(notes)}
                                  className="bg-[#1E1C1D]"
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                        <small>
                          <span>DELETED AT:</span>{" "}
                          {dateFormatter.format(new Date(notes.createdTrashAt))}
                        </small>
                      </PopoverContent>
                    </Popover>
                  </div>
                </footer>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {/* For Search Trash */}
      {searchTrash.trim() && (
        <SearchedTrash getTrash={getTrash.data} searchTrash={searchTrash} />
      )}
      {openAlert && <Alert />}
    </div>
  );
}

export default Trash;
