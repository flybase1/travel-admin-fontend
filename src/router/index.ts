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
        component: () => import("../views/user/index/MainIndex.vue"),
      },
      {
        path: "/userCenter",
        name: "个人中心",
        component: () => import("../views/userCenter/index.vue"),
      },
      {
        path: "/test",
        name: "test",
        component: () => import("../views/sys/account/index.vue"),
      },
      {
        path: "/travelInfo/:id",
        name: "travelInfo",
        component: () => import("../views/user/travelInfo/TravelInfoIndex.vue"),
      },
    ],
  },
  // {
  //   path: "/login",
  //   name: "login",
  //   component: () => import("../views/AdminLogin.vue"),
  // },

  {
    path: "/login",
    name: "login",
    component: () => import("../views/userLogin/loginIndex.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/userRegister/userRegister.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
