"use client";
import React from "react";
import Router, { useRouter } from "next/navigation";
import { utilStore } from "@/store/util.store";
import forbiddenPic from "../../app/components/img/foribidden-pic.png";
import Image from "next/image";
function Alert() {
  const router = useRouter();
  const { setOpenAlert } = utilStore();
  function ok() {
    setOpenAlert(false);
    router.push("/login");
  }
  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 w-full h-screen backdrop-blur-md flex justify-center items-center px-5 z-[99999]">
      <div className="w-full md:w-[300px] h-[320px] bg-white rounded-md px-5 py-3 border-2 relative border-slate-800 flex justify-center gap-2 items-center flex-col ">
        <Image src={forbiddenPic} alt="forbidden-pic" width={130} priority />
        <h5 className="font-bold uppercase text-center">
          YOU ARE FORIBIDDEN TO ENTER THIS ROUTE
        </h5>
        <small className="text-center">
          Your session token probably expired or you are not authenticated.
        </small>
        <button
          onClick={ok}
          className=" w-full border-2 bg-black text-white py-2"
        >
          RETURN TO LOGIN PAGE
        </button>
      </div>
    </div>
  );
}

export default Alert;
