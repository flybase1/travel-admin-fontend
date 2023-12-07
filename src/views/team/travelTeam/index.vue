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
      <el-table-column type="selection" width="40" />
      <el-table-column type="expand" width="100" label="队伍详情">
        <template v-slot="scope">
          <el-table :data="scope.row.travelTeamUserVos">
            <el-table-column width="40"></el-table-column>
            <el-table-column
              prop="travelTeamUserId"
              label="队伍用户id"
              width="90"
            />
            <el-table-column prop="travelTeamId" label="队伍id" width="100" />
            <el-table-column
              prop="travelTeamName"
              label="队伍名字"
              width="100"
            />
            <el-table-column prop="joinAccountId" label="用户id" width="100" />
            <el-table-column prop="userAccount" label="账号" width="100" />
            <el-table-column prop="joinTime" label="加入时间" width="190">
              <template v-slot="scope">
                <span>{{ formateDate(scope.row.joinTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isFinished" label="是否结束" width="120">
              <template v-slot="scope">
                <span v-if="scope.row.isFinished === 0" style="color: #409eff"
                  >未结束</span
                >
                <span
                  v-else-if="scope.row.isFinished === 1"
                  style="color: darkred"
                  >结束</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="isGuide" label="是否导游" width="120">
              <template v-slot="scope">
                <span v-if="scope.row.isGuide === 1" style="color: darkgreen"
                  >导游</span
                >
                <span v-else-if="scope.row.isGuide === 0" style="color: #409eff"
                  >用户</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作"
              width="190"
              fixed="right"
              align="center"
            >
              <template v-slot="scope">
                <!-- 删除         -->
                <el-popconfirm
                  title="您确定要删除这条记录吗？"
                  @confirm="
                    handleDeleteTravelTeamUser(scope.row.travelTeamUserId)
                  "
                >
                  <template #reference>
                    <el-button type="danger" :icon="Delete" />
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="travelTeamId" label="队伍id" width="90" sortable />
      <el-table-column prop="travelId" label="项目id" width="100" />
      <el-table-column prop="travelTitle" label="项目名" width="130" />
      <el-table-column prop="maxNum" label="最大人数" width="130" />
      <el-table-column prop="guideNum" label="导游人数" width="130" />
      <el-table-column prop="nowNum" label="现在加入人数" width="130" />
      <el-table-column prop="createTime" label="创建时间" width="170">
        <template v-slot="scope">
          <span>{{ formateDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTeamAccountId"
        label="创建者id"
        width="130"
      />
      <el-table-column prop="userAccount" label="账号" width="160" />
      <el-table-column prop="travelTeamName" label="队伍名" width="160" />
      <el-table-column prop="travelTeamStatus" label="是否公开" width="160">
        <template v-slot="scope">
          <span style="color: #42b983" v-if="scope.row.travelTeamStatus === 0">
            不可加入</span
          >
          <span
            style="color: firebrick"
            v-if="scope.row.travelTeamStatus === 1"
          >
            可加入</span
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="action"
        label="公开?"
        width="180"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.travelTeamStatus"
            active-text="私人"
            inactive-text="公开"
            :active-value="0"
            :inactive-value="1"
            @click="handleChangeTeamStatus(scope.row)"
            style="
              --el-switch-off-color: #13ce66;
              --el-switch-on-color: #ff4949;
              padding-right: 20px;
            "
          />
        </template>
      </el-table-column>

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
            @click="handleDialogValue(scope.row.travelTeamId)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.travelTeamId)"
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
    :travelTeamId="travelTeamId"
    :dialogTitle="dialogTitle"
    @initTravelTeamList="initTravelTeamList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import { Delete, DocumentAdd, Edit, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import Dialog from "@/views/team/travelTeam/components/dialog.vue";
import formateDate from "@/utils/formatDate";

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
    travelTeamStatus: "",
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

const travelUserList = ref({
  travelTeamUserId: "",
  travelTeamId: "",
  joinAccountId: "",
  joinTime: "",
  isFinished: "",
  isGuide: "",
});
const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const travelTeamId = ref(-1);
// 定义选中的行
const multipleSelection = ref([]);

const initTravelTeamList = async () => {
  const res = await requestUtil.post(
    "/travelTeam/pageTravelTeam",
    queryForm.value
  );
  tableData.value = res.data.data.records;
  travelUserList.value = res.data.data.records.travelTeamUserVos;
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
    travelTeamId.value = id;
    dialogTitle.value = "用户修改";
  } else if (id === undefined) {
    travelTeamId.value = -1;
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

// 删除队伍加入人员
const handleDeleteTravelTeamUser = async (id: number) => {
  var ids = [];
  if (id) {
    ids.push(id);
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.travelTeamUserId);
    });
  }
  const res = await requestUtil.deleteR(
    "/travelTeamUser/deleteTravelTeamUser",
    ids
  );
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    await initTravelTeamList();
  } else {
    ElMessage.error({ type: "error", message: "删除失败" });
  }
};

// 删除队伍
const handleDelete = async (id: number) => {
  var ids = [];
  if (id) {
    ids.push(id);
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.travelTeamId);
    });
  }
  const res = await requestUtil.deleteR("/travelTeam/deleteTravelTeams", ids);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    await initTravelTeamList();
  } else {
    ElMessage.error({ type: "error", message: "删除失败" });
  }
};

const handleChangeTeamStatus = async (row: any) => {
  const res = await requestUtil.put(
    "/travelTeam/changeStatus/" + row.travelTeamId
  );
  if (res.data.code === 0) {
    ElMessage.success("修改成功");
  } else {
    ElMessage.error("后台出错");
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
