<template>
  <!--  <nav></nav>-->
  <router-view />
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "@/store";

// const whiteList = ["/login", "/", "/index"];
//
// const route = useRoute();
// const router = useRouter();
// watch(
//   route,
//   (to, from) => {
//     console.log("to.path:", to.path);
//     console.log(to.path);
//     if (to.path != undefined && whiteList.indexOf(to.path) === -1) {
//       console.log("to.path=" + to.path);
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
