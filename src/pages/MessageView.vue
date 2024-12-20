<template>
  <div class="message-list">
    <h2>消息列表</h2>

    <!-- 表格区域 -->
    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      row-key="id"
    >
      <template #createTime="{ text }">
        {{ formatDate(text) }}
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import myAxios from "@/plugins/myAxios";

interface SearchParams {
  current: number;
  pageSize: number;
}

export default defineComponent({
  name: "MessageView",
  setup() {
    const loading = ref(false);
    const tableData = ref([]);
    const searchParams = ref<SearchParams>({
      current: 1,
      pageSize: 10,
    });

    const pagination = ref({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 条`,
    });

    const columns = [
      {
        title: "消息编号",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "客户编号",
        dataIndex: "custId",
        key: "custId",
      },
      {
        title: "消息内容",
        dataIndex: "msgContent",
        key: "msgContent",
        ellipsis: true,
      },
      {
        title: "发布时间",
        dataIndex: "createTime",
        key: "createTime",
        slots: { customRender: "createTime" },
      },
    ];

    const loadData = async () => {
      loading.value = true;
      try {
        const params = { ...searchParams.value };
        (Object.keys(params) as Array<keyof typeof params>).forEach((key) => {
          if (params[key] === undefined || params[key] === null) {
            delete params[key];
          }
        });

        const response = await myAxios.get("/msg/list/page", { params });
        if (response.data) {
          tableData.value = response.data.records;
          pagination.value.total = response.data.total;
          pagination.value.current = response.data.current;
          pagination.value.pageSize = response.data.size;
        }
      } catch (error) {
        message.error("获取消息列表失败");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const handleTableChange = (pag: { current: number; pageSize: number }) => {
      searchParams.value.current = pag.current;
      searchParams.value.pageSize = pag.pageSize;
      loadData();
    };

    const formatDate = (date: string) => {
      if (!date) return "";
      return new Date(date).toLocaleString();
    };

    onMounted(() => {
      loadData();
    });

    return {
      loading,
      columns,
      tableData,
      searchParams,
      pagination,
      handleTableChange,
      formatDate,
    };
  },
});
</script>

<style scoped>
.message-list {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #1890ff;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-table-pagination.ant-pagination) {
  margin: 16px 0;
}
</style>
