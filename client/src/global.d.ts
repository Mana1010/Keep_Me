import axios from "axios";
declare module "axios" {
  interface AxiosRequestConfig {
    isExpired?: boolean;
  }
}

export {};
