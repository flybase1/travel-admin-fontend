<template>
  <div class="app-container">
    <el-row :gutter="20" class="header">
      <el-col :span="6">
        <el-input
          placeholder="输入账号id"
          v-model="queryForm.queryAccountId"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-input
          placeholder="项目id"
          v-model="queryForm.queryTravelId"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="queryForm.queryOrderStatusId"
          class="m-2"
          placeholder="订单状态"
          clearable
          placement="bottom"
        >
          <el-option
            v-for="item in orderStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="queryForm.queryPayUtil"
          class="m-2"
          placeholder="支付方式"
          clearable
        >
          <el-option
            v-for="item in payUtilOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>

      <el-button
        type="primary"
        :icon="Search"
        @click="initOrderList"
        align="right"
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
      <el-table-column prop="orderId" label="订单id" width="90" sortable />
      <el-table-column
        prop="accountId"
        label="账号id"
        width="70"
        align="center"
      />
      <el-table-column
        prop="travelId"
        label="项目id"
        width="100"
        align="center"
      />
      <el-table-column
        prop="totalAmount"
        label="总金额"
        width="100"
        align="center"
      />
      <el-table-column
        prop="alipayTradeNo"
        label="订单号"
        width="160"
        align="center"
      />
      <el-table-column
        prop="orderDescription"
        label="订单说明"
        width="160"
        align="center"
      />
      <el-table-column
        prop="payUtil"
        label="支付方式"
        width="160"
        align="center"
      >
        <template v-slot="scope">
          <span v-if="scope.row.payUtil === 0" style="color: #42b983">
            微信
          </span>
          <span v-else-if="scope.row.payUtil === 1" style="color: #409eff">
            支付宝
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderStatusId"
        label="订单状态"
        width="160"
        align="center"
      >
        <template v-slot="scope">
          <span v-if="scope.row.orderStatusId === 1" style="color: #42b983">
            未支付订单
          </span>
          <span
            v-else-if="scope.row.orderStatusId === 2"
            style="color: #67c23a"
          >
            已完成订单
          </span>
          <span v-else-if="scope.row.orderStatusId === 3" style="color: brown">
            取消订单
          </span>
          <span
            v-else-if="scope.row.orderStatusId === 4"
            style="color: #f56c6c"
          >
            删除订单
          </span>
          <span
            v-else-if="scope.row.orderStatusId === 5"
            style="color: #909399"
          >
            订单超时
          </span>
          <span
            v-else-if="scope.row.orderStatusId === 6"
            style="color: #909399"
          >
            订单异常
          </span>
          <span
            v-else-if="scope.row.orderStatusId === 7"
            style="color: #909399"
          >
            订单退款
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="170"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ formateDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="170"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ formateDate(scope.row.updateTime) }}</span>
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
            v-if="scope.row.userAccount != 'admin'"
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.orderId)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
            v-if="scope.row.userAccount != 'admin'"
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.orderId)"
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
    :orderId="orderId"
    :dialogTitle="dialogTitle"
    @initOrderList="initOrderList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import formateDate from "@/utils/formatDate";
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
import { ElMessage } from "element-plus";

const tableData = ref([
  {
    orderId: -1,
    accountId: -1,
    travelId: -1,
    totalAmount: -1,
    alipayTradeNo: "test123",
    payUtil: 0,
    orderStatusId: "",
    orderDescription: "",
    createTime: "",
    updateTime: "",
  },
]);

const queryForm = ref({
  queryAccountId: "",
  queryTravelId: "",
  queryPayUtil: "",
  queryOrderStatusId: "",
  current: 1,
  pageSize: 10,
});

const payUtilOptions = [
  {
    value: "0",
    label: "微信",
  },
  {
    value: "1",
    label: "支付宝",
  },
];

const orderStatusOptions = [
  {
    value: "1",
    label: "未支付订单",
  },
  {
    value: "2",
    label: "已完成订单",
  },
  {
    value: "3",
    label: "取消订单",
  },
  {
    value: "4",
    label: "删除订单",
  },
  {
    value: "5",
    label: "订单超时",
  },
  {
    value: "6",
    label: "订单异常",
  },
  {
    value: "7",
    label: "订单退款",
  },
];

const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const orderId = ref(-1);
// 定义选中的行
const multipleSelection = ref([]);

const sysRoleList = ref([]);
const roleDialogVisible = ref(false);
const userInfoDialogVisible = ref(false);
const initOrderList = async () => {
  const res = await requestUtil.post("/order/pageOrder", queryForm.value);
  //console.log("accountList===>", ...res.data.data.records);
  tableData.value = res.data.data.records;
  total.value = res.data.data.total;
};

initOrderList();

const handleSizeChange = (pageSize: number) => {
  queryForm.value.current = 1;
  queryForm.value.pageSize = pageSize;
  initOrderList();
};
const handleCurrentChange = (current: number) => {
  queryForm.value.current = current;
  initOrderList();
};

const handleDialogValue = (id: any) => {
  // console.log(id);
  if (id) {
    orderId.value = id;
    dialogTitle.value = "订单修改";
  } else if (id === undefined) {
    orderId.value = -1;
    dialogTitle.value = "订单添加";
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
      ids.push(row.orderId);
    });
  }
  const res = await requestUtil.deleteR("/account/delete/AccountList", ids);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "执行成功" });
    initOrderList();
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
