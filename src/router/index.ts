import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: () => import("@/pages/home/index.vue"),
    meta: {
      type: "index",
      title: "首页",
    },
    children: [],
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      type: "login",
      title: "登录",
    },
    children: [],
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
