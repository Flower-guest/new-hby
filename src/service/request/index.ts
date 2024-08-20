import axios from "axios";
import type { AxiosInstance } from "axios";
import { XJRequestInterceptors, RequestConfig } from "./type";
import { ElLoading, ElMessage } from "element-plus";
import { LoadingInstance } from "element-plus/lib/components/loading/src/loading";
import { errorCode, resultCode, ignoreMsgs, DEFAULT_LOADING, DEFAULT_FILTER } from "./config";
import { removeToken, removeAPPId, removeProjectData, removeDict } from "@/utils/auth";

// 是否显示重新登录
export const isRelogin = { show: false };

class Request {
  instance: AxiosInstance;
  interceptors?: XJRequestInterceptors;
  showLoading: boolean;
  filterData: boolean;
  loading?: LoadingInstance; //是否有loading实例

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.showLoading = config?.showLoading ?? DEFAULT_LOADING;
    this.filterData = config?.filterData ?? DEFAULT_FILTER;
    this.interceptors = config.interceptors;

    // 实例独有的请求响应拦截
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    // 全局请求响应拦截
    this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: "正在加载中....",
            background: "rgba(0, 0, 0, 0.5)",
          });
        }
        return config;
      },
      (err) => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      async (res) => {
        this.loading?.close();
        const { data } = res.data;
        // 未设置状态码则默认成功状态
        const code = res.data.code || resultCode;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || res.data.message || errorCode["default"];
        if (ignoreMsgs.indexOf(msg) !== -1) {
          // 如果是忽略的错误码，直接返回 msg 异常
          return Promise.reject(msg);
        } else if (code === '2001') { //未登录或者token失效
          this.handleAuthorized();
        } else if (code === '500' || code === '999') {
          ElMessage.error(msg);
          return Promise.reject(new Error(msg));
        } else if (code !== resultCode && code !== 200) {
          ElMessage.error(msg);
          return Promise.reject("error");
        } else if (code === resultCode) {
          if (this.filterData) {
            return data;
          } else {
            return data?.data ? data.data : data;
          }
        }
      },
      (err) => {
        this.loading?.close();
        ElMessage.error(err?.msg ?? err?.response?.data ?? "网络超时");
        return err;
      }
    );
  }

  request<T>(config: RequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // get参数编码
      if (config.method === "GET" && config.data) {
        const url = config?.url ?? '';
        config.url = url + "?" + new URLSearchParams(config.data).toString();
        // 删除data属性，防止转换为查询字符串两次
        delete config.data;
      }

      // 请求独有的请求拦截
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }
      // 独有的请求加载
      this.showLoading = config?.showLoading ?? DEFAULT_LOADING;
      this.filterData = config?.filterData ?? DEFAULT_FILTER;
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 独有的响应拦截
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get<T>(config: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "GET" });
  }

  post<T>(config: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "POST" });
  }

  put<T>(config: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "PUT" });
  }

  delete<T>(config: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "DELETE" });
  }

  handleAuthorized() {
    if (!isRelogin.show) {
      isRelogin.show = true;
      removeAPPId();
      removeProjectData();
      removeDict();
      removeToken();
      isRelogin.show = false;
      window.location.reload();
    }
    return Promise.reject("登录超时,请重新登录!");
  }
}

export default Request;
