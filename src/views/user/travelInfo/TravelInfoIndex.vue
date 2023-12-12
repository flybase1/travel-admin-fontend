<template>
  <div class="main">
    <div class="header">
      <!--   图片   -->
      <el-card>
        <el-row style="padding-left: 20px">
          <el-col :span="10">
            <el-carousel :interval="3000" height="280px" style="width: 400px">
              <el-carousel-item v-for="item in pictureList" :key="item.id">
                <img :src="item.url" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="12">
            <el-row
              ><h2>{{ travelInfo.travelTitle }}</h2></el-row
            >
            <el-row>
              <el-text size="large" style="color: orange"> 目的地</el-text>
              <el-text size="large" style="padding-left: 34px">
                {{ travelInfo.travelCity }}
              </el-text>
            </el-row>

            <el-row justify="start" style="padding-top: 6px">
              <el-text size="large" style="color: orange">线路类型</el-text>
              <el-text size="large" style="padding-left: 20px"
                >{{ travelInfo.travelType }}
              </el-text>
            </el-row>

            <el-row style="padding-top: 6px">
              <el-text size="large" style="color: orange"> 推荐指数</el-text>
              <el-text size="large" style="padding-left: 20px">
                <el-rate
                  v-model="travelInfo.travelScore"
                  :disabled="true"
                ></el-rate>
              </el-text>
            </el-row>

            <el-row style="padding-top: 6px">
              <el-text size="large" style="color: orange"> 费用</el-text>
              <el-text size="large" style="padding-left: 50px"
                >{{ travelInfo.travelPrice }}
              </el-text>
            </el-row>

            <el-row style="padding-top: 6px">
              <el-text size="large" style="color: orange"> 剩余人数</el-text>
              <el-text size="large" style="padding-left: 20px"
                >{{ travelInfo.travelNumbers }}
              </el-text>
            </el-row>

            <el-row style="padding-top: 6px">
              <el-text size="large" style="color: orange"> 评价数</el-text>
              <el-text size="large" style="padding-left: 35px"
                >{{ travelInfo.travelCommentCount }}
              </el-text>
            </el-row>

            <el-row>
              <el-button>加入队伍</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="content">
      <el-card
        style="
          height: 100%;
          padding-bottom: 60px;
          display: flex;
          flex-direction: column;
        "
      >
        <el-tabs type="border-card" v-model="activeTabs" style="flex: 0 0 auto">
          <el-tab-pane label="旅游介绍" name="travel" style="height: 100%">
            <div
              style="height: 100%; overflow-y: auto"
              v-html="travelInfo.travelDescription"
            ></div>
          </el-tab-pane>
          <el-tab-pane label="出行须知" name="expense" style="height: 100%">
            <div style="height: 100%; overflow-y: auto">
              •
              为了您人身、财产的安全，请您避免在公开场合暴露贵重物品及大量现金。上街时需时刻看管好首饰、相机等随身物品。
              •游泳、漂流、潜水、滑雪、溜冰、戏雪、冲浪、探险、热气球、高山索道等活动项目，均存在危险。参与前请根据自身条件，并充分参考当地相关部门及其它专业机构的相关公告和建议后量力而行。
              •为确保锂电池的安全运输，避免发生不安全事件，我们友情提醒您，民航局将对旅客携带锂电池乘机进行严格检查。详情请参考
              民航局关于旅客行李中携带"锂电池、充电宝"乘机规定的公告。
              •乘坐国内航班的旅客，居民身份证过期不能继续使用。若有效期满的，可以凭临时居民身份证或公安机关出具的贴有本人近期免冠证件照、并加盖户籍专用章、注明有效期的《申领居民身份证回执》作为有效乘机身份证件替代使用。同时中华人民共和国护照可以作为有效乘机身份证件，办理国内航班购票、值机、安检手续；旅客乘坐国内航班，办理购票、值机、安检手续时，应当使用同一个有效乘机身份证件。中国大陆地区居民使用往来港澳通行证、往来台湾通行证乘坐国内航班的旅客，必须同时提供居民身份证或者民用机场公安机关签发的《乘坐民航飞机临时身份证明》才可办理登机手续。
              特别提醒：凡是乘机的16周岁以下中国大陆地区居民（包含婴儿），务必出示包括出生证明、户口薄或户口所在地公安机关出具的身份证明（16周岁以下的人需在户籍所在地派出所出具身份证明，机场派出所无法开具临时证明）才可办理登机手续。
              具体实施细则以机场相关部门指导意见为准。
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <div class="team">
      <el-card header="加入队伍">
        <el-row :gutter="40">
          <el-col :span="2" align="center">导游</el-col>
          <el-col :span="2" v-for="guide in guideList" :key="guide.userId">
            <el-avatar size="large" :src="guide.userAvatarUrl" />
            <span style="padding-left: 7px">{{ guide.userName }}</span></el-col
          >
        </el-row>
        <el-divider />
        <el-row :gutter="40" style="padding-top: 30px">
          <el-col :span="2" align="center">用户</el-col>
          <el-col :span="2" v-for="item in joinUserList" :key="item.userId">
            <el-avatar size="large" :src="item.userAvatarUrl" />
            <span style="padding-left: 7px">{{ item.userName }}</span>
          </el-col>
        </el-row>
        <el-row
          style="
            padding-top: 10px;
            float: right;
            padding-bottom: 20px;
            padding-right: 40px;
          "
        >
          <el-button type="primary">加入队伍</el-button>
        </el-row>
      </el-card>
    </div>

    <div class="comment">
      <el-card header="评论">
        <el-row
          :gutter="20"
          v-for="comment in commentList"
          :key="comment.commentId"
          style="padding-bottom: 30px; padding-left: 10px"
        >
          <el-col :span="2">
            <el-avatar :src="comment.userAvatarUrl" size="large" />
            <div style="align-content: center; padding-left: 10px">
              {{ comment.userName }}
            </div>
          </el-col>
          <el-col :span="1" />
          <el-col :span="18">
            <el-row>
              <el-col :span="6">
                <el-rate
                  :disabled="true"
                  v-model="comment.commentScore"
                  size="large"
                ></el-rate>
              </el-col>

              <el-col :span="8" />
              <el-col :span="6">
                <div style="align-items: center; align-content: center">
                  {{ comment.commentTime }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <div v-html="comment.commentContent" />
            </el-row>
            <el-row style="padding-top: 10px">
              <el-image
                :src="comment.commentUrl"
                style="width: 150px; height: 150px"
                alt="图片加载失败"
                preview-src-list="0"
              />
            </el-row>
          </el-col>
        </el-row>
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
      </el-card>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const currentPage = ref(1);
const pageSize = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const pictureList = ref([
  {
    id: 1,
    url: "http://xm.visitxm.com/tpLineImagesUpload/c24a928d-cb6a-4f67-9819-4928eba02ec5.jpg",
  },
  {
    id: 2,
    url: "http://xm.visitxm.com/tpLineImagesUpload/30139b16-0fef-41c8-8f1a-f9789b241491.jpg",
  },
  {
    id: 3,
    url: "http://www.visitxm.com/tpLineImagesUpload/2f2401e3-36c7-40c9-881c-0147ffa096ce.jpg",
  },
  {
    id: 4,
    url: "http://xm.visitxm.com/tpLineImagesUpload/44ec3cb0-652a-4c0e-a76c-f64e9ba66bf7.jpg",
  },
]);

const travelParamsId = useRoute().params.id;
const travelInfo = ref({
  travelId: travelParamsId,
  travelTitle: "test",
  travelNumbers: 10,
  travelDescription: "hhh",
  travelPrice: 123,
  travelType: "团队游",
  beginTime: "2023/12/12",
  travelCity: "北京",
  travelScore: 4.5,
  travelCommentCount: 100,
});

const joinUserInfo = ref({
  userId: "",
  userAvatarUrl: "",
  userName: "",
  userJoinTime: "",
});
// 加入队伍的信息
const joinUserList = ref([
  {
    userId: 1,
    userAvatarUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/2aee40c1-1c8b-4039-b7a5-c3ffd2eec9fd.jpg",
    userName: "test1",
    userJoinTime: "2023/12/11",
  },
  {
    userId: 2,
    userAvatarUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/2aee40c1-1c8b-4039-b7a5-c3ffd2eec9fd.jpg",
    userName: "test1",
    userJoinTime: "2023/12/11",
  },
  {
    userId: 3,
    userAvatarUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/2aee40c1-1c8b-4039-b7a5-c3ffd2eec9fd.jpg",
    userName: "test1",
    userJoinTime: "2023/12/11",
  },
  {
    userId: 4,
    userAvatarUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/2aee40c1-1c8b-4039-b7a5-c3ffd2eec9fd.jpg",
    userName: "test1",
    userJoinTime: "2023/12/11",
  },
]);
// 加入队伍导游的信息
const guideList = ref([
  {
    userId: 20,
    userAvatarUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/0846ea45-db4e-41a8-af65-af89c9a95792.jpg",
    userName: "导游1",
  },
  {
    userId: 30,
    userAvatarUrl:
      "http://xm.visitxm.com/tpLineImagesUpload/0846ea45-db4e-41a8-af65-af89c9a95792.jpg",
    userName: "导游2",
    userJoinTime: "",
  },
]);

const activeTabs = ref("travel");

const comment = ref({
  userId: "",
  userName: "",
  userAvatarUrl: "",
  commentId: "",
  commentContent: "",
  commentTime: "",
  commentUrl: "",
  commentScore: "",
});
//评论信息
const commentList = ref([
  {
    commentId: 1,
    userId: 1,
    userName: "测试asdasasd",
    userAvatarUrl:
      "https://dimg04.c-ctrip.com/images/0EQ1612000ccjhxt562AB_C_360_360_Q70.jpg",
    commentContent: "好好好",
    commentTime: "2023/12/11",
    commentUrl:
      "https://dimg04.c-ctrip.com/images/0EQ1612000ccjhxt562AB_C_360_360_Q70.jpg",
    commentScore: 4.5,
  },
  {
    commentId: 2,
    userId: 2,
    userName: "测试",
    userAvatarUrl:
      "https://dimg04.c-ctrip.com/images/0EQ1612000ccjhxt562AB_C_360_360_Q70.jpg",
    commentContent: "非常不好",
    commentTime: "2023/12/11",
    commentUrl:
      "https://dimg04.c-ctrip.com/images/0EQ1612000ccjhxt562AB_C_360_360_Q70.jpg",
    commentScore: 1,
  },
]);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<style scoped lang="css">
.header {
  padding-left: 100px;
  padding-right: 100px;
}

.content {
  padding-left: 100px;
  padding-right: 100px;
  height: calc(100vh - 200px);
}

.team {
  padding-left: 100px;
  padding-right: 100px;
}

.comment {
  padding-left: 100px;
  padding-right: 100px;
}
</style>
