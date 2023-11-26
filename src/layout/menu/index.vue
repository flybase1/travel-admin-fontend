<template>
  <div class="menu-container">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#2d3a4b"
      class="el-menu-vertical-demo"
      :default-active="'/index'"
      text-color="#fff"
      router
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="/index">
        <el-icon>
          <home-filled />
        </el-icon>
        <span>首页</span>
      </el-menu-item>

      <el-sub-menu
        :index="menu.menuPath"
        :key="menu.menuPath"
        v-for="menu in menuList"
      >
        <template #title>
          <el-icon>
            <svg-icon :icon="menu.icon" />
          </el-icon>
          <span>{{ menu.menuName }}</span>
        </template>

        <!--子节点-->
        <el-menu-item
          :index="item.menuPath"
          :key="item.menuPath"
          v-for="item in menu.children"
          @click="openTab(item)"
        >
          <el-icon>
            <svg-icon :icon="item.icon" />
          </el-icon>
          <span>{{ item.menuName }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { HomeFilled } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import store from "@/store";

const menuList = ref(store.getters.GET_MENU_LIST);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

// 添加标签
const openTab = (item: any) => {
  store.commit("ADD_TABS", item);
  console.log(item.menuName + ":" + item.menuPath + ":" + item.icon);
};

const activeIndex = ref("/index");
watch(
  store.state,
  () => {
    activeIndex.value = store.state.editableTabsValue;
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.menu-container {
  height: 100%;
}
</style>
