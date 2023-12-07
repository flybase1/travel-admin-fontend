<template>
  <!--    v-model="dialogVisible"  -->
  <el-dialog :title="dialogTitle" width="80%" @close="handleClose">
    <el-form ref="formRef" :model="form" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="创建者id" prop="createTeamAccountId">
            <el-input v-model="form.createTeamAccountId" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="项目id" prop="travelId">
            <el-input v-model="form.travelId" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="最大人数" prop="maxNum">
            <el-input v-model="form.maxNum" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="导游人数" prop="guideNum">
            <el-input v-model="form.guideNum" type="number" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="队伍标题" prop="travelTeamName">
        <el-input v-model="form.travelTeamName" />
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
  travelTeamId: {
    type: Number,
    default: -1,
    required: true,
  },
  travelId: {
    type: Number,
    default: -1,
    required: false,
  },
  createTeamAccountId: {
    type: Number,
    default: -1,
    required: false,
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
  travelTeamId: -1,
  travelId: "",
  maxNum: "",
  guideNum: "",
  nowNum: "",
  createTeamAccountId: "",
  travelTeamName: "",
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
  const res = await requestUtil.get("/travelTeam/getTravelTeamById/" + id);
  form.value = res.data.data;
};

watch(
  () => props.dialogVisible,
  async () => {
    // 这里传递过来的travelTeamId是string类型，必须要转换成int类型
    let travelTeamIdP = parseInt(props.travelTeamId);
    if (travelTeamIdP !== -1) {
      console.log(travelTeamIdP + "=================>here");
      await initFormData(travelTeamIdP);
    } else {
      form.value = {
        travelTeamId: -1,
        travelId: props.travelId,
        maxNum: "",
        guideNum: "",
        nowNum: "",
        createTeamAccountId: props.createTeamAccountId,
        travelTeamName: "",
      };
    }
  },
  { immediate: true } // 这里加入 immediate: true
);

const emits = defineEmits(["update:modelValue", "iniTravelTeamList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      if (form.value.travelTeamId === -1) {
        result = await requestUtil.post(
          "/travelTeam/addTravelTeam",
          form.value
        );
        if (result.data.code === 0) {
          ElMessage.success("添加成功！");
          formRef.value.resetFields();
          emits("iniTravelTeamList");
          handleClose();
        } else {
          ElMessage.error("添加失败");
        }
        console.log(result.data);
      } else {
        result = await requestUtil.put(
          "/travelTeam/updateTravelTeam",
          form.value
        );
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("iniTravelTeamList");
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
