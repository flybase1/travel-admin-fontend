<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="输入账号id"
          v-model="queryForm.queryAccountId"
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
      <el-col :span="7">
        <el-input
          placeholder="输入城市id"
          v-model="queryForm.queryTravelCityId"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入状态"
          v-model="queryForm.queryTravelStatus"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入标题"
          v-model="queryForm.queryTravelTitle"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initTravelList"
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
      <el-table-column prop="travelId" label="项目id" width="90" sortable />
      <el-table-column prop="accountId" label="账号id" width="100" />
      <el-table-column prop="travelNumbers" label="人数" width="130" />
      <el-table-column prop="travelTitle" label="旅行标题" width="160" />
      <el-table-column prop="travelDescription" label="旅行描述" width="160" />
      <el-table-column prop="travelPrice" label="项目价格" width="160" />
      <el-table-column prop="typeName" label="旅行类型" width="160" />
      <el-table-column prop="travelCityName" label="旅行地址" width="160" />
      <el-table-column prop="projectStatus" label="是否发布" width="160" />
      <el-table-column prop="travelScore" label="项目评分" width="160" />
      <el-table-column prop="travelStatusName" label="项目状态" width="160" />
      <el-table-column prop="beginTime" label="开始时间" width="160" />
      <el-table-column prop="endTime" label="结束时间" width="160" />
      <el-table-column
        prop="action"
        label="操作"
        width="190"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.travelId)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
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
    :travel-id="travelId"
    :dialogTitle="dialogTitle"
    @initTravelList="initTravelList"
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
    travelId: -1,
    accountId: -1,
    travelNumbers: 0,
    travelTitle: "test",
    travelDescription: "test",
    travelPrice: 10,
    typeName: "test",
    travelCityName: "test",
    travelScore: 5,
    travelStatusId: 1,
    travelStatusName: "",
    beginTime: "",
    endTime: "",
    projectStatus: 0,
  },
]);

const queryForm = ref({
  queryTravelId: "",
  queryAccountId: "",
  queryTravelTitle: "",
  queryTypeId: "",
  queryTravelCityId: "",
  queryTravelScore: "",
  queryTravelStatusId: "",
  current: 1,
  pageSize: 10,
});

const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const travelId = ref(-1);
// 定义选中的行
const multipleSelection = ref([]);

const initTravelList = async () => {
  const res = await requestUtil.post("/project/pageProject", queryForm.value);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

initTravelList();

const handleSizeChange = (pageSize: number) => {
  queryForm.value.current = 1;
  queryForm.value.pageSize = pageSize;
  initTravelList();
};
const handleCurrentChange = (current: number) => {
  queryForm.value.current = current;
  initTravelList();
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
    initTravelList();
  }
};

const handleDialogValue = (id: any) => {
  // console.log(id);
  if (id) {
    travelId.value = id;
    dialogTitle.value = "项目修改";
  } else if (id === undefined) {
    travelId.value = -1;
    dialogTitle.value = "项目添加";
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
      ids.push(row.travelId);
    });
  }
  const res = await requestUtil.deleteR("/account/delete/AccountList", ids);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    initTravelList();
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
