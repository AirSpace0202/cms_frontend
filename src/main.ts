import { createApp } from "vue";
import App from "./App.vue";
import * as VueRouter from "vue-router";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import routes from "./config/route.ts";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, // 路由配置数组，定义各个路由的路径和对应组件
});

createApp(App).use(Antd).use(router).mount("#app");
