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
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="accountId" label="账号id" width="180" />
      <el-table-column prop="userAccount" label="账号名" width="180" />
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
      <el-table-column prop="userPhoneNum" label="手机号" width="180" />
      <el-table-column prop="userEmail" label="邮箱" width="180" />
      <el-table-column prop="permissionId" label="权限级别" width="180" />
      <el-table-column prop="roleList" label="权限列表" width="180" />
      <el-table-column
        prop="accountStatus"
        label="帐号状态"
        width="180"
        align="center"
      >
        <template v-slot="{ row }">
          <el-switch
            v-model="row.status"
            active-text="正常"
            inactive-text="禁用"
            active-value="0"
            @change="statusChangeHandle(row)"
            inactive-value="1"
          ></el-switch>
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
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import { Search } from "@element-plus/icons-vue";

const tableData = ref([
  {
    accountId: 1,
    userAccount: "测试",
    userPhoneNum: "测试",
    userEmail: "ddd",
    permissionId: 1,
    accountStatus: 2,
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

const initUserList = async () => {
  const res = await requestUtil.post("/account/page", queryForm.value);
  console.log(res.data.data.records);
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

const statusChangeHandle = (row) => {};
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
