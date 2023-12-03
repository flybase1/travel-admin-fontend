<template>
  <!--    v-model="dialogVisible"  -->
  <el-dialog :title="dialogTitle" width="80%" @close="handleClose">
    <el-form ref="formRef" :model="form" label-width="130px">
      <el-form-item label="项目名字" prop="travelTitle">
        <el-input v-model="form.travelTitle" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="创建者信息" prop="accountId">
            <el-input v-model="form.accountId" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="旅行人数" prop="travelNumbers">
            <el-input v-model="form.travelNumbers" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="旅行类型" prop="typeId">
            <el-select v-model="form.typeId" placeholder="选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="旅行项目状态" prop="travelStatusId">
            <el-select v-model="form.travelStatusId" placeholder="选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="开始时间">
            <el-date-picker v-model="form.beginTime"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.endTime"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label=" 项目评分">
            <el-input-number
              v-model="form.travelScore"
              :disabled="true"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label=" 旅游地区">
            <el-select v-model="form.travelCityId" placeholder="选择">
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="旅行内容" prop="travelDescription">
        <el-input
          v-model="form.travelDescription"
          type="textarea"
          clearable
          maxlength="2000"
          rows="12"
        />
      </el-form-item>

      <el-form-item label="插入图片">
        <el-card> 图片地址</el-card>
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
import { defineEmits, defineProps, ref, watch, watchEffect } from "vue";
import requestUtil, { getServerUrl } from "@/utils/request";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const props = defineProps({
  travelId: {
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

const form = ref({
  travelId: "",
  accountId: "",
  travelNumbers: "",
  travelTitle: "",
  travelDescription: "",
  travelPrice: "",
  typeId: "",
  typeName: "",
  travelCityId: "",
  travelCityName: "",
  travelScore: 5,
  travelStatusId: "",
  travelStatusName: "",
  beginTime: "",
  endTime: "",
});

// const checkUsername = async (rule, value, callback) => {
//   if (form.value.accountId === -1) {
//     const res = await requestUtil.post("sys/user/checkUserName", {
//       username: form.value.userAccount,
//     });
//     if (res.data.code === 500) {
//       callback(new Error("用户名已存在！"));
//     } else {
//       callback();
//     }
//   } else {
//     callback();
//   }
// };

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
const typeOptions = ref([]); // 定义 options 数组
const cityOptions = ref([]); // 定义 options 数组
const statusOptions = ref([]); // 定义 options 数组
const initFormData = async (id) => {
  const res = await requestUtil.get("/project/getTravel?travelId=" + id);
  //console.log(res.data);
  form.value = res.data.data;
};
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
watch(
  () => props.dialogVisible,
  () => {
    let travelIdP = props.travelId;
    console.log("id=" + travelIdP);
    if (travelIdP !== -1) {
      initFormData(travelIdP);
    } else {
      form.value = {
        travelId: "",
        accountId: "",
        travelNumbers: "",
        travelTitle: "",
        travelDescription: "",
        travelPrice: "",
        typeId: "",
        typeName: "",
        travelCityId: "",
        travelCityName: "",
        travelScore: 5,
        travelStatus: "",
        beginTime: "",
        endTime: "",
      };
    }
  }
);

const emits = defineEmits(["update:modelValue", "initTravelList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      console.log(form.value.accountId);
      if (form.value.accountId === -1) {
        result = await requestUtil.post("/account/saveAccount", form.value);
        if (result.data.code === 0) {
          ElMessage.success("添加成功！");
          formRef.value.resetFields();
          emits("initUserList");
          handleClose();
        } else {
          ElMessage.error("添加失败");
        }
        console.log(result.data);
      } else {
        result = await requestUtil.put("/account/updateAccount", form.value);
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("initUserList");
          handleClose();
        } else {
          ElMessage.error("修改失败");
        }
      }
      // if (result.data.code === 0) {
      //   ElMessage.success("添加成功！");
      //   formRef.value.resetFields();
      //   emits("initUserList");
      //   handleClose();
      // } else {
      //   ElMessage.error("添加失败");
      // }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style lang="scss" scoped></style>
