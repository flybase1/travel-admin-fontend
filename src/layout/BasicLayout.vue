<template>
  <div class="app-wrapper">
    <el-container>
      <el-aside width="200px" class="sidebar-container">
        <Menu />
      </el-aside>
      <el-container>
        <el-header class="el-header">
          <Header />
        </el-header>
        <el-main class="el-container">
          <Tabs />
          <router-view />
        </el-main>
        <el-footer>
          <Footer />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import Header from "@/layout/header/index.vue";
import Menu from "@/layout/menu/index.vue";
import Tabs from "@/layout/tabs/index.vue";
import Footer from "@/layout/footer/index.vue";
</script>

<style scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.sidebar-container {
  background-color: #2d3a4b;
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  padding-left: 0;
  padding-right: 0;
}

:deep(ul.el-menu) {
  border-right-width: 0;
}
</style>
