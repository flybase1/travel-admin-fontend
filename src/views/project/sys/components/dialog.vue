<template>
  <!--    v-model="dialogVisible"  -->
  <el-dialog :title="dialogTitle" width="30%" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="userAccount">
        <el-input
          v-model="form.userAccount"
          :disabled="form.accountId === -1 ? false : 'disabled'"
        />
        <el-alert
          v-if="form.accountId === -1"
          title="默认初始密码：123456"
          :closable="false"
          style="line-height: 10px"
          type="success"
        >
        </el-alert>
      </el-form-item>

      <el-form-item label="手机号" prop="userPhoneNum">
        <el-input v-model="form.userPhoneNum" />
      </el-form-item>

      <el-form-item label="邮箱" prop="userEmail">
        <el-input v-model="form.userEmail" />
      </el-form-item>

      <el-form-item label="状态" prop="accountStatus">
        <el-radio-group v-model="form.accountStatus">
          <el-radio :label="'0'">正常</el-radio>
          <el-radio :label="'1'">禁用</el-radio>
        </el-radio-group>
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
import requestUtil, { getServerUrl } from "@/utils/request";
import { ElMessage } from "element-plus";

const props = defineProps({
  accountId: {
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
  accountId: -1,
  userAccount: "",
  userPassword: "123456",
  accountStatus: 0,
  userPhoneNum: "",
  userEmail: "",
});

// const checkUsername = async (rule, value, callback) => {
//   if (form.value.accountId === -1) {
//     const res = await requestUtil.post("sys/user/checkUserName", {
//       username: form.value.userAccount,
//     });
//     if (res.data.code === 500) {
//       callback(new Error("用户名已存在！"));
//     } else {
//       callback();
//     }
//   } else {
//     callback();
//   }
// };

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
  const res = await requestUtil.get("/account/getAccountInfo?accountId=" + id);
  console.log(res.data);
  form.value = res.data.data;
};

watch(
  () => props.dialogVisible,
  () => {
    let accountId = props.accountId;
    console.log("id=" + accountId);
    if (accountId !== -1) {
      initFormData(accountId);
    } else {
      form.value = {
        accountId: -1,
        userAccount: "",
        userPassword: "123456",
        accountStatus: "0",
        userPhoneNum: "",
        userEmail: "",
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initAccountList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      console.log(form.value.accountId);
      if (form.value.accountId === -1) {
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
        result = await requestUtil.put("/account/updateAccount", form.value);
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("initUserList");
          handleClose();
        } else {
          ElMessage.error("修改失败");
        }
      }
      // if (result.data.code === 0) {
      //   ElMessage.success("添加成功！");
      //   formRef.value.resetFields();
      //   emits("initUserList");
      //   handleClose();
      // } else {
      //   ElMessage.error("添加失败");
      // }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style lang="scss" scoped></style>
