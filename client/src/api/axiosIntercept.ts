import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "./refreshToken";
interface DecodeJWT {
  exp: number;
  iat: number;
  id: string;
}

const getToken =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("userToken")
    : null;
export const createAxios = axios.create({
  baseURL: "https://keep-me-webapp.vercel.app/",
  headers: {
    Authorization: `Bearer ${getToken}`,
  },
  withCredentials: true,
});
createAxios.interceptors.request.use(async (config) => {
  if (!getToken) {
    return config;
  }
  try {
    const decodedToken: DecodeJWT = jwtDecode(getToken);
    const decodedAccessToken = decodedToken.exp * 1000;
    const currentTime = Date.now();
    if (currentTime > decodedAccessToken) {
      const getRefreshToken = await refreshToken();
      if (getRefreshToken) {
        localStorage.setItem("userToken", getRefreshToken);
        config.headers.Authorization = `Bearer ${getRefreshToken}`;
      } else {
        localStorage.removeItem("userToken");
      }
    }
    return config;
  } catch (err) {
    const getRefreshToken = await refreshToken();
    if (getRefreshToken) {
      localStorage.setItem("userToken", getRefreshToken);
      config.headers.Authorization = `Bearer ${getRefreshToken}`;
    } else {
      localStorage.removeItem("userToken");
    }
  }
  return config;
});
