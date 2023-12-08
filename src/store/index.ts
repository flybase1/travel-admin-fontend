import { createStore } from "vuex";
import router from "@/router";

export default createStore({
  state: {
    hasRoutes: false,
    editableTabsValue: "/index",
    editableTabs: [{ title: "首页", name: "/index" }],
  },
  getters: {
    GET_TOKEN: (state) => {
      return sessionStorage.getItem("token");
    },
    GET_MENU_LIST: (state) => {
      return JSON.parse(sessionStorage.getItem("menuList") as string);
    },
    GET_USER_INFO: (state) => {
      return JSON.parse(sessionStorage.getItem("userInfo") as string);
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      //localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);
    },
    SET_MENU_LIST: (state, menuList) => {
      sessionStorage.setItem("menuList", JSON.stringify(menuList));
    },
    SET_USER_INFO: (state, userInfo) => {
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    SET_ROUTES_STATE: (state, hasRoutes) => {
      state.hasRoutes = hasRoutes;
    },
    SET_IMAGE_STATE: (state, image) => {
      sessionStorage.setItem("image", JSON.stringify(image));
    },
    ADD_TABS: (state, tap) => {
      if (state.editableTabs.findIndex((e) => e.name === tap.menuPath) === -1) {
        state.editableTabs.push({
          title: tap.menuName,
          name: tap.menuPath,
        });
      }
      // 联动做菜单和标签
      state.editableTabsValue = tap.menuPath;
    },
    // 重置标签
    RESEAT_TABS: (state) => {
      state.editableTabsValue = "/index";
      state.editableTabs = [
        {
          title: "首页",
          name: "/index",
        },
      ];
    },
  },
  actions: {
    // 安全退出
    //1. 清空session
    logout() {
      window.sessionStorage.clear();
      router.replace("/login");
    },
    // 2.登入login路由
  },
  modules: {},
});
