import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "首页",
    component: HomeView,
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "首页",
        component: () => import("../views/index/index.vue"),
      },
      {
        path: "/userCenter",
        name: "个人中心",
        component: () => import("../views/userCenter/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/AdminLogin.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
