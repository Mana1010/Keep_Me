import { create } from "zustand";
import useAxiosIntercept from "@/api/useAxiosIntercept";
import { createAxios } from "@/api/axiosIntercept";
import { BASE_URL } from "@/utils/baseUrl";
export interface State {
  openNavBar: boolean;
  currentUser: {
    id: string;
    email: string;
    username: string;
  } | null;
  openAlert: boolean;
  setOpenAlert: (bool: boolean) => void;
  setCurrentUser: () => Promise<void>;
  setOpenNavbar: () => void;
  logOut: () => Promise<void>;
}

const store = (set: any) => ({
  openNavBar: false,
  currentUser: null,
  openAlert: false,
  setOpenNavbar: () => {
    set((state: State) => ({
      openNavBar: !state.openNavBar,
    }));
  },
  setCurrentUser: async () => {
    try {
      const url = await createAxios.get(`${BASE_URL}/auth/userDetails`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        withCredentials: true,
      });
      if (url.status === 200) {
        set({ currentUser: url.data.message });
      }
    } catch (err) {
      set({ currentUser: null });
    }
  },
  setOpenAlert: async (bool: boolean) => {
    set({ openAlert: bool });
  },
  logOut: async () => {
    await createAxios.post(`${BASE_URL}/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
      withCredentials: true,
    });
    set({
      currentUser: null,
    });
    localStorage.removeItem("userToken");
  },
});

export const utilStore = create(store);
