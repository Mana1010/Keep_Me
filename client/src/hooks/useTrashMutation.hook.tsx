"use client";
import React from "react";
import { BASE_URL } from "@/utils/baseUrl";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useMobileView from "./useMobileView";
import { NoteTrashData } from "@/types/shared.type";
function useTrashMutation() {
  const axiosIntercept = useAxiosIntercept();
  const queryClient = useQueryClient();
  const matches = useMobileView();
  const deleteAllTrash = useMutation({
    mutationFn: async () => {
      const response = await axiosIntercept.delete(`${BASE_URL}/user/trashes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        withCredentials: true,
      });
      return response.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      toast.success(data);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message);
    },
  });
  const deleteTrash = useMutation({
    mutationFn: async (data: NoteTrashData) => {
      const response = await axiosIntercept.delete(
        `${BASE_URL}/user/trashes/${data._id}`,
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
      queryClient.invalidateQueries();
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
  const restoreNote = useMutation({
    mutationFn: async (data: NoteTrashData) => {
      const response = await axiosIntercept.delete(
        `${BASE_URL}/user/trashes/restore/${data._id}`,
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
      queryClient.invalidateQueries();
      toast.success(data);
    },
    onError: (err: any) => {
      toast.error(err.response.data.message);
    },
  });
  return { deleteAllTrash, deleteTrash, restoreNote };
}

export default useTrashMutation;
