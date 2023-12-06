<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="输入账号id"
          v-model="queryForm.queryCreateTeamAccountId"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入队伍id"
          v-model="queryForm.queryTravelTeamId"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入项目id"
          v-model="queryForm.queryTravelId"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initTravelTeamList"
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
      <el-table-column prop="travelTeamId" label="队伍id" width="90" sortable />
      <el-table-column prop="travelId" label="项目id" width="100" />
      <el-table-column prop="travelTitle" label="项目名" width="130" />
      <el-table-column prop="maxNum" label="最大人数" width="130" />
      <el-table-column prop="guideNum" label="导游人数" width="130" />
      <el-table-column prop="nowNum" label="现在加入人数" width="130" />
      <el-table-column prop="createTime" label="创建时间" width="130" />
      <el-table-column
        prop="createTeamAccountId"
        label="创建者id"
        width="130"
      />
      <el-table-column prop="userAccount" label="账号" width="160" />
      <el-table-column prop="travelTeamName" label="队伍名" width="160" />

      <el-table-column
        prop="action"
        label="操作"
        width="490"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
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
    @initTravelTeamList="initTravelTeamList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
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
import UserInfoDialog from "@/views/sys/account/components/userInfoDialog.vue";

const tableData = ref([
  {
    travelTeamId: 1,
    travelId: "",
    maxNum: "",
    travelTitle: "",
    guideNum: "",
    nowNum: "",
    createTime: "",
    createTeamAccountId: "",
    userAccount: "",
    travelTeamName: "",
  },
]);

const queryForm = ref({
  queryTravelTeamId: "",
  queryTravelId: "",
  queryTravelTitle: "",
  queryCreateTeamAccountId: "",
  queryUserAccount: "",
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

const initTravelTeamList = async () => {
  const res = await requestUtil.post(
    "/travelTeam/pageTravelTeam",
    queryForm.value
  );
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

initTravelTeamList();

const handleSizeChange = (pageSize: number) => {
  queryForm.value.current = 1;
  queryForm.value.pageSize = pageSize;
  initTravelTeamList();
};
const handleCurrentChange = (current: number) => {
  queryForm.value.current = current;
  initTravelTeamList();
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
    initTravelTeamList();
  } else {
    ElMessage.error({ type: "error", message: "删除失败" });
  }
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
