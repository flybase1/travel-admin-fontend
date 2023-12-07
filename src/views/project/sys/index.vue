<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="4">
        <el-input
          placeholder="输入账号id"
          v-model="queryForm.queryAccountId"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="queryForm.queryTypeId"
          placeholder="选择类型"
          clearable
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="queryForm.queryTravelCityId"
          placeholder="选择城市"
          clearable
        >
          <el-option
            v-for="item in cityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="queryForm.queryTravelStatusId"
          placeholder="选择状态"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
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
      style="width: 100%; font-size: 15px"
      @selectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="expand" label="详细信息" width="80">
        <template v-slot="scope">
          <el-row>
            <el-col :span="15">
              <el-card
                style="width: 100%; align-content: center; align-items: center"
              >
                <template #header>
                  <div class="card-header">
                    <span>内容详情</span>
                  </div>
                </template>
                <div v-html="scope.row.travelDescription"></div>
              </el-card>
            </el-col>
          </el-row>
          <el-card>
            <template #header>
              <span>展示图片</span>
            </template>
            <span
              v-for="picture in scope.row.pictureList"
              class="image-container"
            >
              <el-image
                style="width: 100px; height: 100px"
                :src="picture.pictureUrl"
                fit="fill"
                :initial-index="1"
              />
            </span>
          </el-card>
        </template>
      </el-table-column>
      <el-table-column prop="travelId" label="项目id" width="90" sortable>
      </el-table-column>
      <el-table-column prop="accountId" label="账号id" width="100" />
      <el-table-column prop="travelNumbers" label="人数" width="130" />
      <el-table-column prop="travelTitle" label="旅行标题" width="160" />
      <!--      <el-table-column prop="travelDescription" label="旅行描述" width="160">-->
      <!--      </el-table-column>-->
      <el-table-column prop="travelPrice" label="项目价格" width="160" />
      <el-table-column prop="typeName" label="旅行类型" width="160" />
      <el-table-column prop="travelCityName" label="旅行地址" width="160" />
      <el-table-column prop="projectStatus" label="是否发布" width="160">
        <template v-slot="scope">
          <span v-if="scope.row.projectStatus === 0" style="color: #409eff"
            >未发布</span
          >
          <span v-else-if="scope.row.projectStatus === 1" style="color: salmon"
            >已发布</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="travelScore" label="项目评分" width="160" />
      <el-table-column prop="travelStatusName" label="项目状态" width="160" />
      <el-table-column prop="beginTime" label="开始时间" width="180">
        <template v-slot="scope">
          <span>{{ formateDate(scope.row.beginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180">
        <template v-slot="scope">
          <span>{{ formateDate(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="330"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            type="primary"
            :icon="DocumentAdd"
            @click="handleTravelTeamDialogValue(scope.row.travelId)"
            >队伍
          </el-button>
          <el-button
            type="primary"
            v-if="scope.row.projectStatus === 0"
            @click="handleChangeProjectStatusToOnline(scope.row.travelId)"
          >
            发布项目
          </el-button>
          <el-button
            type="success"
            v-if="scope.row.projectStatus === 1"
            @click="handleChangeProjectStatusToOffline(scope.row.travelId)"
          >
            下线项目
          </el-button>
          <el-button
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.travelId)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.travelId)"
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
  <TravelTeamDialog
    v-model="dialogTravelTeamVisible"
    :dialog-visible="dialogTravelTeamVisible"
    :dialog-title="dialogTravelTeamTitle"
    :travel-team-id="-1"
    :travel-id="travelId"
    :create-team-account-id="store.getters.GET_USER_INFO.accountId"
  ></TravelTeamDialog>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import requestUtil from "@/utils/request";
import { Delete, DocumentAdd, Edit, Search } from "@element-plus/icons-vue";
import Dialog from "./components/dialog.vue";
import { ElMessage } from "element-plus";
import formateDate from "@/utils/formatDate";
import TravelTeamDialog from "@/views/team/travelTeam/components/dialog.vue";
import store from "@/store";

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
    coverPictureUrl: "",
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

const typeOptions = ref([]); // 定义 options 数组
const cityOptions = ref([]); // 定义 options 数组
const statusOptions = ref([]); // 定义 options 数组
watchEffect(async () => {
  // 类型转换
  const typeRes = await requestUtil.get("travelType/listType");
  typeOptions.value = typeRes.data.data.map((item) => ({
    value: item.typeId,
    label: item.travelType,
  }));
  // 城市转换
  const cityRes = await requestUtil.get("travelCity/listCitys");
  cityOptions.value = cityRes.data.data.map((item) => ({
    value: item.cityId,
    label: item.cityName,
  }));
  // 状态转换
  const statusRes = await requestUtil.get("travelstatus/listStatus");
  statusOptions.value = statusRes.data.data.map((item) => ({
    value: item.travelStatusId,
    label: item.travelStatusName,
  }));
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

const dialogTravelTeamVisible = ref(false);
const dialogTravelTeamTitle = ref("");

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
 * 项目上线
 * @param id
 */
const handleChangeProjectStatusToOnline = async (id: number) => {
  const online = await requestUtil.post(
    "/project/onlineProject?travelId=" + id
  );
  if (online.data.code === 0) {
    await initTravelList();
    ElMessage({ type: "success", message: "执行成功" });
  }
};

/**
 * 项目下线
 * @param id
 */
const handleChangeProjectStatusToOffline = async (id: number) => {
  const offline = await requestUtil.post(
    "/project/offLineProject?travelId=" + id
  );
  if (offline.data.code === 0) {
    await initTravelList();
    ElMessage({ type: "success", message: "执行成功" });
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

const handleTravelTeamDialogValue = (id: number) => {
  travelId.value = id;
  dialogTravelTeamTitle.value = "队伍添加";
  dialogTravelTeamVisible.value = true;
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
  const res = await requestUtil.post("/project/deleteTravels", ids);
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

.centered-content {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.image-container {
  padding-right: 10px; /* 你可以根据需要调整间距大小 */
}
</style>
