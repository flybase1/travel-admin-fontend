<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="输入项目"
          v-model="queryForm.queryTravelId"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="7">
        <el-input
          placeholder="输入账号id"
          v-model="queryForm.queryAccountId"
          clearable
        ></el-input>
      </el-col>

      <el-button type="primary" :icon="Search" @click="initCommentList"
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
      <el-table-column prop="commentId" label="评论id" width="90" sortable />
      <el-table-column prop="accountId" label="账号id" width="100" />
      <el-table-column prop="userAccount" label="账号名" width="100" />
      <el-table-column prop="travelId" label="项目id" width="100" />
      <el-table-column prop="travelTitle" label="项目名" width="130" />
      <el-table-column
        prop="commentContent"
        label="评论内容"
        width="160"
        align="center"
      />
      <el-table-column
        prop="projectScore"
        label="项目评分⭐"
        width="120"
        align="center"
      />
      <el-table-column prop="createTime" label="评论时间" width="170">
        <template v-slot="scope">
          <span>{{ formateDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="commentStatus"
        label="评论状态"
        width="100"
        align="center"
      >
        <template v-slot="scope">
          <span v-if="scope.row.commentStatus === 0" style="color: #409eff"
            >正常</span
          >
          <span v-else-if="scope.row.commentStatus === 1" style="color: red"
            >违规</span
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="thumbNum"
        label="点赞数"
        width="100"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="action"
        label="评论违规?"
        width="180"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.commentStatus"
            active-text="违规"
            inactive-text="正常"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.commentStatus === 1"
            @change="statusChangeHandle(scope.row)"
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
        label="是否删除?"
        width="110"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <!-- 删除         -->
          <el-popconfirm
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.commentId)"
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
    :userId="userId"
    :dialogTitle="dialogTitle"
    @initCommentList="initCommentList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import { Delete, DocumentAdd, Edit, Search } from "@element-plus/icons-vue";
import Dialog from "./components/dialog.vue";
import { ElMessage } from "element-plus";
import formateDate from "@/utils/formatDate";

const tableData = ref([
  {
    commentId: 1,
    accountId: 1,
    userAccount: "test",
    travelId: 1,
    travelTitle: "项目",
    commentContent: "评论内容",
    createTime: "",
    projectScore: 5,
    commentStatus: 0,
  },
]);

const queryForm = ref({
  queryAccountId: "",
  queryTravelId: "",
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

const initCommentList = async () => {
  const res = await requestUtil.post("/comment/pageComment", queryForm.value);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

initCommentList();

const handleSizeChange = (pageSize: number) => {
  queryForm.value.current = 1;
  queryForm.value.pageSize = pageSize;
  initCommentList();
};
const handleCurrentChange = (current: number) => {
  queryForm.value.current = current;
  initCommentList();
};

const statusChangeHandle = async (row: any) => {
  if (row.commentStatus === 1) {
    ElMessage.error("违规评论不能恢复");
  }
  const res = await requestUtil.get(
    "/comment/isValid?commentId=" + row.commentId
  );
  if (res.data.code === 0) {
    ElMessage.success("审核成功");
  } else {
    ElMessage.error("审核失败");
  }
};
/**
 * 删除
 * @param id
 */
const handleDelete = async (id: number) => {
  var ids = [];
  if (id) {
    ids.push(id);
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.commentId);
    });
  }
  const res = await requestUtil.deleteR("/comment/deleteComment", ids);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    initCommentList();
  } else {
    ElMessage.error({ type: "error", message: "删除失败" });
  }
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
