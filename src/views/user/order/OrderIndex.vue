<template>
  <div class="main">
    <div class="header">
      <el-row :gutter="10">
        <el-col :span="4"></el-col>
        <el-col :span="4">
          <el-select placeholder="所有订单" size="large">
            <el-option label="所有订单" value="0"></el-option>
            <el-option label="正在执行" value="1"></el-option>
            <el-option label="历史订单" value="2"></el-option>
            <el-option label="未出行订单" value="3"></el-option>
            <el-option label="取消订单" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input type="text" placeholder="输入出行名称" size="large">
            <template #suffix>
              <svg-icon icon="search" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button size="large" style="color: blue"> 搜索</el-button>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </div>
    <div class="content">
      <el-card v-for="order in orderList">
        <el-card :header="order.orderStatusName">
          <el-row>
            <el-col :span="4">{{ order.travelTitle }}</el-col>
            <el-col :span="16"></el-col>
            <el-col :span="4">
              <el-text size="large">￥</el-text>
              <el-text size="large" style="color: red"
                >{{ order.totalAmount }}
              </el-text>
            </el-col>
          </el-row>
          <el-divider />
          <el-row>
            <el-text size="large">订单描述:</el-text>
            <el-text size="large" style="padding-left: 20px"
              >{{ order.orderDescription }}
            </el-text>
          </el-row>
          <el-divider />
          <el-row>
            <el-col :span="6">
              <el-text size="large">出行时间</el-text>
              <el-text size="large" style="padding-left: 20px"
                >{{ order.beginTime }}
              </el-text>
            </el-col>
            <el-col :span="12" />
            <el-col :span="6">
              <el-text size="large">支付时间</el-text>
              <el-text size="large" style="padding-left: 20px"
                >{{ order.creatTime }}
              </el-text>
            </el-col>
          </el-row>
          <el-divider />
          <el-row>
            <el-col :span="14" />
            <el-col :span="4">
              <el-button type="primary">支付订单</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="danger">删除订单</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-card>
    </div>
    <div class="footer">
      <el-row>
        <el-col :span="6"></el-col>
        <el-col :span="10">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :small="small"
            :disabled="disabled"
            :background="background"
            style="font-size: 14px"
            layout="prev, pager, next, jumper"
            :total="1000"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const currentPage = ref(1);
const pageSize = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};

const order = ref({
  accountId: "",
  accountName: "",
  travelId: "",
  travelTitle: "",
  travelType: "",
  totalAmount: "",
  payUtil: "",
  orderId: "",
  orderStatusId: "",
  orderStatusName: "",
  beginTime: "",
  creatTime: "",
  orderDescription: "",
});
const orderList = ref([
  {
    accountId: 1,
    accountName: "test",
    travelId: "1",
    travelTitle: "厦门旅游",
    totalAmount: 200,
    payUtil: 0,
    orderId: 10086,
    orderStatusId: 1,
    orderStatusName: "未支付订单",
    travelType: "一日游",
    creatTime: "2023/11/10",
    beginTime: "2023/12/11",
    orderDescription: "一日游",
  },
  {
    accountId: 1,
    accountName: "test",
    travelId: "2",
    travelTitle: "厦门二旅游",
    totalAmount: 100,
    payUtil: 0,
    orderId: 10089,
    orderStatusId: 2,
    orderStatusName: "支付订单",
    creatTime: "2023/11/18",
    beginTime: "2023/12/22",
    travelType: "一日游",
    orderDescription: "二日游",
  },
]);
</script>

<style scoped lang="css">
.header {
  padding-left: 100px;
  padding-right: 100px;
}

.content {
  padding-left: 100px;
  padding-right: 100px;
}
</style>
