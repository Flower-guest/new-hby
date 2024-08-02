import localCache from "./cache";

const ONLY_KEY = "hby";

const AccessTokenKey = ONLY_KEY + "ACCESS_TOKEN";

// 获取token
export const getAccessToken = () => {
  // 此处与TokenKey相同，此写法解决初始化时Cookies中不存在TokenKey报错
  return localCache.getCache(AccessTokenKey)
    ? localCache.getCache(AccessTokenKey)
    : "";
};

// 设置token
export const setToken = (token) => {
  localCache.setCache(AccessTokenKey, token);
};

// 删除token
export const removeToken = () => {
  localCache.deleteCache(AccessTokenKey);
};

// ========== 账号相关 ==========
const LoginFormKey = ONLY_KEY + "LOGINFORM";

export type LoginFormType = {
  appid: string;
  username: string;
  password: string;
  remember: boolean;
};

export const getLoginForm = () => {
  const loginForm: LoginFormType =
    localCache.getSessionEncryption(LoginFormKey);
  return loginForm;
};

export const setLoginForm = (loginForm: LoginFormType) => {
  localCache.setSessionEncryption(LoginFormKey, loginForm);
};

export const removeLoginForm = () => {
  localCache.deleteCache(LoginFormKey);
};

// ========== 租户相关 ==========
const APPIdKey = ONLY_KEY + "APP_ID";
export const getAPPId = () => {
  return localCache.getCache(APPIdKey);
};

export const setAPPId = (appid: number) => {
  localCache.setCache(APPIdKey, appid);
};

export const removeAPPId = () => {
  localCache.deleteCache(APPIdKey);
};

// ========== 项目信息数据 ==========
const ProjectKey = ONLY_KEY + "PROJECT";
const MenuKey = ONLY_KEY + "MENU";
const MenuDataKey = ONLY_KEY + "MENU_DATA";

export const getProject = () => {
  return localCache.getCache(ProjectKey);
};

export const getMenu = () => {
  return localCache.getCache(MenuKey);
};

export const getMenuData = () => {
  return localCache.getCache(MenuDataKey);
};

export const setProjectData = (projectInfo: any, menu: any, menuData: any) => {
  localCache.setCache(ProjectKey, projectInfo);
  localCache.setCache(MenuKey, menu);
  localCache.setCache(MenuDataKey, menuData);
};

// ========== 字典数据 ==========
const DictKey = ONLY_KEY + "DICT";

export const getDict = () => {
  return localCache.getCache(DictKey);
};

export const setDict = (dict: any) => {
  localCache.setCache(DictKey, dict);
};

// ========== gid ==========
const GidKey = ONLY_KEY + "GID";

export const getGid = () => {
  const gid = localCache.getCache(GidKey)
  return gid ? Number(gid) : null;
};

export const setGid = (gid: any) => {
  localCache.setCache(GidKey, gid);
};
