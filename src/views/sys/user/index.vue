<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="输入用户名"
          v-model="queryForm.queryUserName"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入地区"
          v-model="queryForm.queryUserRegion"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入状态"
          v-model="queryForm.queryUserStatus"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initUserList"
        >搜索
      </el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @selectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userId" label="用户id" width="90" sortable />
      <el-table-column prop="userAccount" label="账号名" width="100" />
      <el-table-column prop="username" label="用户名" width="100" />
      <el-table-column prop="userAvatar" label="头像" width="130">
        <template v-slot="scope"
          ><img :src="scope.row.userAvatar" width="50" height="50"
        /></template>
      </el-table-column>
      <el-table-column prop="userAge" label="年龄" width="60" />
      <el-table-column prop="userGender" label="性别" width="60">
        <template v-slot="{ row }">
          {{
            row.userGender === 0 ? "男" : row.userGender === 1 ? "女" : "未知"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="userRegion" label="地区" width="160" />
      <el-table-column prop="userProfile" label="个人简介" width="160" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column
        prop="action"
        label="操作"
        width="190"
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
    :userId="userId"
    :dialogTitle="dialogTitle"
    @initUserList="initUserList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import { Delete, DocumentAdd, Edit, Search } from "@element-plus/icons-vue";
import Dialog from "./components/dialog.vue";
import { ElMessage } from "element-plus";

const tableData = ref([
  {
    userId: 1,
    username: "test",
    userAvatar: "https://picsum.photos/200/300",
    userAge: "ddd",
    userRegion: "北京",
    userProfile: "个人介绍",
    userGender: 0,
    userStatus: 0,
    userAccount: "test",
    createTime: "1111",
  },
]);

const queryForm = ref({
  queryUserName: "",
  queryUserGender: "",
  queryUserStatus: "",
  queryUserRegion: "",
  current: 1,
  pageSize: 10,
});

const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const userId = ref(-1);
// 定义选中的行
const multipleSelection = ref([]);

const sysRoleList = ref([]);
const roleDialogVisible = ref(false);

const initUserList = async () => {
  const res = await requestUtil.post("/user/pageUser", queryForm.value);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
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

const handleDialogValue = (id: any) => {
  if (id) {
    userId.value = id;
    dialogTitle.value = "用户修改";
  } else if (id === undefined) {
    userId.value = -1;
    dialogTitle.value = "用户添加";
  }
  dialogVisible.value = true;
};
// 批量删除
const delBtnStatus = ref(true);

const handleSelectionChange = (selection: []) => {
  multipleSelection.value = selection;
  delBtnStatus.value = selection.length == 0;
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
