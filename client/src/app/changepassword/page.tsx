"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import changpasswordIcon from "../components/img/changpasswordIcon.png";
import Image from "next/image";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { TbArrowsExchange } from "react-icons/tb";
import { useMutation } from "@tanstack/react-query";
import Alert from "@/components/ui/ExpiredToken";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { utilStore } from "@/store/util.store";
import { BASE_URL } from "@/utils/baseUrl";
export interface Data {
  password: string;
  newpassword: string;
  confirmpassword: string;
}
function ChangePassword() {
  const axiosIntercept = useAxiosIntercept();
  const matches = useMediaQuery("(min-width: 640px)");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const { openAlert } = utilStore();

  const { register, handleSubmit, reset, formState, watch } = useForm<Data>({
    defaultValues: {
      password: "",
      newpassword: "",
      confirmpassword: "",
    },
  });
  const { errors } = formState;

  const changePasswordMutation = useMutation({
    mutationFn: async (data: Data) => {
      const response = await axiosIntercept.patch(
        `${BASE_URL}/auth/changepassword`,
        data
      );
      return response.data.message;
    },
    onSuccess: (data) => {
      reset();
      toast.success(data, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
    onError: (err: any) => {
      toast.error(err.response.data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });
  function formSubmit(data: Data) {
    changePasswordMutation.mutate(data);
  }
  return (
    <div className="grid w-full h-screen grid-cols-1 lg:grid-cols-2 items-center px-5 justify-end">
      <form
        className="w-full h-[460px] md:w-[70%] shadow-sm shadow-[#120C18] rounded-sm p-2"
        onSubmit={handleSubmit(formSubmit)}
      >
        <header className="px-1.5 py-1 flex flex-col relative h-[120px]">
          <h3 className="text-2xl font-semibold text-[#120C18]">
            CHANGE PASSWORD
          </h3>
          <small className="text-[#120C18]">
            Passwords should have a minimum of 9 characters to enhance security.
          </small>
          <small className="absolute bottom-5 text-red-500 text-[0.8rem]">
            {errors.newpassword?.message && errors.newpassword.message}
          </small>
          <small className="absolute bottom-0 text-red-500 text-[0.8rem]">
            {errors.confirmpassword?.message && errors.confirmpassword.message}
          </small>
        </header>
        <div className="pt-3 px-2 space-y-2">
          <div className="space-y-1 flex flex-col">
            <label htmlFor="password" className="font-semibold text-[0.7rem]">
              CURRENT PASSWORD
            </label>
            <div className="border-[1px] border-[#120C18] outline-none px-2 h-10 placeholder:text-[#120C18]/80 flex justify-between">
              <input
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
          <div className="space-y-1 flex flex-col">
            <label
              htmlFor="newpassword"
              className="font-semibold text-[0.7rem]"
            >
              NEW PASSWORD
            </label>
            <div className="border-[1px] border-[#120C18] outline-none px-2 h-10 placeholder:text-[#120C18]/80 flex justify-between">
              <input
                required
                type={showNewPassword ? "text" : "password"}
                autoComplete="off"
                id="newpassword"
                placeholder="*******"
                className="w-[85%] outline-none h-full bg-transparent"
                {...register("newpassword", {
                  pattern: {
                    value: /^\S+$/,
                    message: "Don't put spaces",
                  },
                  validate: {
                    passwordLength: (fieldValue: string) => {
                      return (
                        fieldValue.length > 8 ||
                        "New Password must be greater than to 8 characters"
                      );
                    },
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </div>
          </div>
          <div className="space-y-1 flex flex-col">
            <label
              htmlFor="confirmpassword"
              className="font-semibold text-[0.7rem]"
            >
              CONFIRM NEW PASSWORD
            </label>
            <div className="border-[1px] border-[#120C18] outline-none px-2 h-10 placeholder:text-[#120C18]/80 flex justify-between">
              <input
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
                        fieldValue === watch("newpassword") ||
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
        <div className="w-full flex justify-end pt-8 pr-2">
          <button
            disabled={changePasswordMutation.isPending}
            type="submit"
            className="text-end px-5 flex items-center gap-2 rounded-sm text-white bg-[#120C18] py-2"
          >
            <span>
              {changePasswordMutation.isPending
                ? "CHANGING PASSWORD"
                : "CHANGE PASSWORD"}
            </span>
            <span>
              {" "}
              {changePasswordMutation.isPending ? (
                <MdOutlinePublishedWithChanges />
              ) : (
                <TbArrowsExchange />
              )}
            </span>
          </button>
        </div>
      </form>
      <Image
        src={changpasswordIcon}
        alt="changpasswordIcon"
        priority
        className="lg:block hidden w-[80%]"
      />
      {openAlert && <Alert />}
    </div>
  );
}

export default ChangePassword;
