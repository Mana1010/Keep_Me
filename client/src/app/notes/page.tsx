"use client";
import React from "react";
import { useState } from "react";
import Alert from "@/components/ui/ExpiredToken";
import { utilStore } from "@/store/util.store";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaCirclePlus } from "react-icons/fa6";
import AddNote from "@/components/Notes";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { TbNotes } from "react-icons/tb";
import Loading from "@/components/ui/Loading";
import Image from "next/image";
import emptyNotes from "../../assets/images/emptyNote.png";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { BASE_URL } from "@/utils/baseUrl";
import PinnedNotes from "./_components/PinnedNotes";
import UnPinnedNotes from "./_components/UnPinnedNotes";
import SearchedNotes from "./_components/SearchedNotes";
import { AxiosError } from "axios";
import { NoteData } from "@/types/shared.type";
function Notes() {
  const axiosIntercept = useAxiosIntercept();
  const [addNote, setAddNote] = useState(false);
  const [searchedNoteTitle, setSearchedNoteTitle] = useState<string>("");
  const { openAlert } = utilStore();

  const queryClient = useQueryClient();
  const allNotes: UseQueryResult<
    NoteData[],
    AxiosError<{ message: string }>
  > = useQuery({
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
  if (allNotes.isLoading) {
    return <Loading>Your Notes is Loading...</Loading>;
  }
  const searchedNotes: NoteData[] | undefined = allNotes.data?.filter((note) =>
    new RegExp(searchedNoteTitle as string, "i").test(note.title)
  );
  const checkIsPinned = allNotes.data?.some((user) => user.isPinned);
  const filteredNotenotPinned = allNotes.data
    ?.filter((user) => !user.isPinned)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  const handlePinAction = (noteId: string) => {
    queryClient.setQueryData<NoteData[] | undefined>(
      ["notes"],
      (cachedNotes) => {
        if (cachedNotes) {
          return cachedNotes.map((cachedNote) => {
            console.log(cachedNote);
            if (noteId === cachedNote._id) {
              return { ...cachedNote, isPinned: !cachedNote.isPinned };
            } else {
              return cachedNote;
            }
          });
        }
      }
    );
  };

  const handleAddFavoriteAction = (noteId: string) => {
    queryClient.setQueryData<NoteData[] | undefined>(
      ["notes"],
      (cachedNotes) => {
        if (cachedNotes) {
          return cachedNotes.map((cachedNote) => {
            if (noteId === cachedNote._id) {
              return {
                ...cachedNote,
                isFavorite: !cachedNote.isFavorite,
                updatedAt: !cachedNote.isFavorite
                  ? new Date().toString()
                  : cachedNote.updatedAt,
              };
            }
            return cachedNote;
          });
        }
      }
    );
  };

  const handleTrash = (noteId: string) => {
    queryClient.setQueryData<NoteData[] | undefined>(
      ["notes"],
      (cachedNotes) => {
        if (cachedNotes) {
          return cachedNotes.filter((cachedNote) => cachedNote._id !== noteId);
        }
      }
    );
  };

  return (
    <div className="h-screen w-full px-4 py-2 relative">
      <div className="flex justify-between items-center w-full md:pt-0 pt-[35px]">
        <h2 className="text-black text-[2.5rem] font-bold">MY NOTES</h2>
        <div className="flex gap-2">
          <div className="flex space-x-2 items-center shadow-md px-1.5 rounded-md">
            <span className="text-lg">
              <TbNotes />
            </span>
            <h5 className="font-bold">{allNotes.data?.length}</h5>
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
        {allNotes.data?.length === 0 ? (
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
          <div
            id="note-with-pin-container"
            className={`${checkIsPinned && "overflow-y-auto"} w-full h-full`}
          >
            {checkIsPinned && (
              <PinnedNotes
                allNotes={allNotes.data}
                handlePinAction={handlePinAction}
                handleAddFavoriteAction={handleAddFavoriteAction}
                handleTrash={handleTrash}
              />
            )}
            <UnPinnedNotes
              allNotes={allNotes.data}
              checkIsPinned={checkIsPinned as boolean}
              filteredNotenotPinned={filteredNotenotPinned}
              handlePinAction={handlePinAction}
              handleAddFavoriteAction={handleAddFavoriteAction}
              handleTrash={handleTrash}
            />
          </div>
        )}
      </div>
      <SearchedNotes
        searchedNoteTitle={searchedNoteTitle}
        searchedNotes={searchedNotes}
      />
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
