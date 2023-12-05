<template>
  <el-form
    ref="formRef"
    :model="form"
    label-width="100px"
    style="text-align: center; padding-bottom: 10px"
  >
    <el-upload
      :headers="headers"
      class="avatar-uploader"
      action="#"
      :auto-upload="false"
      list-type="picture-card"
      :http-request="uploadAvatar"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-change="handlePictureChange"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <el-button @click="handleConfirm">确认更换</el-button>
  </el-form>
</template>

<script setup>
import { defineProps, ref } from "vue";
import requestUtil, { getServerUrl } from "@/utils/request";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import store from "@/store";

const props = defineProps({
  user: {
    type: Object,
    default: () => {},
    required: true,
  },
});

const headers = ref({
  token: store.getters.GET_TOKEN,
});

const form = ref({
  userId: -1,
  userAvatar: "",
});

const formRef = ref(null);

const imageUrl = ref("");

form.value.userId = props.user.userId;
form.value.userAvatar = props.user.userAvatar;
const currentUser = store.getters.GET_USER_INFO;
imageUrl.value = currentUser.userAvatar;

const handleAvatarSuccess = (res) => {
  if (res.data.code === 0) {
    imageUrl.value = res.data.data; // 处理后端返回的图片URL
    form.value.userAvatar = imageUrl.value;
  } else {
    ElMessage.error("上传失败");
  }
};

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === "image/jpeg";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("图片必须是jpg格式");
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过2M!");
  }
  return isJPG && isLt2M;
};

const uploadUserAvatar = ref(null);
const handlePictureChange = (file, fileList) => {
  uploadUserAvatar.value = file;
};

const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file.raw);
  try {
    const response = await requestUtil.fileUpload("/picture/upload", formData);
    handleAvatarSuccess(response); // 在这里即时更新图片
  } catch (error) {
    console.error("上传失败", error);
    ElMessage.error("上传失败");
  }
};

// todo 文件上传
const handleConfirm = async () => {
  //await uploadAvatar(uploadUserAvatar.value);
  let result = await requestUtil.post("user/uploadAvatar", form.value);
  let data = result.data;
  if (data.code === 0) {
    ElMessage.success("执行成功！");
    store.commit("SET_USER_INFO", {
      ...store.getters.GET_USER_INFO,
      userAvatar: form.value.userAvatar,
    });
    window.location.reload();
  } else {
    ElMessage.error(data.msg);
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
