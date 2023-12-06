<template>
  <el-dialog :title="dialogTitle" width="30%" @close="handleClose">
    <el-form ref="formRef" :model="form" label-width="130px">
      <el-form-item label="项目类型名" prop="travelType">
        <el-input v-model="form.travelType" />
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
import "@wangeditor/editor/dist/css/style.css";

const props = defineProps({
  typeId: {
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
  typeId: -1,
  travelType: "",
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
  const res = await requestUtil.get("/travelType/getTravelType/" + id);
  form.value = res.data.data;
};

watch(
  () => props.dialogVisible,
  async () => {
    let travelTypeIdP = props.typeId;
    if (travelTypeIdP !== -1) {
      await initFormData(travelTypeIdP);
    } else {
      form.value = {
        typeId: -1,
        travelType: "",
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initTravelTypeList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      //console.log(form.value.accountId);
      if (form.value.typeId === -1) {
        result = await requestUtil.post("/travelType/addType", form.value);
        if (result.data.code === 0) {
          ElMessage.success("添加成功！");
          formRef.value.resetFields();
          emits("initTravelTypeList");
          handleClose();
        } else {
          ElMessage.error("添加失败");
        }
        console.log(result.data);
      } else {
        result = await requestUtil.put("/travelType/updateType", form.value);
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("initTravelTypeList");
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

<style lang="scss" scoped>
#editor—wrapper {
  border: 1px solid #ccc;
  z-index: 100; /* 按需定义 */
}

#toolbar-container {
  border-bottom: 1px solid #ccc;
}

#editor-container {
  height: 500px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
