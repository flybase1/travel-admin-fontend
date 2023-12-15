<template>
  <div class="main">
    <div class="header"></div>
    <div class="content">
      <el-card header="定制旅行">
        <el-row>
          <el-col :span="12">
            <el-form
              :model="formData"
              label-width="100px"
              :rules="formRules"
              label-position="right"
            >
              <el-form-item label="出游性质" prop="travelTypeId">
                <el-select
                  placeholder="所有产品"
                  size="large"
                  v-model="formData.travelTypeId"
                >
                  <el-option label="所有产品" value="0"></el-option>
                  <el-option label="团体游" value="1"></el-option>
                  <el-option label="亲子游" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目的地" prop="travelCity">
                <el-input
                  type="text"
                  v-model="formData.travelCity"
                  class="inputTextLength"
                ></el-input>
              </el-form-item>
              <el-form-item label="出行日期">
                <el-date-picker
                  v-model="formData.travelBeginTime"
                ></el-date-picker>
                <el-divider direction="vertical"></el-divider>
                <el-date-picker
                  v-model="formData.travelEndTime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="出行人数" prop="travelNumbers">
                <el-input-number
                  v-model="formData.travelNumbers"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="预估费用" prop="travelEstimation">
                <el-input-number
                  v-model="formData.travelEstimation"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="期望导游数" prop="travelGuideNums">
                <el-input-number
                  v-model="formData.travelGuideNums"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="需求说明" prop="travelDescription">
                <el-input
                  type="textarea"
                  clearable
                  maxlength="1000"
                  v-model="formData.travelDescription"
                  style="width: 400px"
                  :rows="4"
                  show-word-limit
                  placeholder="选填，您可以在此输入个性化需求，如：同行人中是否含婴儿、老人，希望定制师何时联系您，对酒店、景点、出行方式的具体要求等"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人姓名" prop="travelUserName">
                <el-input
                  v-model="formData.travelUserName"
                  class="inputTextLength"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="手机号"
                prop="travelUserPhoneNum"
                style="width: 350px"
              >
                <el-input v-model="formData.travelUserPhoneNum"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" style="background-color: #404972">
            <el-row
              ><h2 style="color: white; padding-left: 30px">
                我的需求单
              </h2></el-row
            >
            <el-divider></el-divider>
            <el-row>
              <el-text size="large" class="rightContentText"
                >出游性质:
              </el-text>
              <el-text size="large" class="rightContentInputText"
                >{{ formData.travelTypeId }}
              </el-text>
            </el-row>

            <el-row>
              <el-text size="large" class="rightContentText">目的地:</el-text>
              <el-text size="large" class="rightContentInputText"
                >{{ formData.travelCity }}
              </el-text>
            </el-row>
            <el-row>
              <el-text size="large" class="rightContentText"
                >出行日期:
              </el-text>
              <el-text size="large" class="rightContentInputText">
                {{
                  (formData.travelBeginTime &&
                    formatDate(formData.travelBeginTime)) ||
                  ""
                }}
              </el-text>
              <el-text
                size="large"
                style="padding-left: 10px; color: white; padding-top: 20px"
                >至
              </el-text>
              <el-text
                size="large"
                style="padding-left: 20px; color: white; padding-top: 20px"
              >
                {{
                  (formData.travelEndTime &&
                    formatDate(formData.travelEndTime)) ||
                  ""
                }}
              </el-text>
            </el-row>
            <el-row>
              <el-text size="large" class="rightContentText"
                >出行人数:
              </el-text>
              <el-text size="large" class="rightContentInputText"
                >{{ formData.travelNumbers }}
              </el-text>
            </el-row>
            <el-row>
              <el-text size="large" class="rightContentText"
                >预估费用:
              </el-text>
              <el-text size="large" class="rightContentInputText"
                >{{ formData.travelEstimation }}
              </el-text>
            </el-row>
            <el-row>
              <el-text size="large" class="rightContentText"
                >期望导游数:
              </el-text>
              <el-text size="large" class="rightContentInputText"
                >{{ formData.travelGuideNums }}
              </el-text>
            </el-row>
            <el-row>
              <el-text size="large" class="rightContentText"
                >需求说明:
              </el-text>
              <el-text size="large" class="rightContentInputText"
                >{{ formData.travelDescription }}
              </el-text>
            </el-row>
            <el-row>
              <el-text size="large" class="rightContentText"
                >联系人姓名:
              </el-text>
              <el-text size="large" class="rightContentInputText"
                >{{ formData.travelUserName }}
              </el-text>
            </el-row>
            <el-row>
              <el-text size="large" class="rightContentText">手机号:</el-text>
              <el-text size="large" class="rightContentInputText"
                >{{ formData.travelUserPhoneNum }}
              </el-text>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import formatDate from "@/utils/formatDate";

const formData = ref({
  travelTypeId: "",
  travelType: "",
  travelCity: "",
  travelBeginTime: "",
  travelEndTime: "",
  travelNumbers: 1,
  travelMoney: "",
  travelEstimation: "",
  travelGuideNums: 1,
  travelDescription: "",
  travelUserName: "",
  travelUserPhoneNum: "",
});

const formRules = ref({
  travelTypeId: [
    {
      required: true,
      message: "类型不能为空",
      trigger: "blur",
    },
  ],
  travelCity: [
    {
      required: true,
      message: "城市不能为空",
      trigger: "blur",
    },
  ],
  travelBeginTime: [
    {
      required: true,
      message: "开始时间不能为空",
      trigger: "blur",
    },
  ],
  travelEndTime: [
    {
      required: true,
      message: "结束时间不能为空",
      trigger: "blur",
    },
  ],
  travelNumbers: [
    {
      required: true,
      message: "人数不能为空",
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      max: 100,
      trigger: "change",
      message: "人数范围1-100",
    },
  ],
  travelEstimation: [
    {
      required: true,
      message: "预估费用不能为空",
      trigger: ["blur", "change"],
    },
    {
      min: 0,
      max: 999999,
      trigger: "change",
      message: "费用在0-999999之间",
    },
  ],
  travelUserName: [
    {
      required: true,
      message: "联系人姓名不能为空",
      trigger: ["blur", "change"],
    },
  ],
  travelUserPhoneNum: [
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
  travelGuideNums: [
    {
      required: true,
      message: "导游人数不能为空",
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      max: 10,
      trigger: "change",
      message: "导游人数必须为1-10位",
    },
  ],
});

const handleSubmit = async () => {};
</script>

<style scoped lang="scss">
.content {
  padding-left: 60px;
  padding-right: 60px;
}

.leftContent {
  width: 100%;
}

.mainContent {
  width: 100%;
}

.inputTextLength {
  width: 220px;
}

.el-textarea__inner {
  resize: none;
}

.rightContentText {
  color: #9fa4b8;
  padding-left: 90px;
  padding-top: 20px;
}

.rightContentInputText {
  padding-left: 60px;
  color: white;
  padding-top: 20px;
}
</style>
