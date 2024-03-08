"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Alert from "@/components/ui/ExpiredToken";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import Image from "next/image";
import { IoColorFillOutline } from "react-icons/io5";
import { TbBold, TbItalic } from "react-icons/tb";
import { LiaListAltSolid, LiaListUlSolid } from "react-icons/lia";
import keeMeIcon from "../../components/img/keepMe-lightmode.png";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuPin, LuPinOff } from "react-icons/lu";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { editNoteStore } from "@/store/edit.note.store";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { BASE_URL } from "@/utils/baseUrl";
interface Param {
  params: {
    noteId: string;
  };
}
function Note({ params }: Param) {
  const matches = useMediaQuery("(min-width: 640px)");
  const { editInfo, openBg, openListStyle } = editNoteStore();
  const {
    setEditInfo,
    setHandleChange,
    setOpenBgPropagate,
    setOpenListStylePropagate,
    colorPickOnClick,
    colorPickonMouseOver,
    listType,
    setListSymbol,
    setOpenListStyle,
    setOpenBg,
    setBold,
    setItalic,
    setListOpen,
    removeDuplicateSymbols,
    setFavorite,
    setPinned,
  } = editNoteStore();
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
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
  const axiosIntercept = useAxiosIntercept();
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();
  const editNote = useMutation({
    mutationFn: async () => {
      const response = await axiosIntercept.patch(
        `${BASE_URL}/user/notes/${params.noteId}`,
        editInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data.message;
    },
    onSuccess: (data) => {
      toast.success(data, {
        position: matches ? "bottom-right" : "top-center",
      });
      router.push("/notes");
    },
    onError: (err) => {
      toast.error(err.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });
  useQuery({
    queryKey: ["noteId"],
    queryFn: async () => {
      const response = await axiosIntercept.get(
        `${BASE_URL}/user/notes/${params.noteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          withCredentials: true,
        }
      );
      setEditInfo(response.data.message);
      return response.data.message;
    },
  });
  const listFilter = typeList.find((type) => type.name === editInfo.listType);
  useEffect(() => {
    const filterSymbols = typeList.find(
      (type) => type.name === editInfo.listType
    );
    const removeDot = editInfo.content?.split("");
    if (editInfo.isListOpen && removeDot[0] !== filterSymbols?.symbol) {
      removeDuplicateSymbols(filterSymbols);
    }
    return;
  }, [editInfo.isListOpen]);
  function puttingListSymbol(e: any) {
    const filterSymbols = typeList.find(
      (type) => type.name === editInfo.listType
    );
    if (e.key === "Enter" && editInfo.isListOpen) {
      setListSymbol(filterSymbols);
      return;
    }
  }
  return (
    <div
      className="w-full h-screen px-3 flex items-center justify-center"
      onClick={() => {
        setOpenBgPropagate();
        setOpenListStylePropagate();
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editNote.mutate();
        }}
        className="w-full md:w-[70%] lg:w-[50%] bg-white h-full md:h-[460px] absolute shadow-sm shadow-black/20 px-2 py-2"
      >
        <header className="flex justify-between items-center py-2">
          <div>
            <Image width={80} src={keeMeIcon} alt="icon" priority />
          </div>
          <div className="space-x-3 flex">
            <button
              name="isPinned"
              type="button"
              className="text-xl"
              onClick={setPinned}
            >
              {editInfo.isPinned ? <LuPin /> : <LuPinOff />}
            </button>
            <button
              name="isFavorite"
              type="button"
              className={`${editInfo.isFavorite && "text-red-500"} text-xl`}
              onClick={setFavorite}
            >
              {editInfo.isFavorite ? <GoHeartFill /> : <GoHeart />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(), setOpenBg();
              }}
              type="button"
              className="text-xl flex gap-2 px-1.5 items-center shadow-md py-[0.1rem] rounded-lg relative"
            >
              <div
                style={{ backgroundColor: editInfo.bgColor }}
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
                editInfo.isBold &&
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
                editInfo.isItalic &&
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
                  editInfo.isListOpen && "bg-slate-100 border-[1px]"
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
              onChange={setHandleChange}
              name="title"
              value={editInfo.title}
              className="w-full font-extrabold outline-none"
            />
          </div>
          <div
            style={{ backgroundColor: editInfo.bgColor }}
            className=" w-full md:h-[235px] h-[64vh] rounded-sm p-2"
          >
            <textarea
              id="textarea"
              style={{
                whiteSpace: "pre-line",
                fontWeight: editInfo.isBold ? "900" : "500",
                fontStyle: editInfo.isItalic ? "italic" : "normal",
              }}
              onKeyUp={puttingListSymbol}
              onChange={setHandleChange}
              name="content"
              value={editInfo.content}
              className="w-full resize-none h-full outline-none bg-transparent"
            ></textarea>
          </div>
        </div>
        <div>
          <small className="text-black font-bold break-all">
            Last Edited At:{" "}
            <span className="font-extralight">
              {editInfo?.updatedAt
                ? dateFormatter.format(new Date(editInfo.updatedAt))
                : "N/A"}
            </span>
          </small>
        </div>
        <div className="w-full flex gap-2 md:pt-2.5 pt-1 justify-end">
          <button
            type="button"
            className="w-[30%] py-2 bg-[#101314] text-white rounded-lg"
            onClick={() => router.push("/notes")}
          >
            BACK
          </button>
          <button
            type="submit"
            className="w-[70%] py-2 shadow-md bg-[#101314] text-white rounded-lg"
          >
            UPDATE NOTE
          </button>
        </div>
      </form>
      {openAlert && <Alert />}
    </div>
  );
}

export default Note;
