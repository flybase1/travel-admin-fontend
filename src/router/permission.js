import router from "@/router/index";
import store from "@/store";

router.beforeEach((to, from, next) => {
  // 白名单
  const whiteList = ["/login", "/", "/index"];
  // 获取token
  const token = store.getters.GET_TOKEN;
  // 路由
  const hasRoutes = store.state.hasRoutes;
  // 菜单
  const menuList = store.getters.GET_MENU_LIST;
  // 存在token，放行
  if (token) {
    if (!hasRoutes) {
      bindRoute(menuList);
      store.commit("SET_ROUTES_STATE", true);
      // next({ path: "/index" });
      next({ ...to, replace: true });
    }
    next();
  } else {
    // 路径存在白名单,放行
    if (whiteList.includes(to.path)) {
      next();
    } else {
      // 否则跳转主页
      next("/login");
    }
  }
});

// function bindRoute(menuList) {
//   menuList.forEach((menu) => {
//     if (menu.children) {
//       menu.children.forEach((m) => {
//         const route = menuToRoute(m, menu.menuName);
//         if (route) {
//           router.addRoute(route);
//         }
//       });
//     }
//   });
// }

//动态路由
const bindRoute = (menuList) => {
  const newRoutes = router.options.routes;
  menuList.forEach((menu) => {
    if (menu.children) {
      menu.children.forEach((m) => {
        const route = menuToRoute(m, menu.menuName);
        if (route) {
          newRoutes[0].children.push(route);
        }
      });
    }
  });
  // 重新添加到路由
  newRoutes.forEach((route) => {
    router.addRoute(route);
  });
};

// 菜单对象转换成路由对象
const menuToRoute = (menu, parentName) => {
  if (!menu.component) {
    return null;
  } else {
    const route = {
      name: menu.menuName,
      path: menu.menuPath,
      meta: { parentName: parentName },
    };
    route.component = () => import("../views/" + menu.component + ".vue");
    //console.log(route);
    return route;
  }
};
