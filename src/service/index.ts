import Request from "./request";
import { getAccessToken } from "@/utils/auth";

const timeOut = 30000;

const http = new Request({
  baseURL: import.meta.env.VITE_BASE_API_URL + "",
  timeout: timeOut,
  headers: { 'Content-Type': 'application/json' },
  interceptors: {
    requestInterceptor: (config) => {
      const token = getAccessToken();
      if (token)
        (config as any).headers['token'] = getAccessToken();
      return config;
    },
  },
});

const AIRequest = (baseURL) =>
  new Request({
    baseURL,
    timeout: 240000,
    interceptors: {
      requestInterceptor: (config) => {
        return config;
      },
    },
  });

const DroneRequest = new Request({
  baseURL: import.meta.env.VITE_BASE_DRONE_URL + "",
  timeout: timeOut,
  interceptors: {
    requestInterceptor: (config) => {
      const Appid = "fangtian";
      // const Token = "b6ef827294e64ceb85ea7402e7cb9a08";
      const Token = "950a421b5f904633a8c02c5100ae1de6";
      (config as any).headers["Token"] = Token;
      (config as any).headers["Appid"] = Appid;

      return config;
    },
  },
});

export { AIRequest, DroneRequest };

export default http;
