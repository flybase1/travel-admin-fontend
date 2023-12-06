<template>
  <!--    v-model="dialogVisible"  -->
  <el-dialog :title="dialogTitle" width="30%" @close="handleClose">
    <!--:rules="rules"    -->
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="头像" prop="userAvatar" align="center">
        <el-avatar :src="form.userAvatar" align="center" />
      </el-form-item>

      <el-form-item label="账号名" prop="userAccount">
        <el-input v-model="form.userAccount" :disabled="true" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>

      <el-form-item label="年龄" prop="userAge">
        <el-input v-model="form.userAge" :disabled="true" type="number" />
      </el-form-item>

      <el-form-item label="地区" prop="userRegion">
        <el-input v-model="form.userRegion" :disabled="true" />
      </el-form-item>

      <el-form-item label="性别" prop="userGender" :disabled="true">
        <el-radio-group v-model="form.userGender">
          <el-radio :label="'0'">男</el-radio>
          <el-radio :label="'1'">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="个人介绍" prop="userProfile">
        <el-input v-model="form.userProfile" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import requestUtil from "@/utils/request";
import { ElMessage } from "element-plus";

const props = defineProps({
  userId: {
    type: Number,
    default: -1,
    required: true,
  },
  dialogTitle: {
    type: String,
    default: "",
    required: true,
  },
  dialogVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const form = ref({
  userId: -1,
  username: "",
  userAvatar: "",
  userAge: 0,
  userRegion: "",
  userProfile: "",
  userGender: 1,
  userAccount: "1",
});
const rules = ref({
  userAccount: [
    { required: true, message: "请输入账号名" },
    { required: true, trigger: "blur" },
  ],
  /* validator: checkUsername,*/
  userEmail: [
    { required: true, message: "邮箱地址不能为空", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
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

const formRef = ref(null);

const initFormData = async (id) => {
  const res = await requestUtil.get("/user/getUserInfo?userId=" + id);
  form.value = res.data.data;
};

watch(
  () => props.dialogVisible,
  () => {
    let userIdP = props.userId;
    //console.log("id=" + userIdP);
    if (userIdP !== -1) {
      initFormData(userIdP);
    } else {
      form.value = {
        userId: -1,
        username: "",
        userAvatar: "",
        userAge: 0,
        userRegion: "",
        userProfile: "",
        userGender: 1,
        userAccount: 1,
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initUserList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      //console.log(form.value.userId);
      if (form.value.userId === -1) {
        // 复用创建账号
        result = await requestUtil.post("/account/saveAccount", form.value);
        if (result.data.code === 0) {
          ElMessage.success("添加成功！");
          formRef.value.resetFields();
          emits("initUserList");
          handleClose();
        } else {
          ElMessage.error("添加失败");
        }
        console.log(result.data);
      } else {
        result = await requestUtil.put("/user/updateUser", form.value);
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("initUserList");
          handleClose();
        } else {
          ElMessage.error("修改失败");
        }
      }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style lang="scss" scoped></style>
