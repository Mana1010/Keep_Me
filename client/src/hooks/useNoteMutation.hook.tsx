import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/utils/baseUrl";
import { NoteData } from "@/types/shared.type";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { toast } from "sonner";
import useMobileView from "./useMobileView";
import { AxiosError } from "axios";
function useNoteMutation() {
  const matches = useMobileView();
  const axiosIntercept = useAxiosIntercept();
  const queryClient = useQueryClient();

  const mutateFavoriteNote = useMutation({
    mutationFn: async (data: NoteData) => {
      const response = await axiosIntercept.patch(
        `${BASE_URL}/user/notes/favorite/${data._id}`,
        { isFavorite: !data.isFavorite },
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
      toast.success(data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });

  const mutatePinNote = useMutation({
    mutationFn: async (data: NoteData) => {
      const response = await axiosIntercept.patch(
        `${BASE_URL}/user/notes/pin/${data._id}`,
        { isPinned: !data.isPinned },
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
      toast.success(data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (data: NoteData) => {
      const response = await axiosIntercept.delete(
        `${BASE_URL}/user/notes/${data._id}`,
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
      toast.success(data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message, {
        position: matches ? "bottom-right" : "top-center",
      });
    },
  });
  return { mutateFavoriteNote, mutatePinNote, deleteNote };
}

export default useNoteMutation;
