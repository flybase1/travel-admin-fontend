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
    <el-card
      style="
        width: 400px;
        height: 400px;
        padding-left: 40px;
        padding-right: 70px;
        padding-top: 40px;
      "
    >
      <el-form
        ref="registerRef"
        label-position="right"
        label-width="80px"
        :rules="registerRules"
        :model="registerForm"
        class="login-form"
      >
        <el-form-item prop="userAccount" label="账号">
          <el-input
            v-model="registerForm.userAccount"
            type="text"
            size="large"
            autocomplete="off"
            placeholder="账号"
            clearable
          >
            <template #prefix>
              <svg-icon icon="user"></svg-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="userPhoneNum" label="手机号">
          <el-input
            v-model="registerForm.userPhoneNum"
            type="text"
            size="large"
            placeholder="手机号码"
          >
            <template #prefix>
              <svg-icon icon="phone"></svg-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="userPassword" label="密码">
          <el-input
            v-model="registerForm.userPassword"
            type="password"
            size="large"
            autocomplete="off"
            placeholder="密码"
            show-password
          >
            <template #prefix>
              <svg-icon icon="password"></svg-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPassword" label="校验密码">
          <el-input
            v-model="registerForm.checkPassword"
            type="password"
            size="large"
            autocomplete="off"
            placeholder="校验密码"
            show-password
          >
            <template #prefix>
              <svg-icon icon="password"></svg-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item style="width: 100%">
          <el-button
            size="large"
            type="primary"
            style="width: 100%"
            @click.prevent="handleRegister"
          >
            <span>注册</span>
          </el-button>
        </el-form-item>
        <!--版权信息-->
      </el-form>
    </el-card>

    <div class="el-login-footer">
      <!--      <span>CopyRight by FlyCode</span>-->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import store from "@/store";
import router from "@/router";
import requestUtil from "@/utils/request";
import qs from "qs";
import axios from "axios";

const registerRef = ref(null);

const registerForm = ref({
  userAccount: "",
  userPassword: "",
  userPhoneNum: "",
  checkPassword: "",
});

const registerRules = {
  userAccount: [
    { required: true, trigger: "blur", message: "请输入你的账号" },
    { min: 4, max: 8, message: "账号长度为4-8位" },
  ],
  userPassword: [
    { required: true, trigger: "blur", message: "请输入你的密码" },
    { min: 6, max: 12, message: "密码长度6-12位" },
  ],
  userPhoneNum: [
    { required: true, trigger: "blur", message: "请输入你的手机号" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "blur",
    },
  ],
  checkPassword: [
    { required: true, trigger: "blur", message: "请输入校验密码" },
    { min: 6, max: 12, message: "密码长度6-12位" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== registerForm.value.userPassword) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const handleRegister = () => {
  if (registerRef.value != null) {
    registerRef.value.validate(async (valid: any) => {
      if (valid) {
        const res = await requestUtil.postJson(
          `/account/userRegister`,
          JSON.stringify(registerForm.value)
        );
        if (res.data.code === 0) {
          ElMessage.success("注册成功，前往登录");
          await router.push("/login");
        } else {
          ElMessage.error(res.data);
        }
      } else {
        console.log("error");
      }
    });
  }
};
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
