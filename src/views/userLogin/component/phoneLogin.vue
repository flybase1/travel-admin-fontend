<template>
  <el-form
    ref="loginRef"
    :model="loginForm"
    :rules="loginRules"
    class="login-form"
  >
    <el-form-item prop="userPhoneNum">
      <el-input
        v-model="loginForm.userPhoneNum"
        type="text"
        size="large"
        autocomplete="off"
        placeholder="手机号"
        clearable
      >
        <template #prefix>
          <svg-icon icon="phone"></svg-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="smsCode">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-input
            v-model="loginForm.smsCode"
            size="large"
            autocomplete="off"
            placeholder="短信动态码"
            @keyup.enter="handleLogin"
            clearable
          >
            <template #prefix>
              <svg-icon icon="smsCode"></svg-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button @click="handleSendSmsCode" type="primary"
            >发送验证码
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-row>
      <el-col :span="20" />
      <el-col :span="4">
        <el-link
          href="#"
          style="color: cornflowerblue; margin: 0 0 10px 0"
          @click="routeToRegister"
        >
          点击注册
        </el-link>
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
    <!--    <div class="el-login-footer">-->
    <!--      <span>CopyRight by FlyCode</span>-->
    <!--    </div>-->
  </el-form>
</template>
<script lang="ts" setup>
import store from "@/store";
import { onMounted, ref } from "vue";
import requestUtil from "@/utils/request";
import qs from "qs";
import { ElMessage } from "element-plus";
import router from "@/router";

const loginRef = ref(null);

const loginForm = ref({
  userPhoneNum: "",
  smsCode: "",
});

const loginRules = {
  userPhoneNum: [
    { required: true, trigger: "blur", message: "请输入你的手机号" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "blur",
    },
  ],
  smsCode: [
    { required: false, trigger: "blur", message: "请输入你的验证码" },
    {
      len: 6,
      message: "请输入6位验证码",
      trigger: "blur",
    },
  ],
};

const handleLogin = () => {
  if (loginRef.value != null) {
    loginRef.value.validate(async (valid: any) => {
      if (valid) {
        const res = await requestUtil.post(
          `/phoneLogin?` + qs.stringify(loginForm.value)
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

// 发送验证码
const handleSendSmsCode = async () => {
  if (loginRef.value != null) {
    loginRef.value.validate(async (valid: any) => {
      if (valid) {
        requestUtil
          .get("/sms/smsCode?phone=" + loginForm.value.userPhoneNum)
          .then((res: any) => {
            if (res.data.code === 0) {
              ElMessage.success("验证码已经发出，请注意查收");
            }
            ElMessage.error(res.data.message);
          });
      }
    });
  }
};

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
