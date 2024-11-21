import React from "react";
import { dateFormatter } from "@/utils/dateFormatter.utils";
import noResult from "../../../assets/images/no-result-found.png";
import Image from "next/image";
import { NoteTrashData } from "@/types/shared.type";
import { motion } from "framer-motion";
import useTrashMutation from "@/hooks/useTrashMutation.hook";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LiaTrashAlt, LiaTrashRestoreAltSolid } from "react-icons/lia";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiCircleInfo } from "react-icons/ci";
interface TrashProps {
  getTrash: NoteTrashData[] | undefined;
  searchTrash: string;
}
function SearchedTrash({ getTrash, searchTrash }: TrashProps) {
  const { deleteTrash, restoreNote } = useTrashMutation();
  const filteredSearchTrash: NoteTrashData[] | undefined = getTrash?.filter(
    (trash: NoteTrashData) => {
      return new RegExp(searchTrash as string, "i").test(trash.title);
    }
  );
  return (
    <div className={`w-full h-[72%] md:h-[76%] oveflow-y-auto `}>
      {filteredSearchTrash?.length === 0 ? (
        <div className="flex justify-center items-center flex-col w-full h-full space-y-2">
          <Image width={210} src={noResult} alt="no-result-found" priority />
          <h1 className="font-bold text-slate-400 text-3xl text-center">
            NO RESULT FOUND
          </h1>
        </div>
      ) : (
        <div
          id="notes"
          className="overflow-y-auto grid w-full h-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-center items-center py-3"
        >
          {" "}
          {filteredSearchTrash?.map((notes: NoteTrashData) => (
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
                      <span
                        className="hidden md:inline text-lg"

                        // onClick={() => deleteNote.mutate(filteredNote)}
                      >
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
                          <span className="font-bold">{notes.title}</span> will
                          be deleted permanently.
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
  );
}

export default SearchedTrash;
