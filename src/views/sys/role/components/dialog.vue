<template>
  <!--    v-model="dialogVisible"  -->
  <el-dialog :title="dialogTitle" width="30%" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="权限名" prop="roleName">
        <el-input v-model="form.roleName" />
      </el-form-item>

      <el-form-item label="权限标识" prop="roleCode">
        <el-input v-model="form.roleCode" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" />
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
  roleId: {
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
  roleId: -1,
  roleName: "",
  roleCode: "",
  remark: "",
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
  roleName: [
    { required: true, message: "请输入权限名" },
    { required: true, trigger: "blur" },
  ],
  /* validator: checkUsername,*/
  roleCode: [{ required: true, message: "请输入权限标识", trigger: "blur" }],
});

const formRef = ref(null);

const initFormData = async (id) => {
  const res = await requestUtil.get("/sysRole/getRoleInfo?roleId=" + id);
  console.log(res.data);
  form.value = res.data.data;
};

watch(
  () => props.dialogVisible,
  () => {
    let roleIdP = props.roleId;
    console.log("id=" + roleIdP);
    if (roleIdP !== -1) {
      initFormData(roleIdP);
    } else {
      form.value = {
        roleId: -1,
        roleName: "",
        roleCode: "",
        remark: "",
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initRoleList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      console.log(form.value.roleId);
      if (form.value.roleId === -1) {
        result = await requestUtil.post("/sysRole/saveRole", form.value);
        if (result.data.code === 0) {
          ElMessage.success("添加成功！");
          formRef.value.resetFields();
          emits("initRoleList");
          handleClose();
        } else {
          ElMessage.error("添加失败");
        }
        console.log(result.data);
      } else {
        result = await requestUtil.put("/sysRole/updateRole", form.value);
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("initRoleList");
          handleClose();
        } else {
          ElMessage.error(result.data.message);
        }
      }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style lang="scss" scoped></style>
