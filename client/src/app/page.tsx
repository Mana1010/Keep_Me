"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import keepMeIcon from "./components/img/keepMe.png";
import Link from "next/link";
import { utilStore } from "@/store/util.store";
import { useRouter } from "next/navigation";
import { MdOutlineSecurity, MdPhonelink } from "react-icons/md";
import { GiToken } from "react-icons/gi";
export default function Home() {
  const { setCurrentUser } = utilStore();
  const router = useRouter();
  const { currentUser, setCurrentUser } = utilStore();
    useEffect(() => {
    setCurrentUser();
  }, []);
  return (
    <main className="w-full h-screen overflow-y-auto relative">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center h-full w-full px-4">
        <div className="flex flex-col w-full justify-center items-center">
          <h1 className="text-[#120C18] font-extrabold md:text-[5rem] text-[4rem]">
            KeepMe
          </h1>
          <p className="text-lg italic text-[#120C18] text-center">
            Effortless Note-taking, Anytime, Anywhere with KeepMe.
          </p>
          <button
            className="mt-2 w-[70%] text-white bg-[#120C18] h-[45px]"
            onClick={() => {
              if (currentUser) {
                router.push("/notes");
              } else {
                router.push(
                  "/login?" + new URLSearchParams({ message: "Log in first" })
                );
              }
            }}
          >
            ADD YOUR NOTES
          </button>
          <div>
            <small className="text=[#120C18]">No Account Yet?</small>{" "}
            <Link href={"/signup"}>
              <small className="text-blue-700 underline decoration-blue-700">
                Signup Here
              </small>
            </Link>
          </div>
        </div>
        <Image
          src={keepMeIcon}
          alt="keepMe"
          priority
          className="mx-auto w-[350px] sm:w-[400px] md:w-full"
        />
      </div>
      <div className="flex w-full justify-center items-center px-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-full w-[80%] sm:w-[100%] xl:w-[90%] gap-5">
          <div className=" text-white flex justify-center items-center h-[400px] bg-[#171717] rounded-md flex-col space-y-2 px-3">
            <span className="text-[3.6rem] text-white">
              <MdPhonelink />
            </span>
            <h1 className="font-bold text-xl">RESPONSIVE</h1>
            <small className="text-center">
              Experience seamless usability on any device with our app&apos;s
              responsive design. Whether on desktop, tablet, or smartphone,
              enjoy an optimal and intuitive interface that adapts dynamically.
              Embrace the flexibility of our design for a consistently smooth
              and enjoyable user experience across various screen sizes and
              devices.
            </small>
          </div>
          <div className=" text-white flex justify-center items-center h-[400px] bg-[#171717] rounded-md flex-col space-y-2 px-3">
            <span className="text-[3.6rem] text-white">
              <MdOutlineSecurity />
            </span>
            <h1 className="font-bold text-xl">SECURITY</h1>
            <small className="text-center">
              Prioritize your security with our app&apos;s robust measures,
              including advanced password hashing. Your sensitive information is
              encrypted for an added layer of protection, ensuring a secure and
              trustworthy experience within the app.
            </small>
          </div>
          <div className=" text-white flex justify-center items-center h-[400px] bg-[#171717] rounded-md flex-col space-y-2 px-3">
            <span className="text-[3.6rem] text-white">
              <GiToken />
            </span>
            <h1 className="font-bold text-xl">TOKEN BASED AUTH</h1>
            <small className="text-center">
              Fortify your app&apos;s security with token-based authentication,
              ensuring each user&apos;s unique access. Our system goes beyond
              passwords, employing advanced encryption for data protection and
              secure user interactions. Trust in a seamless yet robust
              experience, safeguarded against unauthorized access.
            </small>
          </div>
        </div>
      </div>
      <footer className="pt-5 h-[90px] w-full bg-[#171717] flex items-center justify-center flex-col space-y-1 py-3">
        <h1 className="text-white text-[1.3rem]">KeepMe</h1>
        <small className="text-white">Made with: TRISTAN VIC CLARITO</small>
        <small className="text-white font-bold">ALL RIGHT RESERVED 2024</small>
      </footer>
    </main>
  );
}
