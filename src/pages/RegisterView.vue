<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h2 class="login-title">用户注册</h2>
        <a-card :bordered="false" class="login-card">
          <a-form
            :model="registerForm"
            @finish="handleSubmit"
            class="login-form"
          >
            <a-form-item
              name="userAccount"
              :rules="[{ required: true, message: '请输入账号' }]"
            >
              <a-input
                v-model:value="registerForm.userAccount"
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
                v-model:value="registerForm.userPassword"
                size="large"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item
              name="checkPassword"
              :rules="[
                { required: true, message: '请确认密码' },
                { validator: validatePassword },
              ]"
            >
              <a-input-password
                v-model:value="registerForm.checkPassword"
                size="large"
                placeholder="请确认密码"
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
                注册
              </a-button>
            </a-form-item>

            <div class="register-link">
              <router-link to="/login">已有账号？返回登录</router-link>
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

interface RegisterForm {
  userAccount: string;
  userPassword: string;
  checkPassword: string;
}

export default defineComponent({
  name: "RegisterView",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const registerForm = ref<RegisterForm>({
      userAccount: "",
      userPassword: "",
      checkPassword: "",
    });

    const validatePassword = async (_rule: any, value: string) => {
      if (value && value !== registerForm.value.userPassword) {
        return Promise.reject("两次输入的密码不一致");
      }
      return Promise.resolve();
    };

    const handleSubmit = async (values: RegisterForm) => {
      loading.value = true;
      try {
        const response = await myAxios.post("/user/register", {
          userAccount: values.userAccount,
          userPassword: values.userPassword,
          checkPassword: values.checkPassword,
        });

        if (response) {
          message.success("注册成功");
          await router.push("/login");
        } else {
          message.error("注册失败");
        }
      } catch (error) {
        message.error("注册请求失败");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    return {
      registerForm,
      loading,
      handleSubmit,
      validatePassword,
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

:deep(.site-form-item-icon) {
  color: rgba(0, 0, 0, 0.45);
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
</style>
