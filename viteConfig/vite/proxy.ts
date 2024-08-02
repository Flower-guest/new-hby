/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-12-12 10:32:56
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-30 17:19:56
 * @FilePath: \hby\viteConfig\vite\proxy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  API_BASE_API__URL,
  API_TARGET_API_URL,
  API_BASE_FILE__URL,
  API_TARGET_FILE_URL,
  API_BASE_DRONE_URL,
  API_TARGET_DRONE_URL
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
};

export default init;
