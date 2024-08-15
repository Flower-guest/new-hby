import {
  API_BASE_API__URL,
  API_TARGET_API_URL,
  API_BASE_FILE__URL,
  API_TARGET_FILE_URL,
  API_BASE_DRONE_URL,
  API_TARGET_DRONE_URL,
  API_BASE_JF__URL,
  API_TARGET_JF_URL
} from "../constant";
import { ProxyOptions } from "vite";

type ProxyTargetList = Record<string, ProxyOptions>;

const init: ProxyTargetList = {
  [API_BASE_API__URL]: {
    target: API_TARGET_API_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${API_BASE_API__URL}`), ""),
  },
  [API_BASE_FILE__URL]: {
    target: API_TARGET_FILE_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${API_BASE_FILE__URL}`), ""),
  },
  [API_BASE_DRONE_URL]: {
    target: API_TARGET_DRONE_URL,
    changeOrigin: true,
    secure: false,
    rewrite: (path) =>
      path.replace(new RegExp(`^${API_BASE_DRONE_URL}`), ""),
  },
  [API_BASE_JF__URL]: {
    target: API_TARGET_JF_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${API_BASE_JF__URL}`), ""),
  }
};

export default init;
