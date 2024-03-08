"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import loginIcon from "../components/img/loginIcon.png";
import Image from "next/image";
import Link from "next/link";
import { MdScheduleSend, MdSend } from "react-icons/md";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { utilStore } from "@/store/util.store";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/utils/baseUrl";
interface Data {
  username: string;
  password: string;
}
function Login() {
  const search = useSearchParams();
  const { setCurrentUser } = utilStore();
  const router = useRouter();
  const matches = useMediaQuery("(min-width: 640px)");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset } = useForm<Data>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: Data) => {
      const response = await axios.post(`${BASE_URL}/auth/login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("userToken", data.token);
      toast.success(data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
      setCurrentUser();
      reset();
      router.push("/notes");
    },
    onError: (err: any) => {
      toast.error(err.response.data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });
  function formSubmit(data: Data) {
    loginMutation.mutate(data);
  }
  return (
    <div className="grid w-full h-screen grid-cols-1 lg:grid-cols-2 items-center px-5 justify-end">
      <form
        autoComplete="off"
        className="w-full h-[380px] md:w-[70%] shadow-sm shadow-[#120C18] rounded-sm p-2"
        onSubmit={handleSubmit(formSubmit)}
      >
        <header className="px-1.5 py-1 flex flex-col relative">
          <h3 className="text-2xl font-semibold text-[#120C18]">LOG IN</h3>
          <small className="text-[#120C18]">Authenticate yourself</small>
          <small className="text-red-500 text-[13px] absolute bottom-[-17px]">
            {search.get("message") && search.get("message")}
          </small>
        </header>
        <div className="pt-8 px-2 space-y-2">
          <div className="space-y-1 flex flex-col">
            <label htmlFor="username" className="font-semibold text-[0.7rem]">
              USERNAME
            </label>
            <input
              disabled={loginMutation.isPending}
              required
              {...register("username")}
              type="text"
              id="username"
              name="username"
              autoComplete="off"
              placeholder="e.g John Waltz"
              className="border-[1px] border-[#120C18] outline-none px-2 h-10 placeholder:text-[#120C18]/80"
            />
          </div>
          <div className="space-y-1 flex flex-col">
            <label htmlFor="password" className="font-semibold text-[0.7rem]">
              PASSWORD
            </label>
            <div className="border-[1px] border-[#120C18] outline-none px-2 h-10 placeholder:text-[#120C18]/80 flex justify-between">
              <input
                disabled={loginMutation.isPending}
                required
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="off"
                placeholder="*******"
                className="w-[85%] outline-none h-full bg-transparent"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </div>
          </div>
        </div>
        <div className="pl-2 pt-2">
          <small className="text=[#120C18]">No Account Yet?</small>{" "}
          <Link href={"/signup"}>
            <small className="text-blue-700 underline decoration-blue-700">
              Sign Up Here
            </small>
          </Link>
        </div>
        <div className="w-full flex justify-end pt-8 pr-2">
          <button
            disabled={loginMutation.isPending}
            type="submit"
            className="text-end px-5 flex items-center gap-2 rounded-sm text-white bg-[#120C18] py-2"
          >
            <span>
              {loginMutation.isPending ? "AUTHENTICATING" : "AUTHENTICATE"}
            </span>
            <span>
              {" "}
              {loginMutation.isPending ? <MdScheduleSend /> : <MdSend />}
            </span>
          </button>
        </div>
      </form>
      <Image
        src={loginIcon}
        alt="loginIcon"
        priority
        className="lg:block hidden w-[80%]"
      />
    </div>
  );
}

export default Login;
