<template>
  <div class="profile-container">
    <a-card title="个人信息" :bordered="false">
      <a-descriptions :column="1">
        <a-descriptions-item label="用户名">
          {{ userInfo?.userName }}
        </a-descriptions-item>
        <a-descriptions-item label="用户账号">
          {{ userInfo?.userAccount }}
        </a-descriptions-item>
        <a-descriptions-item label="用户角色">
          {{ userInfo?.userRole === 1 ? "管理员" : "普通用户" }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ formatDate(userInfo?.createTime) }}
        </a-descriptions-item>
      </a-descriptions>

      <div class="avatar-section">
        <a-upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="/api/user/upload/avatar"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img
            v-if="userInfo?.avatarUrl"
            :src="userInfo.avatarUrl"
            alt="avatar"
          />
          <div v-else>
            <plus-outlined />
            <div style="margin-top: 8px">上传头像</div>
          </div>
        </a-upload>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";

export default defineComponent({
  name: "ProfileView",
  components: {
    PlusOutlined,
  },
  setup() {
    const userInfo = ref<UserType>();
    const fileList = ref([]);

    const getUserInfo = async () => {
      try {
        const res = await myAxios.get("/user/get/login");
        if (res) {
          userInfo.value = res.data;
        }
      } catch (error) {
        message.error("获取用户信息失败");
        console.error(error);
      }
    };

    const formatDate = (date: Date | undefined) => {
      if (!date) return "";
      return new Date(date).toLocaleString();
    };

    const beforeUpload = (file: File) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("只能上传 JPG/PNG 格式的图片!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("图片大小不能超过 2MB!");
      }
      return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
      if (info.file.status === "done") {
        if (info.file.response.code === 0) {
          userInfo.value!.avatarUrl = info.file.response.data;
          message.success("头像上传成功");
        } else {
          message.error(info.file.response.message || "上传失败");
        }
      }
    };

    onMounted(() => {
      getUserInfo();
    });

    return {
      userInfo,
      fileList,
      formatDate,
      beforeUpload,
      handleChange,
    };
  },
});
</script>

<style scoped>
.profile-container {
  padding: 24px;
}

.avatar-section {
  margin-top: 24px;
  text-align: center;
}

:deep(.avatar-uploader .ant-upload) {
  width: 128px;
  height: 128px;
}

:deep(.ant-upload-select-picture-card img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
