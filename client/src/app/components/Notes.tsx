"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import keepMeIcon from "./img/keepMe-lightmode.png";
import { LuPin, LuPinOff } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoColorFillOutline } from "react-icons/io5";
import { TbBold, TbItalic } from "react-icons/tb";
import { LiaListAltSolid, LiaListUlSolid } from "react-icons/lia";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "usehooks-ts";
import { noteStore } from "@/store/note.store";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { BASE_URL } from "@/utils/baseUrl";

interface Data {
  setAddNote: any;
}
function AddNote({ setAddNote }: Data) {
  //For the state
  const { note, openBg, openListStyle } = noteStore();

  //For the setState and Function
  const {
    setNote,
    resetNote,
    colorPickonMouseOver,
    colorPickOnClick,
    listType,
    setListSymbol,
    removeDuplicateSymbols,
    setOpenListStyle,
    setOpenBg,
    setBold,
    setItalic,
    setListOpen,
    setOpenBgPropagate,
    setOpenListStylePropagate,
    setPinned,
    setFavorite,
  } = noteStore();
  const bgColor = [
    "white",
    "#D9BCFC",
    "#BD83FB",
    "#B5EBD3",
    "#F2DC49",
    "#FFB379",
    "#FAA4A5",
    "#F9785B",
    "#FF6160",
    "#FFCAD4",
    "#FFACC6",
    "#FF98B6",
    "#FF87AB",
    "#C4DAC3",
    "#97AF95",
    "#597066",
    "#45544F",
    "#F3E6DE",
    "#E9D1C5",
    "#D5B6A4",
    "#D2A78F",
    "#83B3F1",
    "#579AE9",
    "#2E7AD2",
    "#125FBB",
  ];
  const typeList = [
    {
      name: "dot",
      icon: <LiaListUlSolid />,
      symbol: "●",
    },
    {
      name: "check",
      icon: <LiaListAltSolid />,
      symbol: "✔",
    },
  ];
  const axiosIntercept = useAxiosIntercept();
  const matches = useMediaQuery("(min-width: 640px)");
  const queryClient = useQueryClient();
  const mutateNote = useMutation({
    mutationFn: async () => {
      const response = await axiosIntercept.post(
        `${BASE_URL}/user/notes`,
        note,
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
      toast.success(data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
      resetNote();
      setAddNote((prev: boolean) => !prev);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });
  const listFilter = typeList.find((type) => type.name === note.listType);

  function puttingListSymbol(e: any) {
    const filterSymbols = typeList.find((type) => type.name === note.listType);
    if (e.key === "Enter" && note.isListOpen) {
      setListSymbol(filterSymbols);
      return;
    }
  }
  useEffect(() => {
    const filterSymbols = typeList.find((type) => type.name === note.listType);
    const removeDot = note.content.split("");
    if (note.isListOpen && removeDot[0] !== filterSymbols?.symbol) {
      removeDuplicateSymbols(filterSymbols);
    }
    return;
  }, [note.isListOpen]);
  return (
    <div
      onClick={() => {
        setOpenBgPropagate();
        setOpenListStylePropagate();
      }}
      className="absolute w-full h-screen flex justify-center items-center inset-0 backdrop-blur-lg z-50"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutateNote.mutate();
        }}
        className="w-full md:w-[70%] lg:w-[50%] bg-white h-full md:h-[460px] absolute shadow-sm shadow-black/20 px-2 py-2"
      >
        <header className="flex justify-between items-center py-2">
          <div>
            <Image width={80} src={keepMeIcon} alt="icon" priority />
          </div>
          <div className="space-x-3 flex">
            <button
              name="isPinned"
              type="button"
              className="text-xl"
              onClick={setPinned}
            >
              {note.isPinned ? <LuPin /> : <LuPinOff />}
            </button>
            <button
              name="isBold"
              type="button"
              className="text-xl"
              onClick={setFavorite}
            >
              <span className={`${note.isFavorite && "text-red-500"}`}>
                {note.isFavorite ? <GoHeartFill /> : <GoHeart />}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(), setOpenBg();
              }}
              type="button"
              className="text-xl flex gap-2 px-1.5 items-center shadow-md py-[0.1rem] rounded-lg relative"
            >
              <div
                style={{ backgroundColor: note.bgColor }}
                className={`border-[1px] border-slate-300 w-4 h-4 rounded-full`}
              ></div>

              <IoColorFillOutline />
            </button>
            <div
              className={`absolute top-[50px] right-2 w-[200px] h-[150px] md:h-[100px] p-1 grid grid-cols-5 md:grid-cols-9 justify-center items-center bg-white shadow-md rounded-sm z-10 ${
                !openBg && "hidden"
              }`}
            >
              {bgColor.map((colors) => (
                <button
                  onMouseOver={() => colorPickonMouseOver(colors)}
                  onClick={() => {
                    colorPickOnClick(colors);
                    setOpenBg();
                  }}
                  key={colors}
                  type="button"
                  style={{ backgroundColor: colors }}
                  className={`md:w-4 md:h-4 w-6 h-6 rounded-full ${
                    colors === "white" && "border-[1px] border-slate-200"
                  }`}
                ></button>
              ))}
            </div>
            <button
              onClick={setBold}
              name="isBold"
              type="button"
              className={`text-xl p-[2px] ${
                note.isBold &&
                "bg-slate-100 rounded-lg border-[1px] border-slate-200"
              }`}
            >
              <TbBold />
            </button>
            <button
              onClick={setItalic}
              name="isItalic"
              type="button"
              className={`text-xl p-[2px] ${
                note.isItalic &&
                "bg-slate-100 rounded-lg border-[1px] border-slate-200"
              }`}
            >
              <TbItalic />
            </button>
            <div className="flex items-center shadow-md p-[0.2rem] gap-1">
              <button
                onClick={setListOpen}
                type="button"
                className={`text-lg rounded-md ${
                  note.isListOpen && "bg-slate-100 border-[1px]"
                }`}
              >
                {listFilter?.icon}
              </button>
              <button
                type="button"
                className="shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenListStyle();
                }}
              >
                <MdKeyboardArrowDown />
              </button>
            </div>

            <div
              className={`absolute top-[50px] right-2 w-[100px] p-1 flex justify-center items-center shadow-md rounded-sm z-10 gap-2 ${
                !openListStyle && "hidden"
              }`}
            >
              {typeList.map((type) => (
                <button
                  onMouseOver={() => listType(type.name)}
                  onClick={() => listType(type.name)}
                  key={type.name}
                  type="button"
                  className={`md:w-4 md:h-4 w-6 h-6 rounded-full 
                   "border-[1px] border-slate-300"
                  `}
                >
                  {type.icon}
                </button>
              ))}
            </div>
          </div>
        </header>
        <div className="pt-4 flex flex-col gap-7 px-2">
          <div className="shadow-md py-2.5 rounded-sm w-full flex space-x-2 px-2">
            <h4>TITLE:</h4>
            <input
              onChange={setNote}
              name="title"
              value={note.title}
              className="w-full font-extrabold outline-none"
            />
          </div>
          <div
            style={{ backgroundColor: note.bgColor }}
            className=" w-full md:h-[250px] h-[68vh] rounded-sm p-2"
          >
            <textarea
              id="textarea"
              style={{
                fontWeight: note.isBold ? "900" : "500",
                fontStyle: note.isItalic ? "italic" : "normal",
              }}
              onKeyUp={puttingListSymbol}
              onChange={setNote}
              name="content"
              value={note.content}
              className="w-full resize-none h-full outline-none bg-transparent"
            ></textarea>
          </div>
        </div>
        <div className="w-full flex gap-2 md:pt-3 pt-1.5 justify-end">
          <button
            onClick={() => setAddNote((prev: boolean) => !prev)}
            type="button"
            className="w-[30%] py-2 bg-[#101314] text-white rounded-lg"
          >
            BACK
          </button>
          <button
            type="submit"
            className="w-[70%] py-2 shadow-md bg-[#101314] text-white rounded-lg"
          >
            ADD NOTE
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNote;
