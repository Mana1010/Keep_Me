"use client";
import { useEffect } from "react";
import { refreshToken } from "./refreshToken";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { utilStore } from "@/store/util.store";
import { axiosInterceptor } from "./axiosCreate";
interface DecodeJWT {
  exp: number;
  iat: number;
  id: string;
}
function useAxiosIntercept() {
  const { setOpenAlert, setCurrentUser } = utilStore();
  const getToken =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("userToken")
      : null;
  useEffect(() => {
    const requestIntercept = axiosInterceptor.interceptors.request.use(
      async (config) => {
        if (!getToken) {
          return config;
        }
        try {
          const decodedToken: DecodeJWT = jwtDecode(getToken);
          const decodedAccessToken = decodedToken.exp * 1000;
          const currentTime = Date.now();
          if (currentTime > decodedAccessToken) {
            const getNewAccessToken = await refreshToken();
            if (getNewAccessToken) {
              localStorage.setItem("userToken", getNewAccessToken);
              config.headers.Authorization = `Bearer ${getNewAccessToken}`;
            } else {
              localStorage.removeItem("userToken");
            }
            setCurrentUser();
            return config;
          }
          setCurrentUser();
          return config;
        } catch (err) {
          const getNewAccessToken = await refreshToken();
          if (getNewAccessToken) {
            localStorage.setItem("userToken", getNewAccessToken);
            config.headers.Authorization = `Bearer ${getNewAccessToken}`;
          } else {
            localStorage.removeItem("userToken");
          }
        }
        return config;
      }
    );
    const responseIntercept = axiosInterceptor.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response.status;
        if (status === 403) {
          setOpenAlert(true);
          return;
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInterceptor.interceptors.request.eject(requestIntercept);
      axiosInterceptor.interceptors.response.eject(responseIntercept);
    };
  }, []);
  return axiosInterceptor;
}

export default useAxiosIntercept;
