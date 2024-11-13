import axios from "axios";

const getToken =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("userToken")
    : null;
export const axiosInterceptor = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    Authorization: `Bearer ${getToken}`,
  },
  withCredentials: true,
});
