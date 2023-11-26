<template>
  <!--  <nav></nav>-->
  <router-view />
</template>

<script lang="ts" setup>
// import { watch } from "vue";
// import { useRoute } from "vue-router";
// import router from "@/router";
// import store from "@/store";
//
// const whiteList = ["/login", "/", "/index"];
//
// const route = useRoute();
// watch(
//   route,
//   (to, from) => {
//     if (whiteList.indexOf(to.path) === -1) {
//       const obj = { name: to.name, path: to.path };
//       store.commit("ADD_TABS", obj);
//     }
//   },
//   { deep: true, immediate: true }
// );
</script>
<style>
html,
body,
#app {
  height: 100%;
}

.app-container {
  padding: 20px;
}
</style>
