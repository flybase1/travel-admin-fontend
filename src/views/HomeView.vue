<template>
  <div class="home">
    <BasicLayout />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BasicLayout from "@/layout/BasicLayout.vue"; // @ is an alias to /src

export default defineComponent({
  name: "HomeView",
  components: {
    BasicLayout,
  },
});
</script>

<style lang="css" scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
