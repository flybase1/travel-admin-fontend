<template>
  <el-dialog
    model-value="menuDialogVisible"
    title="分配权限"
    width="30%"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        :default-expand-all="true"
        node-key="id"
        :check-strictly="true"
      ></el-tree>
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
  menuDialogVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const form = ref({
  roleId: -1,
});

const defaultProps = {
  children: "children",
  label: "menuName",
};

const formRef = ref(null);
const treeRef = ref(null);
const treeData = ref([]);
const initFormData = async (rolePId) => {
  const res = await requestUtil.get("sysMenu/treeList");
  treeData.value = res.data.data;
  //console.log("----->" + res.data.data);
  form.value.roleId = rolePId;

  const menuIds = await requestUtil.get("/roleMenu/menus?roleId=" + rolePId);
  treeRef.value.setCheckedKeys(menuIds.data.data);
};

watch(
  () => props.menuDialogVisible,
  () => {
    let roleId = props.roleId;
    if (roleId !== -1) {
      initFormData(roleId);
    }
  }
);

const emits = defineEmits(["update:modelValue", "initRoleList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      var menuIds = treeRef.value.getCheckedKeys();
      let result = await requestUtil.post(
        "sysRole/updateSysRole/" + form.value.roleId,
        menuIds
      );
      console.log(result.data);
      if (result.data.code === 0) {
        ElMessage.success("执行成功！");
        emits("initRoleList");
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
