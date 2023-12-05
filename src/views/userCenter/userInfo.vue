<template>
  <el-form ref="userRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="用户昵称：" prop="username">
      <el-input v-model="form.username" maxlength="50" />
    </el-form-item>
    <el-form-item label="手机号码：" prop="userPhoneNum">
      <el-input v-model="form.userPhoneNum" maxlength="11" />
    </el-form-item>
    <el-form-item label="用户邮箱：" prop="userEmail">
      <el-input v-model="form.userEmail" maxlength="50" />
    </el-form-item>
    <el-form-item label="用户性别：" prop="userGender">
      <el-radio-group v-model="form.userGender" class="ml-4">
        <el-radio :label="0" size="large">男</el-radio>
        <el-radio :label="1" size="large">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="用户地区：" prop="userRegion">
      <el-input v-model="form.userRegion" maxlength="50" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { defineProps, ref } from "vue";
import requestUtil from "@/utils/request";
import { ElMessage } from "element-plus";
import store from "@/store";

const props = defineProps({
  user: {
    type: Object,
    default: () => {},
    required: true,
  },
});

const form = ref({
  id: -1,
  userPhoneNum: "",
  userEmail: "",
  userGender: "",
  userRegion: "",
  username: "",
  userAge: "",
});

const userRef = ref(null);

const rules = ref({
  userEmail: [
    { required: false, message: "邮箱地址不能为空", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  username: [
    {
      required: true,
      message: "昵称不能为空",
      trigger: "blur",
    },
  ],
  userPhoneNum: [
    {
      required: true,
      message: "手机号码不能为空",
      trigger: "blur",
    },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

form.value = props.user;

const handleSubmit = () => {
  userRef.value.validate(async (valid) => {
    if (valid) {
      let result = await requestUtil.post("/sysAccount/save", form.value);
      let data = result.data;
      if (data.code === 0) {
        ElMessage.success("执行成功！");
        store.commit("SET_USERINFO", form.value);
      }
    }
  });
};
</script>

<style lang="scss" scoped></style>
