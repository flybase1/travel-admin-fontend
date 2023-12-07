<template>
  <div
    class="login"
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    "
  >
    <el-row :gutter="50" justify="center" class="flex-row">
      <el-col :span="4" />
      <el-col :span="8">
        <el-carousel :interval="4000" type="card" height="250px">
          <el-carousel-item v-for="item in 6" :key="item">
            <h3
              text="2xl"
              style="color: #2d3a4b; background-color: #409eff"
              justify="center"
            >
              {{ item }}
            </h3>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="8">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="账号登录" name="accountLogin">
            <account-login />
          </el-tab-pane>
          <el-tab-pane label="手机登录" name="phoneLogin">
            <phone-login />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="4" />
    </el-row>
    <div class="el-login-footer">
      <span>CopyRight by FlyCode</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import AccountLogin from "@/views/userLogin/component/accountLogin.vue";
import PhoneLogin from "@/views/userLogin/component/phoneLogin.vue";

const activeTab = ref("accountLogin");
</script>

<style lang="css" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
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
  width: 100%;
  display: flex;
}
</style>
