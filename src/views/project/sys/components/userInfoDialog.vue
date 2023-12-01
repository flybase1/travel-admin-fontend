<template>
  <el-dialog
    model-value="userInfoDialogVisible"
    title="用户详细信息"
    width="30%"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="账号名" prop="userAccount">
        <el-input v-model="form.userAccount" :disabled="true" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>

      <el-form-item label="头像" prop="userAvatar">
        <el-input v-model="form.userAvatar" />
      </el-form-item>

      <el-form-item label="年龄" prop="userAge">
        <el-input v-model="form.userAge" :disabled="true" />
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
  accountId: {
    type: Number,
    default: -1,
    required: true,
  },
  userInfoDialogVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const form = ref({
  accountId: -1,
});

const formRef = ref(null);

const initFormData = async (accountPId) => {
  const res = await requestUtil.get("/user/getUserInfo?userId=" + accountPId);
  // console.log("----->" + res.data);
  form.value.accountId = accountPId;
  form.value = res.data.data;
};

watch(
  () => props.userInfoDialogVisible,
  () => {
    let accountId = props.accountId;
    if (accountId !== -1) {
      initFormData(accountId);
    }
  }
);

const emits = defineEmits(["update:modelValue", "initAccountList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const result = await requestUtil.put("/user/updateUser", form.value);
      if (result.data.code === 0) {
        ElMessage.success("修改成功！");
        formRef.value.resetFields();
        emits("initUserList");
        handleClose();
      } else {
        ElMessage.error("修改失败");
      }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style scoped></style>
