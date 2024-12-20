<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h2 class="login-title">客户管理系统</h2>
        <a-card :bordered="false" class="login-card">
          <a-form :model="loginForm" @finish="handleSubmit" class="login-form">
            <a-form-item
              name="userAccount"
              :rules="[{ required: true, message: '请输入账号' }]"
            >
              <a-input
                v-model:value="loginForm.userAccount"
                size="large"
                placeholder="请输入账号"
              >
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              name="userPassword"
              :rules="[{ required: true, message: '请输入密码' }]"
            >
              <a-input-password
                v-model:value="loginForm.userPassword"
                size="large"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                :loading="loading"
                class="login-button"
                size="large"
                block
              >
                登录
              </a-button>
            </a-form-item>
            <div class="register-link">
              <router-link to="/register">没有账号？点击注册</router-link>
            </div>
          </a-form>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import myAxios from "@/plugins/myAxios";

interface LoginForm {
  userAccount: string;
  userPassword: string;
}

export default defineComponent({
  name: "LoginView",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const loginForm = ref<LoginForm>({
      userAccount: "",
      userPassword: "",
    });

    const handleSubmit = async (values: LoginForm) => {
      loading.value = true;
      try {
        const response = await myAxios.post("/user/login", values);
        if (response) {
          message.success("登录成功");
          await router.push("/index"); // 登录成功后跳转到首页
        }
      } catch (error) {
        message.error("登录失败");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    return {
      loginForm,
      loading,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  position: relative;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-box {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  color: white;
  font-size: 28px;
  margin-bottom: 30px;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.login-card {
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.login-form {
  padding: 20px 0;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 4px;
}

:deep(.ant-btn) {
  border-radius: 4px;
  height: 40px;
}

/* 添加图标样式 */
:deep(.site-form-item-icon) {
  color: rgba(0, 0, 0, 0.45);
}

/* 添加动画效果 */
.login-box {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 添加背景动画 */
.login-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(66, 133, 244, 0.3),
    rgba(219, 68, 55, 0.3),
    rgba(244, 180, 0, 0.3),
    rgba(15, 157, 88, 0.3)
  );
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.register-link {
  text-align: center;
  margin-top: 16px;
}

.register-link a {
  color: #1890ff;
  text-decoration: none;
}

.register-link a:hover {
  color: #40a9ff;
}
</style>
