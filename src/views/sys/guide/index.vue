<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-select
          v-model="queryForm.queryApprovalStatus"
          class="m-2"
          placeholder="审核状态"
          clearable
          size="large"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="导游评分"
          v-model="queryForm.queryScore"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initGuideList"
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
      <el-table-column prop="guideId" label="导游id" width="90" sortable />
      <el-table-column prop="userAccount" label="账号名" width="120" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="userAvatar" label="头像" width="130">
        <template v-slot="scope"
          ><img :src="scope.row.userAvatar" width="50" height="50"
        /></template>
      </el-table-column>
      <el-table-column
        prop="guideCertificate"
        label="导游证明"
        width="180"
      ></el-table-column>
      <el-table-column prop="approvalStatus" label="审核状态" width="100">
        <template v-slot="scope">
          <span style="color: gray" v-if="scope.row.approvalStatus === 0"
            >等待审核</span
          >
          <span
            style="color: deepskyblue"
            v-else-if="scope.row.approvalStatus === 1"
          >
            审核成功
          </span>
          <span style="color: red" v-else-if="scope.row.approvalStatus === 2">
            审核失败
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="导游评分" width="60" />
      <el-table-column prop="approvalResult" label="失败原因" width="120" />
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
            @click="handleDialogValue(scope.row.guideId)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
            v-if="scope.row.userAccount != 'admin'"
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.guideId)"
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
    :guide-id="guideId"
    :dialogTitle="dialogTitle"
    @initGuideList="initGuideList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import { Delete, DocumentAdd, Edit, Search } from "@element-plus/icons-vue";
import Dialog from "./components/dialog.vue";
import { ElMessage } from "element-plus";

const options = [
  {
    value: "0",
    label: "待审核",
  },
  {
    value: "1",
    label: "审核成功",
  },
  {
    value: "2",
    label: "审核失败",
  },
];

const tableData = ref([
  {
    guideId: 1,
    userAccount: "test",
    guideCertificate: "test",
    userAvatar: "https://picsum.photos/200/300",
    approvalStatus: 0,
    score: 5,
    username: "test",
    createTime: "1111",
    approvalResult: "ok",
  },
]);

const queryForm = ref({
  queryApprovalStatus: "",
  queryScore: "",
  current: 1,
  pageSize: 10,
});

const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const guideId = ref(-1);
// 定义选中的行
const multipleSelection = ref([]);

const initGuideList = async () => {
  const res = await requestUtil.post("/guide/guidePage", queryForm.value);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

initGuideList();

const handleSizeChange = (pageSize: number) => {
  queryForm.value.current = 1;
  queryForm.value.pageSize = pageSize;
  initGuideList();
};
const handleCurrentChange = (current: number) => {
  queryForm.value.current = current;
  initGuideList();
};

const handleDialogValue = (id: any) => {
  // console.log(id);
  if (id) {
    guideId.value = id;
    dialogTitle.value = "导游修改";
  } else if (id === undefined) {
    guideId.value = -1;
    dialogTitle.value = "用户添加";
  }
  dialogVisible.value = true;
};
// 批量删除
const delBtnStatus = ref(true);

const handleSelectionChange = (selection: []) => {
  // console.log(selection);
  multipleSelection.value = selection;
  delBtnStatus.value = selection.length == 0;
};

const handleDelete = async (id: number) => {
  // var ids = [];
  // if (id) {
  //   ids.push(id);
  // } else {
  //   multipleSelection.value.forEach((row) => {
  //     ids.push(row.guideId);
  //   });
  // }
  const res = await requestUtil.deleteR("/guide/deleteGuide?guideId", id);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    initGuideList();
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
