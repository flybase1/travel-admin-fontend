<template>
  <div class="header">
    <div>
      <img
        class="logo"
        src="../../assets/logo.svg"
        style="
          width: 100px;
          height: 50px;
          padding-left: 100px;
          padding-top: 20px;
        "
      />
      <span style="font-size: 35px; color: black">飞云旅行</span>
    </div>
  </div>
  <div class="login">
    <el-row :gutter="100" justify="center" class="flex-row">
      <el-col :span="4" />
      <el-col :span="8">
        <el-carousel :interval="4000" type="card" height="330px">
          <el-carousel-item v-for="item in pictureList" :key="item.id">
            <img :src="item.url" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="8">
        <el-card shadow="true" style="width: 100%; height: 120%">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="账号登录" name="accountLogin">
              <account-login />
            </el-tab-pane>
            <el-tab-pane label="手机登录" name="phoneLogin">
              <phone-login />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="4" />
    </el-row>
    <div class="el-login-footer">
      <!--      <span>CopyRight by FlyCode</span>-->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import AccountLogin from "@/views/userLogin/component/accountLogin.vue";
import PhoneLogin from "@/views/userLogin/component/phoneLogin.vue";

const activeTab = ref("accountLogin");
const pictureList = ref([
  {
    id: 1,
    url: "http://xm.visitxm.com/tpLineImagesUpload/c24a928d-cb6a-4f67-9819-4928eba02ec5.jpg",
  },
  {
    id: 2,
    url: "http://xm.visitxm.com/tpLineImagesUpload/30139b16-0fef-41c8-8f1a-f9789b241491.jpg",
  },
  {
    id: 3,
    url: "http://www.visitxm.com/tpLineImagesUpload/2f2401e3-36c7-40c9-881c-0147ffa096ce.jpg",
  },
  {
    id: 4,
    url: "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
  },
]);
</script>

<style lang="css" scoped>
.header {
  height: 100px;
  background-color: white; /* 这里可以设置你想要的背景颜色 */
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0% 0% / 100% 100%;
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: left;
  color: black;
  font-family: Arial, serif;
  font-size: 22px;
  letter-spacing: 1px;
}

.flex-row {
  width: 120%;
  display: flex;
}

.parent-container {
  text-align: center;
}

.tl_header_nav_container_T0v0W,
.tl_header_nav_fOCFQ,
.tl_header_nav_small_wrap_gCHc7,
.tl_logo_search_layout_jqiD8,
.tl_first_wrap_O-7cj,
.tl_header_nav_small_logo_qV3BH {
  display: block;
  text-indent: -999px;
  width: 194px;
  height: 32px;
}
</style>
