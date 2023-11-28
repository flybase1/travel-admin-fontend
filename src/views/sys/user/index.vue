<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="输入账号名"
          v-model="queryForm.queryAccount"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入手机号"
          v-model="queryForm.queryPhoneNum"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入邮箱"
          v-model="queryForm.queryEmail"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initUserList"
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
      <el-table-column prop="accountId" label="账号id" width="90" sortable />
      <el-table-column prop="userAccount" label="账号名" width="100" />
      <el-table-column
        prop="roleList"
        label="拥有角色"
        width="180"
        align="center"
      >
        <template v-slot="scope">
          <el-tag
            size="small"
            type="warning"
            v-for="item in scope.row.roleList"
          >
            {{ item.roleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userPhoneNum" label="手机号" width="130" />
      <el-table-column prop="userEmail" label="邮箱" width="160" />
      <el-table-column
        prop="accountStatus"
        label="帐号状态?"
        width="180"
        align="center"
      >
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.accountStatus"
            @change="statusChangeHandle(scope.row)"
            active-text="正常"
            inactive-text="禁用"
            :active-value="0"
            :inactive-value="1"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column
        prop="action"
        label="操作"
        width="490"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button type="primary" :icon="User">查看信息</el-button>
          <el-button
            type="primary"
            :icon="Tools"
            @click="
              handleRoleDialogValue(scope.row.accountId, scope.row.roleList)
            "
          >
            分配角色
          </el-button>
          <el-button
            v-if="scope.row.userAccount != 'admin'"
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.accountId)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
            v-if="scope.row.userAccount != 'admin'"
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.accountId)"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" />
            </template>
          </el-popconfirm>
          <el-popconfirm
            v-if="scope.row.userAccount != 'admin'"
            title="您确定要对这个用户重置密码吗？"
            @confirm="handleResetPassword(scope.row.accountId)"
          >
            <template #reference>
              <el-button type="warning" :icon="RefreshRight"
                >重置密码
              </el-button>
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
    :accountId="accountId"
    :dialogTitle="dialogTitle"
    @initUserList="initUserList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
  <RoleDialog
    v-model="roleDialogVisible"
    :accountId="accountId"
    :sysRoleList="sysRoleList"
    :roleDialogVisible="roleDialogVisible"
    @initUserList="initUserList"
  ></RoleDialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import {
  Delete,
  DocumentAdd,
  Edit,
  RefreshRight,
  Search,
  Tools,
  User,
} from "@element-plus/icons-vue";
import Dialog from "./components/dialog.vue";
import RoleDialog from "./components/roleDialog.vue";
import { ElMessage } from "element-plus";

const tableData = ref([
  {
    accountId: 1,
    userAccount: "测试",
    userPhoneNum: "测试",
    userEmail: "ddd",
    permissionId: 1,
    accountStatus: 0,
    roleList: ["管理"],
  },
]);

const queryForm = ref({
  queryAccount: "",
  queryPhoneNum: "",
  queryEmail: "",
  queryRoleId: "",
  queryStatus: "",
  current: 1,
  pageSize: 10,
});

const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const accountId = ref(-1);
// 定义选中的行
const multipleSelection = ref([]);

const sysRoleList = ref([]);
const roleDialogVisible = ref(false);

const initUserList = async () => {
  const res = await requestUtil.post("/account/page", queryForm.value);
  //console.log("accountList===>", ...res.data.data.records);
  tableData.value = res.data.data.records;
  sysRoleList.value = res.data.data.records.map((user) => user.roleList).flat();
  total.value = res.data.data.total;
  // console.log(
  //   "-----sysRoleList>",
  //   res.data.data.records.map((user) => user.roleList).flat()
  // );
};

initUserList();

const handleSizeChange = (pageSize: number) => {
  queryForm.value.current = 1;
  queryForm.value.pageSize = pageSize;
  initUserList();
};
const handleCurrentChange = (current: number) => {
  queryForm.value.current = current;
  initUserList();
};

/**
 * 更新状态
 * @param row
 */
const statusChangeHandle = async (row: any) => {
  // console.log("账号状态=>" + row.accountStatus + "账号id" + row.accountId);
  let res = await requestUtil.get(
    "account/updateStatus/" + row.accountId + "/status/" + row.accountStatus
  );
  if (res.data.code == 0) {
    ElMessage({
      type: "success",
      message: "执行成功!",
    });
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
    initUserList();
  }
};

const handleDialogValue = (id: any) => {
  // console.log(id);
  if (id) {
    accountId.value = id;
    dialogTitle.value = "用户修改";
  } else if (id === undefined) {
    accountId.value = -1;
    dialogTitle.value = "用户添加";
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
      ids.push(row.accountId);
    });
  }
  const res = await requestUtil.deleteR("/account/delete/AccountList", ids);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    initUserList();
  } else {
    ElMessage.error({ type: "error", message: "删除失败" });
  }
};

/**
 * 重置密码
 * @param id
 */
const handleResetPassword = async (id: number) => {
  const res = await requestUtil.get("account/resetPwd?accountId=" + id);
  if (res.data.code == 0) {
    ElMessage({
      type: "success",
      message: "执行成功!",
    });
    initUserList();
  } else {
    ElMessage({
      type: "error",
      message: res.data.msg,
    });
  }
};

// 权限弹窗

const handleRoleDialogValue = (id: number, roleList) => {
  // console.log("accountId=" + id);
  accountId.value = id;
  sysRoleList.value = roleList;
  roleDialogVisible.value = true;
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
