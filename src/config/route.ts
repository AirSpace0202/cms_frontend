import { RouteRecordRaw } from "vue-router";
import HomeView from "@/pages/HomeView.vue";
import LoginView from "@/pages/LoginView.vue";
import RegisterView from "@/pages/RegisterView.vue";
import UserView from "@/pages/UserView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/",
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/about",
        name: "about",
        component: () =>
          import(/* webpackChunkName: "about" */ "@/pages/AboutView.vue"),
      },
      {
        path: "/user",
        name: "user",
        component: UserView,
      },
      {
        path: "/markdown",
        name: "markdown",
        component: () => import("@/pages/MarkdownView.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/message",
        name: "message",
        component: () => import("@/pages/MessageView.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/index",
    name: "index",
    component: () => import("@/pages/IndexView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

export default routes;
