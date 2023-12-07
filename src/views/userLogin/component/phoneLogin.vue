<template>
  <el-form
    ref="loginRef"
    :model="loginForm"
    :rules="loginRules"
    class="login-form"
  >
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
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
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        size="large"
        autocomplete="off"
        placeholder="密码"
        @keyup.enter="handleLogin"
        clearable
        show-password
      >
        <template #prefix>
          <svg-icon icon="password"></svg-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-checkbox style="margin: 0 0 25px 0" v-model="loginForm.rememberMe"
      >记住密码
    </el-checkbox>
    <el-form-item style="width: 100%">
      <el-button
        size="large"
        type="primary"
        style="width: 100%"
        @click.prevent="handleLogin"
      >
        <span>登录</span>
      </el-button>
    </el-form-item>
    <!--版权信息-->
    <div class="el-login-footer">
      <span>CopyRight by FlyCode</span>
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import store from "@/store";
import { ref } from "vue";
import requestUtil from "@/utils/request";
import qs from "qs";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import router from "@/router";

const loginRef = ref(null);

const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入你的密码" }],
  password: [{ required: true, trigger: "blur", message: "请输入你的密码" }],
};

const handleLogin = () => {
  if (loginRef.value != null) {
    loginRef.value.validate(async (valid: any) => {
      if (valid) {
        // 记住密码,30天
        if (loginForm.value.rememberMe) {
          Cookies.set("username", loginForm.value.username, { expires: 30 });
          Cookies.set("password", encrypt(loginForm.value.password), {
            expires: 30,
          });
          Cookies.set("rememberMe", loginForm.value.rememberMe, {
            expires: 30,
          });
        } else {
          Cookies.remove("username");
          Cookies.remove("password");
          Cookies.remove("rememberMe");
        }
        let res = await requestUtil.post(
          "login?" + qs.stringify(loginForm.value)
        );
        if (res.data.code === 0) {
          ElMessage.success("登录成功");
          store.commit("SET_TOKEN", res.data.data.authorization);
          store.commit("SET_MENU_LIST", res.data.data.menuList);
          store.commit("SET_USER_INFO", res.data.data.user);

          await router.push("/index");
          window.location.reload();
        } else {
          ElMessage.error(res.data);
        }
      } else {
        console.log("errr");
      }
    });
  }
};

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
}

getCookie();
</script>

<style lang="css" scoped>
a {
  color: white;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      display: inline-block;
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0;
  }
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

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
