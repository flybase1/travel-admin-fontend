<template>
  <el-icon>
    <home-filled />
  </el-icon>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
      <span v-if="parentName && index > 0" class="root"
        >{{ parentName }}&nbsp;&nbsp;/&nbsp;&nbsp;</span
      >
      <span class="leaf" v-if="index == breadcrumbList.length - 1">{{
        item.name
      }}</span>
      <span v-else>{{ item.name }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup lang="ts">
import { HomeFilled } from "@element-plus/icons-vue";
import store from "@/store";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute();
const breadcrumbList = ref<[]>([]);
const parentName = ref(null);
const doInitBreadCrumbList = () => {
  breadcrumbList.value = route.matched;
  parentName.value = route.meta.parentName;
};

watch(
  route,
  () => {
    doInitBreadCrumbList();
  },
  { deep: true, immediate: true }
);
</script>

<style lang="css" scoped>
.leaf {
  cursor: text;
}

.root {
  color: #666;
  font-weight: 600;
}
</style>
