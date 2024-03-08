import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useUserDetails = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return axios.get("http://localhost:5000/auth/userDetails", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        withCredentials: true,
      });
    },
  });
};
