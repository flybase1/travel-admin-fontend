<template>
  <el-dialog :title="dialogTitle" width="30%" @close="handleClose">
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="订单状态">
        <el-select v-model="selectOrderStatus" clearable size="large">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="订单说明" prop="orderDescription">
        <el-input v-model="form.orderDescription" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import requestUtil, { getServerUrl } from "@/utils/request";
import { ElMessage } from "element-plus";

const props = defineProps({
  orderId: {
    type: Number,
    default: -1,
    required: true,
  },
  dialogTitle: {
    type: String,
    default: "",
    required: true,
  },
  dialogVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const options = [
  {
    value: 1,
    label: "未完成支付",
  },
  {
    value: 2,
    label: "已完成订单",
  },
  {
    value: 3,
    label: "取消订单",
  },
  {
    value: 4,
    label: "删除订单",
  },
  {
    value: 5,
    label: "订单超时",
  },
  {
    value: 6,
    label: "订单异常",
  },
  {
    value: 7,
    label: "订单退款",
  },
];

const selectOrderStatus = ref(0);

const form = ref({
  orderId: -1,
  accountId: -1,
  travelId: -1,
  alipayTradeNo: -1,
  payUtil: 0,
  orderStatusId: 0,
  orderDescription: "",
});

const rules = ref({
  userAccount: [
    { required: true, message: "请输入账号名" },
    { required: true, trigger: "blur" },
  ],
  /* validator: checkUsername,*/
  userEmail: [
    { required: true, message: "邮箱地址不能为空", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  userPhoneNum: [
    {
      required: true,
      message: "手机号码不能为空",
      trigger: "blur",
    },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

const formRef = ref(null);

watch(
  () => selectOrderStatus,
  (newValue) => {
    form.value.orderStatusId = newValue;
  }
);

const initFormData = async (id) => {
  const res = await requestUtil.get("/order/getOrder?orderId=" + id);
  // console.log(res.data);
  form.value = res.data.data;
  selectOrderStatus.value = form.value.orderStatusId;
};

watch(
  () => props.dialogVisible,
  () => {
    let orderIdP = props.orderId;
    console.log("id=" + orderIdP);
    if (orderIdP !== -1) {
      initFormData(orderIdP);
    } else {
      form.value = {
        orderId: -1,
        accountId: -1,
        travelId: -1,
        alipayTradeNo: -1,
        payUtil: 0,
        orderStatusId: 0,
        orderDescription: "",
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initOrderList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      console.log(form.value.orderId);
      if (form.value.orderId === -1) {
        form.value.orderStatusId = selectOrderStatus.value;
        result = await requestUtil.post("/order/addOrder", form.value);
        if (result.data.code === 0) {
          ElMessage.success("添加成功！");
          formRef.value.resetFields();
          emits("initOrderList");
          handleClose();
        } else {
          ElMessage.error("添加失败");
        }
        console.log(result.data);
      } else {
        form.value.orderStatusId = selectOrderStatus.value;
        result = await requestUtil.put("/order/updateOrder", form.value);
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("initOrderList");
          handleClose();
        } else {
          ElMessage.error("修改失败");
        }
      }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style lang="scss" scoped></style>
