<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="4">
        <el-input
          placeholder="输入查询类型"
          v-model="queryForm.queryTravelType"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initTravelTypeList"
        >搜索
      </el-button>
    </el-row>

    <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()"
      >新增
    </el-button>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%; font-size: 15px"
      @selectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="typeId" label="类型id" width="90" sortable>
      </el-table-column>
      <el-table-column prop="travelType" label="类型名" width="170" />
      <el-table-column
        prop="action"
        label="操作"
        width="130"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.typeId)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.typeId)"
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
    :typeId="typeId"
    :dialogTitle="dialogTitle"
    @initTravelTypeList="initTravelTypeList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import { Delete, DocumentAdd, Edit, Search } from "@element-plus/icons-vue";
import Dialog from "@/views/project/travelType/components/dialog.vue";
import { ElMessage } from "element-plus";

const tableData = ref([
  {
    typeId: -1,
    travelType: "test",
  },
]);

const queryForm = ref({
  queryTravelType: "",
  current: 1,
  pageSize: 10,
});

const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const typeId = ref(-1);
// 定义选中的行
const multipleSelection = ref([]);

const initTravelTypeList = async () => {
  const res = await requestUtil.post(
    "/travelType/pageTravelType",
    queryForm.value
  );
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

initTravelTypeList();

const handleSizeChange = (pageSize: number) => {
  queryForm.value.current = 1;
  queryForm.value.pageSize = pageSize;
  initTravelTypeList();
};
const handleCurrentChange = (current: number) => {
  queryForm.value.current = current;
  initTravelTypeList();
};

const handleDialogValue = (id: any) => {
  if (id) {
    typeId.value = id;
    dialogTitle.value = "项目修改";
  } else if (id === undefined) {
    typeId.value = -1;
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
  const res = await requestUtil.deleteR("/travelType/deleteType/" + id);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    await initTravelTypeList();
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
