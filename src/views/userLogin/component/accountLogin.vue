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
        show-password
      >
        <template #suffix>
          <el-link href="#" style="color: cornflowerblue"> 忘记密码</el-link>
        </template>
        <template #prefix>
          <svg-icon icon="password"></svg-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item prop="code">
          <el-input
            v-model="code"
            type="text"
            size="large"
            autocomplete="off"
            placeholder="输入验证码"
            @keyup.enter="handleLogin"
            clearable
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" />
      <el-col :span="6">
        <div class="input-box">
          <img :src="captchaImageUrl" @click="getCaptcha" alt="验证码" />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4">
        <el-checkbox style="margin: 0 0 25px 0" v-model="loginForm.rememberMe">
          记住密码
        </el-checkbox>
      </el-col>
      <el-col :span="16" />
      <el-col :span="4" class="text-right">
        <router-link
          to="/register"
          style="color: cornflowerblue; margin: 0 0 10px 0"
        >
          点击注册
        </router-link>
      </el-col>
    </el-row>

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
  username: [{ required: true, trigger: "blur", message: "请输入你的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入你的密码" }],
};

const code = ref("");
// 存放验证码图片的Base64格式数据
const captchaImageUrl = ref("");
const uuid = ref("");
const getCaptcha = async () => {
  requestUtil.get("/captcha/code").then((res: any) => {
    console.log(res.data);
    if (res.data.code === 0) {
      uuid.value = res.data.data.uuid;
      captchaImageUrl.value = res.data.data.img;
    }
  });
};
getCaptcha();

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
          `login?code=${code.value}&uuid=${uuid.value}&` +
            qs.stringify(loginForm.value)
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

const routeToRegister = async () => {
  await router.push("/register");
};
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
