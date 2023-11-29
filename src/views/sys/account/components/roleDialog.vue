<template>
  <el-dialog
    model-value="roleDialogVisible"
    title="分配角色"
    width="30%"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-checkbox-group v-model="form.checkedRoles">
        <el-checkbox
          v-for="role in form.roleList"
          :id="role.roleId"
          :key="role.roleId"
          :label="role.roleId"
          name="checkedRoles"
        >
          <!--     :id="role.roleId"         -->
          {{ role.roleId }}
          {{ role.roleName }}
        </el-checkbox>
      </el-checkbox-group>
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
  roleDialogVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
  sysRoleList: {
    type: Array,
    default: [],
    required: true,
  },
});

const form = ref({
  accountId: -1,
  roleList: [],
  checkedRoles: [],
});

const formRef = ref(null);

const initFormData = async (accountPId) => {
  const res = await requestUtil.get("sysRole/listAll");
  // console.log("----->" + res.data);
  form.value.roleList = res.data.data;
  form.value.accountId = accountPId;
};

watch(
  () => props.roleDialogVisible,
  () => {
    let accountId = props.accountId;
    if (accountId !== -1) {
      form.value.checkedRoles = [];
      props.sysRoleList.forEach((item) => {
        form.value.checkedRoles.push(item.roleId);
      });
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
      let result = await requestUtil.post(
        "account/grantRole/" + form.value.accountId,
        form.value.checkedRoles
      );
      console.log(result.data);
      if (result.data.code === 0) {
        ElMessage.success("执行成功！");
        emits("initUserList");
        handleClose();
      } else {
        ElMessage.error("执行失败");
      }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style scoped></style>
