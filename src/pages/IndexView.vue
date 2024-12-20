<template>
  <div class="index">
    <h1>欢迎使用客户管理系统</h1>
    <div class="content">
      <a-card class="intro-card">
        <template #title>
          <span class="card-title">
            <InfoCircleOutlined />
            系统介绍
          </span>
        </template>
        <p>本系统是一个智能的客户管理系统，主要功能包括：</p>
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-card class="feature-card">
              <template #title>
                <TeamOutlined />
                客户管理
              </template>
              <ul>
                <li>客户信息录入与维护</li>
                <li>客户分类管理</li>
                <li>客户联系方式</li>
              </ul>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card class="feature-card">
              <template #title>
                <ShoppingOutlined />
                订单管理
              </template>
              <ul>
                <li>订单创建与跟踪</li>
                <li>订单状态管理</li>
                <li>支付方式管理</li>
              </ul>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card class="feature-card">
              <template #title>
                <FileMarkdownOutlined />
                Markdown 编辑器
              </template>
              <ul>
                <li>实时预览功能</li>
                <li>快捷工具栏</li>
                <li>同步滚动支持</li>
                <li>字数统计功能</li>
              </ul>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card class="feature-card">
              <template #title>
                <BellOutlined />
                消息通知
              </template>
              <ul>
                <li>消息列表展示</li>
                <li>分页查询功能</li>
                <li>时间格式化显示（待办）</li>
                <li>消息内容自动省略（待办）</li>
                <li>更多功能正在添加中...</li>
              </ul>
            </a-card>
          </a-col>
        </a-row>
      </a-card>

      <a-card class="contact-card" style="margin-top: 20px">
        <template #title>
          <span class="card-title">
            <PhoneOutlined />
            联系我
          </span>
        </template>
        <p>如果在使用过程中遇到问题，请联系你轩哥：</p>
        <p>QQ： 2908912319</p>
        <p>电话：15107066778</p>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  InfoCircleOutlined,
  TeamOutlined,
  ShoppingOutlined,
  PhoneOutlined,
  FileMarkdownOutlined,
  BellOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  name: "IndexView",
  components: {
    InfoCircleOutlined,
    TeamOutlined,
    ShoppingOutlined,
    PhoneOutlined,
    FileMarkdownOutlined,
    BellOutlined,
  },
});
</script>

<style scoped>
.index {
  padding: 24px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  color: #1890ff;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.intro-card {
  margin-bottom: 24px;
}

.feature-card {
  height: 100%;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
}

.contact-card {
  background: #f8f8f8;
}
</style>
