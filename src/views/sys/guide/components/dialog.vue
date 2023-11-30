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

      <el-form-item label="导游材料" prop="guideCertificate">
        <el-input v-model="form.guideCertificate" />
      </el-form-item>

      <el-form-item label="审核状态" prop="approvalStatus">
        <el-input v-model="form.approvalStatus" />
      </el-form-item>

      <el-form-item label="审核失败原因" prop="approvalResult">
        <el-input v-model="form.approvalResult" />
      </el-form-item>

      <el-form-item label="评分" prop="score">
        <el-input v-model="form.score" />
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
  guideId: {
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
  guideId: -1,
  username: "",
  userAvatar: "",
  guideCertificate: "",
  approvalStatus: 0,
  score: 5,
  userAccount: "1",
  approvalResult: "",
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
  //console.log("id===>" + id);
  const res = await requestUtil.get("/guide/getGuideInfo?guideId=" + id);
  //console.log(res.data);
  form.value = res.data.data;
};

watch(
  () => props.dialogVisible,
  () => {
    let guideIdP = props.guideId;
    //console.log("id=" + guideIdP);
    if (guideIdP !== -1) {
      initFormData(guideIdP);
    } else {
      form.value = {
        guideId: -1,
        username: "",
        userAvatar: "",
        guideCertificate: "",
        approvalStatus: 0,
        score: 5,
        userAccount: "sss",
        approvalResult: "",
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initGuideList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      console.log(form.value.guideId);
      if (form.value.guideId !== -1) {
        // 复用创建账号
        result = await requestUtil.put("/guide/updateGuide", form.value);
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("initGuideList");
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
