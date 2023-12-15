<template>
  <div class="main">
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="5"></el-col>
        <el-col :span="3">
          <el-select placeholder="所有产品" size="large">
            <el-option label="所有产品" value="0"></el-option>
            <el-option label="团体游" value="1"></el-option>
            <el-option label="亲子游" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input type="text" placeholder="输入目的地/旅游类型" size="large">
            <template #suffix>
              <svg-icon icon="search" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button size="large" style="color: lightblue"> 搜索</el-button>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </div>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="4">
          <!--          <div class="leftContent">-->
          <!--            <el-card>-->
          <!--              <el-card v-for="o in 8" key="o">南通{{ o }}日游</el-card>-->
          <!--            </el-card>-->
          <!--          </div>-->
        </el-col>

        <el-col :span="16">
          <div class="mainContent">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-card
                  v-for="item in travelList"
                  :key="item.travelId"
                  style="padding-top: 10px"
                  @click="handleClickTravelInfo(item.travelId)"
                  shadow="hover"
                >
                  <el-row :gutter="5">
                    <el-col :span="5">
                      <el-image
                        :src="item.coverPictureUrl"
                        style="width: 160px; height: 140px"
                      />
                    </el-col>
                    <el-col :span="19">
                      <el-row>
                        <h2>{{ item.travelTitle }}</h2>
                      </el-row>
                      <el-row>
                        <el-tag>
                          {{ item.travelType }}
                        </el-tag>
                      </el-row>
                      <el-row :gutter="5" style="padding-top: 10px">
                        <el-space spacer="|" size="large">
                          <el-col>
                            <el-rate
                              v-model="item.travelScore"
                              :disabled="true"
                            ></el-rate>
                          </el-col>
                          <el-col>
                            <el-text> 可定 {{ item.travelNumbers }} 人</el-text>
                          </el-col>
                          <el-col>
                            <el-text>开始时间 {{ item.beginTime }}</el-text>
                          </el-col>
                        </el-space>
                      </el-row>
                      <el-row>
                        <el-col :span="18"></el-col>
                        <el-col :span="6">
                          <el-text
                            size="large"
                            style="color: red; float: right; font-size: 20px"
                            >¥{{ item.travelPrice }}
                          </el-text>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="4" />
      </el-row>
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
import { ElMessage } from "element-plus";
import router from "@/router";

const currentPage = ref(1);
const pageSize = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const travel = ref({
  travelId: "",
  coverPictureUrl: "",
  travelTitle: "",
  travelScore: "",
  travelPrice: "",
  travelType: "",
  travelNumbers: "",
  beginTime: "",
});

const travelList = ref([
  {
    travelId: 1,
    coverPictureUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
    travelTitle: "厦门旅游",
    travelScore: 4.3,
    travelPrice: 192,
    travelType: "团队游",
    travelNumbers: 12,
    beginTime: "2023/12/11",
  },
  {
    travelId: 2,
    coverPictureUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
    travelTitle: "厦门旅游",
    travelScore: 4.3,
    travelPrice: 192,
    travelType: "团队游",
    travelNumbers: 12,
    beginTime: "2023/12/11",
  },
  {
    travelId: 3,
    coverPictureUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
    travelTitle: "厦门旅游",
    travelScore: 4.3,
    travelPrice: 192,
    travelType: "团队游",
    travelNumbers: 12,
    beginTime: "2023/12/11",
  },
  {
    travelId: 4,
    coverPictureUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
    travelTitle: "厦门旅游",
    travelScore: 4.3,
    travelPrice: 192,
    travelType: "团队游",
    travelNumbers: 12,
    beginTime: "2023/12/11",
  },
  {
    travelId: 5,
    coverPictureUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
    travelTitle: "厦门旅游",
    travelScore: 4.3,
    travelPrice: 192,
    travelType: "团队游",
    travelNumbers: 12,
    beginTime: "2023/12/11",
  },
  {
    travelId: 6,
    coverPictureUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
    travelTitle: "厦门旅游",
    travelScore: 4.3,
    travelPrice: 192,
    travelType: "团队游",
    travelNumbers: 12,
    beginTime: "2023/12/11",
  },
  {
    travelId: 7,
    coverPictureUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
    travelTitle: "厦门旅游",
    travelScore: 4.3,
    travelPrice: 192,
    travelType: "团队游",
    travelNumbers: 12,
    beginTime: "2023/12/11",
  },
]);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};

const handleClickTravelInfo = async (id: number) => {
  await router.push(`/travelInfo/${id}`);
  // ElMessage.success("点击了旅游" + id);
};
</script>

<style scoped lang="css">
.content {
  padding-top: 20px;
}

.leftContent {
  width: 100%;
}

.mainContent {
  width: 100%;
}
</style>
