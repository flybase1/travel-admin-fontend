<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="输入权限名"
          v-model="queryForm.queryRoleName"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入权限标识"
          v-model="queryForm.queryRoleCode"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入备注"
          v-model="queryForm.queryRemark"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initRoleList"
        >搜索
      </el-button>
    </el-row>

    <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()"
      >新增
    </el-button>

    <el-popconfirm title="您确认删除这些记录吗" @confirm="handleDelete(null)">
      <template #reference>
        <el-button type="danger" :disabled="delBtnStatus" :icon="Delete"
          >批量删除
        </el-button>
      </template>
    </el-popconfirm>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @selectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="roleId" label="权限id" width="120" sortable />
      <el-table-column prop="roleName" label="权限名" width="150" />
      <el-table-column prop="roleCode" label="权限标识" width="240" />
      <el-table-column prop="remark" label="备注" width="200" />
      <el-table-column
        prop="action"
        label="操作"
        width="490"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            type="primary"
            :icon="Tools"
            @click="handleMenuDialogValue(scope.row.roleId)"
          >
            分配权限
          </el-button>
          <el-button
            v-if="scope.row.roleCode != 'admin'"
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.roleId)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
            v-if="scope.row.roleCode != 'admin'"
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.roleId)"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="queryForm.current"
      v-model:page-size="queryForm.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <Dialog
    v-model="dialogVisible"
    :dialogVisible="dialogVisible"
    :roleId="roleId"
    :dialogTitle="dialogTitle"
    @initRoleList="initRoleList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
  <MenuDialog
    v-model="menuDialogVisible"
    :roleId="roleId"
    :menuDialogVisible="menuDialogVisible"
    @initRoleList="initRoleList"
  ></MenuDialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import {
  Delete,
  DocumentAdd,
  Edit,
  Search,
  Tools,
} from "@element-plus/icons-vue";
import Dialog from "./components/dialog.vue";
import MenuDialog from "./components/menuDialog.vue";
import { ElMessage } from "element-plus";

const tableData = ref([
  {
    roleId: 1,
    roleName: "测试",
    roleCode: "test",
    remark: "备注test",
  },
]);

const queryForm = ref({
  queryRoleName: "",
  queryRoleCode: "",
  queryRemark: "",
  current: 1,
  pageSize: 10,
});

const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const roleId = ref(-1);
// 定义选中的行
const multipleSelection = ref([]);

const sysRoleList = ref([]);
const menuDialogVisible = ref(false);

const initRoleList = async () => {
  const res = await requestUtil.post("/sysRole/pageRole", queryForm.value);
  //console.log("accountList===>", ...res.data.data.records);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

initRoleList();

const handleSizeChange = (pageSize: number) => {
  queryForm.value.current = 1;
  queryForm.value.pageSize = pageSize;
  initRoleList();
};
const handleCurrentChange = (current: number) => {
  queryForm.value.current = current;
  initRoleList();
};

const handleDialogValue = (id: any) => {
  // console.log(id);
  if (id) {
    roleId.value = id;
    dialogTitle.value = "修改权限";
  } else if (id === undefined) {
    roleId.value = -1;
    dialogTitle.value = "添加权限";
  }
  dialogVisible.value = true;
};
// 批量删除
const delBtnStatus = ref(true);

const handleSelectionChange = (selection: []) => {
  console.log(selection);
  multipleSelection.value = selection;
  delBtnStatus.value = selection.length == 0;
};

const handleDelete = async (id: number) => {
  var ids = [];
  if (id) {
    ids.push(id);
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.roleId);
    });
  }
  const res = await requestUtil.deleteR("/sysRole/delete/SysRoleList", ids);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    initRoleList();
  } else {
    ElMessage.error({ type: "error", message: res.data.message });
  }
};

// 权限弹窗

const handleMenuDialogValue = (id: number) => {
  // console.log("accountId=" + id);
  roleId.value = id;
  menuDialogVisible.value = true;
};
</script>

<style scoped lang="css">
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}

.el-pagination {
  float: right;
  padding: 20px;
  box-sizing: border-box;
}

::v-deep th.el-table__cell {
  word-break: break-word;
  background-color: #f8f8f9 !important;
  color: #515a6e;
  height: 40px;
  font-size: 13px;
}

.el-tag--small {
  margin-left: 5px;
}
</style>
