<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar shape="square" :size="50" :src="userAvatar" />
      &nbsp;&nbsp;{{ userName }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <router-link :to="{ name: '个人中心' }">用户中心</router-link>
        </el-dropdown-item>
        <el-dropdown-item @click="logout">安全退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import store from "@/store";
import { ArrowDown } from "@element-plus/icons-vue";
import requestUtil from "@/utils/request";
import { ElMessage } from "element-plus";

const currentUser = store.getters.GET_USER_INFO;
const userAvatar =
  currentUser == null
    ? "https://picsum.photos/200/300"
    : currentUser.userAvatar;
const userName = currentUser == null ? "未登录" : currentUser.username;

const logout = async () => {
  const res = await requestUtil.get("/logout");
  //console.log(res.data);
  if (res.data.code === 0) {
    // 移除路由
    store.commit("SET_ROUTES_STATE", false);
    // 移除标签
    store.commit("RESEAT_TABS");
    await store.dispatch("logout");
  }
};
</script>

<style lang="css" scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
