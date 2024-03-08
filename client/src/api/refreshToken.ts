import axios from "axios";
import { BASE_URL } from "@/utils/baseUrl";
export const refreshToken = async () => {
  try {
    const getToken = await axios.get(`${BASE_URL}/auth/refresh`, {
      withCredentials: true,
    });
    if (getToken.status === 200) {
      return getToken.data.token;
    }
  } catch (err) {
    console.log(err);
  }
};
