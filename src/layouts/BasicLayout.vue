<template>
  <a-layout class="layout">
    <!-- 侧边导航栏 -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <home-outlined class="logo-icon" />
        <h1 class="logo-title" :class="{ 'logo-title-collapsed': collapsed }">
          客户管理系统
        </h1>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="0">
          <router-link to="/index">
            <HomeOutlined />
            <span>主页</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <AppstoreOutlined />
              <span>管理页</span>
            </span>
          </template>
          <a-menu-item key="1">
            <router-link to="/">
              <TeamOutlined />
              <span>客户管理</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/about">
              <ShoppingOutlined />
              <span>订单管理</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <EditOutlined />
              <span>编辑页</span>
            </span>
          </template>
          <a-menu-item key="3">
            <router-link to="/markdown">
              <FileMarkdownOutlined />
              <span>MD 编辑器</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <template #title>
            <span>
              <BellOutlined />
              <span>消息通知</span>
            </span>
          </template>
          <a-menu-item key="4">
            <router-link to="/message">
              <UnorderedListOutlined />
              <span>消息列表</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- 主要内容区域 -->
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="header-container">
          <div class="trigger-container">
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <menu-fold-outlined
              v-else
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
          </div>
          <div class="header-right">
            <a-dropdown>
              <div class="avatar-wrapper">
                <a-avatar
                  :src="
                    userInfo?.avatarUrl ||
                    'https://th.bing.com/th/id/OIP.cyb3bUpsGhfA102l8mI2_QHaHY?rs=1&pid=ImgDetMain'
                  "
                />
                <span class="username">{{ userInfo?.userName || "用户" }}</span>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="goToProfile">
                    <user-outlined />
                    个人中心
                  </a-menu-item>
                  <a-menu-item key="2">
                    <a href="https://github.com/AirSpace0202" target="_blank">
                      <github-outlined />
                      项目地址
                    </a>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="3" @click="handleLogout">
                    <logout-outlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  GithubOutlined,
  LogoutOutlined,
  HomeOutlined,
  TeamOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  EditOutlined,
  FileMarkdownOutlined,
  BellOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";

export default defineComponent({
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    GithubOutlined,
    LogoutOutlined,
    HomeOutlined,
    TeamOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    EditOutlined,
    FileMarkdownOutlined,
    BellOutlined,
    UnorderedListOutlined,
  },
  setup() {
    const router = useRouter();
    const collapsed = ref<boolean>(false);
    const selectedKeys = ref<string[]>(["1"]);
    const userInfo = ref<UserType>();

    // 获取用户信息
    const getUserInfo = async () => {
      try {
        const res = await myAxios.get("/user/get/login");
        if (res) {
          userInfo.value = res.data;
        }
      } catch (error) {
        console.error("获取用户信息失败", error);
      }
    };

    // 初始化页面时加载用户信息
    onMounted(() => {
      getUserInfo();
    });

    // 跳转到个人中心
    const goToProfile = () => {
      router.push("/user");
    };

    // 退出登录
    const handleLogout = async () => {
      try {
        const res = await myAxios.post("/user/logout");
        if (res) {
          message.success("退出成功");
          router.push("/login");
        }
      } catch (error) {
        message.error("退出失败");
        console.error(error);
      }
    };

    return {
      collapsed,
      selectedKeys,
      userInfo,
      goToProfile,
      handleLogout,
    };
  },
});
</script>

<style>
.layout {
  min-height: 100vh;
}

.logo {
  height: 32px;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logo-icon {
  font-size: 20px;
  color: #ffd700;
}

.logo-title {
  color: #ffd700;
  font-size: 16px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s;
}

.logo-title-collapsed {
  font-size: 0;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}

/* 添加全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.trigger-container {
  flex: 0 0 auto;
}

.header-right {
  flex: 0 0 auto;
  padding-right: 24px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 64px; /* 与header高度一致 */
}

.username {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-dropdown-menu-item) {
  min-width: 160px;
}

:deep(.ant-dropdown-menu-item a) {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-dropdown-menu-item .anticon) {
  margin-right: 8px;
}
</style>
