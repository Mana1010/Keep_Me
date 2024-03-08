"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import signupIcon from "../components/img/signupIcon.png";
import Image from "next/image";
import Link from "next/link";
import { MdScheduleSend, MdSend } from "react-icons/md";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/utils/baseUrl";
export interface Data {
  email: string;
  username: string;
  password: string;
  confirmpassword: string;
}
function Signup() {
  const router = useRouter();
  const matches = useMediaQuery("(min-width: 640px)");
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const { register, handleSubmit, reset, formState, watch } = useForm<Data>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmpassword: "",
    },
  });

  const { errors } = formState;
  const signupMutation = useMutation({
    mutationFn: async (data: Data) => {
      const response = await axios.post(`${BASE_URL}/auth/signup`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data.message;
    },
    onSuccess: (data) => {
      toast.success(data, {
        position: matches ? "bottom-right" : "top-center",
      });
      reset();
      router.push("/login");
    },
    onError: (err: any) => {
      toast.error(err.response.data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });
  function formSubmit(data: Data) {
    signupMutation.mutate(data);
  }
  return (
    <div className="grid w-full h-screen grid-cols-1 lg:grid-cols-2 items-center px-5 justify-end">
      <form
        autoComplete="off"
        className="w-full h-[530px] md:w-[70%] shadow-sm shadow-[#120C18] rounded-sm p-2"
        onSubmit={handleSubmit(formSubmit)}
      >
        <header className="px-1.5 py-1 flex flex-col relative h-[100px]">
          <h3 className="text-2xl font-semibold text-[#120C18]">SIGN UP</h3>
          <small className="text-[#120C18]">Create an account for free</small>
          <small className="absolute bottom-5 text-red-500 text-[0.8rem]">
            {errors.password?.message && errors.password.message}
          </small>
          <small className="absolute bottom-0 text-red-500 text-[0.8rem]">
            {errors.confirmpassword?.message && errors.confirmpassword.message}
          </small>
        </header>
        <div className="pt-3 px-2 space-y-2">
          <div className="space-y-1 flex flex-col">
            <label htmlFor="email" className="font-semibold text-[0.7rem]">
              EMAIL ADDRESS
            </label>
            <input
              disabled={signupMutation.isPending}
              required
              {...register("email")}
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              placeholder="e.g johnwaltz@gmail.com"
              className="border-[1px] border-[#120C18] outline-none px-2 h-10 placeholder:text-[#120C18]/80"
            />
          </div>
          <div className="space-y-1 flex flex-col">
            <label htmlFor="username" className="font-semibold text-[0.7rem]">
              USERNAME
            </label>
            <input
              disabled={signupMutation.isPending}
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
                disabled={signupMutation.isPending}
                required
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="off"
                placeholder="*******"
                className="w-[85%] outline-none h-full bg-transparent"
                {...register("password", {
                  pattern: {
                    value: /^\S+$/,
                    message: "Don't put spaces",
                  },
                  validate: {
                    shortPassword: (fieldValue: string) => {
                      return (
                        fieldValue.length > 8 ||
                        "Password must be greater than to 8 characters"
                      );
                    },
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </div>
          </div>
          <div className="space-y-1 flex flex-col">
            <label
              htmlFor="confirmpassword"
              className="font-semibold text-[0.7rem]"
            >
              CONFIRM PASSWORD
            </label>
            <div className="border-[1px] border-[#120C18] outline-none px-2 h-10 placeholder:text-[#120C18]/80 flex justify-between">
              <input
                disabled={signupMutation.isPending}
                required
                type={showConPassword ? "text" : "password"}
                autoComplete="off"
                id="confirmpassword"
                placeholder="*******"
                className="w-[85%] outline-none h-full bg-transparent"
                {...register("confirmpassword", {
                  validate: {
                    passwordMatch: (fieldValue: string) => {
                      return (
                        fieldValue === watch("password") ||
                        "Password do not match"
                      );
                    },
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowConPassword((prev) => !prev)}
              >
                {showConPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </div>
          </div>
        </div>
        <div className="pl-2 pt-2">
          <small className="text=[#120C18]">Already have an account?</small>{" "}
          <Link href={"/login"}>
            <small className="text-blue-700 underline decoration-blue-700">
              Login Here
            </small>
          </Link>
        </div>
        <div className="w-full flex justify-end pt-8 pr-2">
          <button
            disabled={signupMutation.isPending}
            type="submit"
            className="text-end px-5 flex items-center gap-2 rounded-sm text-white bg-[#120C18] py-2"
          >
            <span>{signupMutation.isPending ? "SUBMITTING" : "REGISTER"}</span>
            <span>
              {" "}
              {signupMutation.isPending ? <MdScheduleSend /> : <MdSend />}
            </span>
          </button>
        </div>
      </form>
      <Image
        src={signupIcon}
        alt="signupIcon"
        priority
        className="lg:block hidden w-[80%]"
      />
    </div>
  );
}

export default Signup;
