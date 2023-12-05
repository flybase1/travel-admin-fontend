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
          <el-form-item label=" 项目价格">
            <el-input type="number" v-model="form.travelPrice"></el-input>
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
        <div v-if="dialogVisible" style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            mode="default"
          />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="form.travelDescription"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleCreated"
          />
        </div>
      </el-form-item>

      <el-form-item label="封面图片">
        <el-upload
          class="avatar-uploader"
          action="#"
          :auto-upload="false"
          :show-file-list="true"
          :multiple="false"
          :headers="headers"
          :http-request="uploadPicture"
          :on-change="handlePictureChange"
          :on-success="handleAvatarSuccess"
          :on-remove="handlePictureRemove"
          :before-upload="handlePictureBeforeUpload"
          :on-exceed="handlePictureExceed"
          list-type="picture"
          limit="1"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="avatar"
            style="width: 200px; height: 200px"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleConfirmPostPicture">确认上传</el-button>
      </el-form-item>
      <!--多文件上传-->
      <el-form-item label="图片介绍">
        <el-upload
          :disabled="travelId === -1"
          v-model:file-list="pictureList"
          :headers="headers"
          action="#"
          :auto-upload="false"
          :show-file-list="true"
          list-type="picture-card"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-alert
          description="请创建项目之后再上传图片介绍"
          title="提示"
        ></el-alert>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleConfirmPostPictureList">确认上传</el-button>
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
import {
  defineEmits,
  defineProps,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from "vue";
import requestUtil from "@/utils/request";
import { ElMessage } from "element-plus";
import store from "@/store";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
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

const headers = ref({ token: store.getters.GET_TOKEN });

const form = ref({
  travelId: -1,
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
  coverPictureUrl: "",
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
const pictureList = ref([]);

const uploadTravelCover = ref(null);
const imageUrl = ref("");

const initFormData = async (id) => {
  const res = await requestUtil.get("/project/getTravel?travelId=" + id);
  //console.log(res.data);
  form.value = res.data.data;
  imageUrl.value = form.value.coverPictureUrl;
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
  async () => {
    let travelIdP = props.travelId;
    if (travelIdP !== -1) {
      await initFormData(travelIdP);
      // 获取图片
      const pictureRes = await requestUtil.get(
        "picture/getPicture?travelId=" + travelIdP
      );

      pictureList.value = pictureRes.data.data;
    } else {
      form.value = {
        travelId: -1,
        accountId: store.getters.GET_USER_INFO.accountId,
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
        coverPictureUrl: "",
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
      //console.log(form.value.accountId);
      if (form.value.travelId === -1) {
        form.value.coverPictureUrl = imageUrl.value;
        result = await requestUtil.post("/project/addTravel", form.value);
        if (result.data.code === 0) {
          ElMessage.success("添加成功！");
          formRef.value.resetFields();
          emits("initTravelList");
          handleClose();
        } else {
          ElMessage.error("添加失败");
        }
        console.log(result.data);
      } else {
        form.value.coverPictureUrl = imageUrl.value;
        result = await requestUtil.put("/project/updateTravel", form.value);
        if (result.data.code === 0) {
          ElMessage.success("修改成功！");
          formRef.value.resetFields();
          emits("initTravelList");
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
/**
 * 上传图片成功返回
 * @param response
 * @param file
 * @param fileList
 * @return {Promise<void>}
 */
const handleAvatarSuccess = async (response, file, fileList) => {
  console.log("ok");
  console.log(response);
  // imageUrl.value = response.data.data;
  // console.log(res.data);
};

const handlePictureChange = (file, fileList) => {
  uploadTravelCover.value = file;
  console.log("file:", file);
};

const uploadPicture = async (file) => {
  const formData = new FormData();
  formData.append("file", file.raw);
  try {
    const response = await requestUtil.fileUpload("/picture/upload", formData);
    if (response.data.code === 0) {
      imageUrl.value = response.data.data; // 处理后端返回的图片URL
      ElMessage.success("上传成功");
    } else {
      ElMessage.error("上传失败");
    }
  } catch (error) {
    console.error("上传失败", error);
    ElMessage.error("上传失败");
  }
};

// 移除图片
const handlePictureRemove = () => {
  form.value.coverPictureUrl = "";
};

// 文件类型
const fileType = ref(["png", "jpg", "bmp", "jpeg"]);

// 上传图片前需要校验是否符合规则
const handlePictureBeforeUpload = (file) => {
  if (file.type !== "" || file.type != null || file.type !== undefined) {
    //截取文件的后缀，判断文件类型
    const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //计算文件的大小
    const isLt5M = file.size / 1024 / 1024 < 50; //这里做文件大小限制
    //如果大于50M
    if (!isLt5M) {
      ElMessage.error("上传文件大小不能超过 50MB!");
      return false;
    }
    //如果文件类型不在允许上传的范围内
    if (fileType.value.includes(FileExt)) {
      return true;
    } else {
      this.$message.error("上传文件格式不正确!");
      return false;
    }
  }
};

const handlePictureExceed = (files, uploadFiles) => {};

// 上传图片按钮
const handleConfirmPostPicture = async () => {
  if (!uploadTravelCover.value || !uploadTravelCover.value.raw) {
    ElMessage.warning("请先选择图片");
    return;
  }
  await uploadPicture(uploadTravelCover.value);
};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<style lang="scss" scoped>
#editor—wrapper {
  border: 1px solid #ccc;
  z-index: 100; /* 按需定义 */
}

#toolbar-container {
  border-bottom: 1px solid #ccc;
}

#editor-container {
  height: 500px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
