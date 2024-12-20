import axios, { AxiosInstance } from "axios";
import { message } from "ant-design-vue";

const isDev = process.env.NODE_ENV === "development";

const myAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:9999/api",
});

myAxios.defaults.withCredentials = true;

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    console.log("发起请求");
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

myAxios.interceptors.response.use(function (response) {
  console.log("响应请求，状态码：", response.data.code);

  // 未登录
  if (response.data.code === 40000) {
    message.error("请先登录");
    window.location.href = "/login";
    return Promise.reject(response.data);
  }
  return response.data;
});

export default myAxios;
