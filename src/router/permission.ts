import router from "@/router";
import { isRelogin } from "@/service/request";
import { getAccessToken, getGid, getDict } from "@/utils/auth";
import { useDictStore, useProjectStore } from "@/store";

// 路由不重定向白名单
const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  if (getAccessToken()) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      // 加载字典
      const dictStore = useDictStore();
      if (!getDict()) {
        await dictStore.setDictMap();
      }
      // 用户信息
      const projectStore = useProjectStore();
      if (!projectStore.getIsSetProject) {
        isRelogin.show = true;
        await projectStore.setProjectInfoAction();
        isRelogin.show = false;
        const redirectPath = from.query.redirect || to.path;
        const redirect = decodeURIComponent(redirectPath as string);
        const nextData =
          to.path === redirect ? { ...to, replace: true } : { path: redirect };
        next(nextData);
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      const url = getGid() ? `/login?redirect=${to.fullPath}&gid=${getGid()}` : `/login?redirect=${to.fullPath}`;
      next(url); // 否则全部重定向到登录页
    }
  }
});
