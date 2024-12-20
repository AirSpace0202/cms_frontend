<template>
  <div class="order">
    <h2>订单信息列表</h2>

    <!-- 搜索模块 -->
    <div class="search-area">
      <div class="operation-area">
        <a-button type="primary" @click="showAddModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新建订单
        </a-button>
      </div>
      <a-form layout="inline">
        <a-form-item label="客户编号">
          <a-input-number
            v-model:value="searchParams.custId"
            placeholder="请输入客户编号"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="商品名">
          <a-input
            v-model:value="searchParams.product"
            placeholder="请输入商品名"
            allowClear
          />
        </a-form-item>
        <a-form-item label="订单金额">
          <a-input-number
            v-model:value="searchParams.totalNum"
            placeholder="请输入订单金额"
            :precision="2"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="订单状态">
          <a-select
            v-model:value="searchParams.status"
            placeholder="请选择订单状态"
            allowClear
            style="width: 200px"
          >
            <a-select-option :value="0">未完成</a-select-option>
            <a-select-option :value="1">已完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="支付方式">
          <a-select
            v-model:value="searchParams.method"
            placeholder="请选择支付方式"
            allowClear
            style="width: 200px"
          >
            <a-select-option :value="0">支付宝</a-select-option>
            <a-select-option :value="1">微信</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="doSearch">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
            <a-button @click="resetSearch">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <!-- 表格区域 -->
    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      row-key="id"
    >
      <template #status="{ text }">
        <a-tag :color="getStatusColor(text)">
          {{ getStatusText(text) }}
        </a-tag>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-button type="link" @click="handleEdit(record)">
            <template #icon>
              <EditOutlined />
            </template>
            修改
          </a-button>
          <a-popconfirm
            title="确定要删除这条订单吗？"
            @confirm="handleDelete(record)"
          >
            <a-button type="link" danger>
              <template #icon>
                <DeleteOutlined />
              </template>
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <!-- 编辑模态框 -->
    <a-modal
      :visible="editModalVisible"
      @update:visible="(val: boolean) => editModalVisible = val"
      title="编辑订单"
      @ok="handleEditSubmit"
      @cancel="() => (editModalVisible = false)"
    >
      <a-form
        :model="editForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="客户编号">
          <a-input v-model:value="editForm.custId" />
        </a-form-item>
        <a-form-item label="商品名">
          <a-input v-model:value="editForm.product" />
        </a-form-item>
        <a-form-item label="订单金额">
          <a-input-number v-model:value="editForm.totalNum" :min="0" />
        </a-form-item>
        <a-form-item label="订单状态">
          <a-select v-model:value="editForm.status">
            <a-select-option :value="0">未完成</a-select-option>
            <a-select-option :value="1">已完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="支付方式">
          <a-select v-model:value="editForm.method">
            <a-select-option :value="0">支付宝</a-select-option>
            <a-select-option :value="1">微信</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 新建订单模态框 -->
    <a-modal
      :visible="addModalVisible"
      @update:visible="(val: boolean) => addModalVisible = val"
      title="新建订单"
      @ok="handleAdd"
      @cancel="() => (addModalVisible = false)"
    >
      <a-form
        :model="addForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="客户编号" required>
          <a-input-number
            v-model:value="addForm.custId"
            placeholder="请输入客户编号"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="商品名" required>
          <a-input v-model:value="addForm.product" placeholder="请输入商品名" />
        </a-form-item>
        <a-form-item label="订单金额" required>
          <a-input-number
            v-model:value="addForm.totalNum"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="订单状态">
          <a-select v-model:value="addForm.status">
            <a-select-option :value="0">未完成</a-select-option>
            <a-select-option :value="1">已完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="支付方式">
          <a-select v-model:value="addForm.method">
            <a-select-option :value="0">支付宝</a-select-option>
            <a-select-option :value="1">微信</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import myAxios from "@/plugins/myAxios";
import dayjs from "dayjs";

interface SearchParams {
  current: number;
  pageSize: number;
  custId?: number;
  product?: string;
  totalNum?: number;
  status?: number;
  method?: number;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

interface OrderForm {
  id: number;
  custId: number;
  product: string;
  totalNum: number;
  status: number;
  method: number;
}

interface AddForm {
  custId: number;
  product: string;
  totalNum: number;
  status: number;
  method: number;
}

export default defineComponent({
  name: "OrderView",
  components: {
    SearchOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
  setup() {
    const columns = [
      {
        title: "订单编号",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "客户编号",
        dataIndex: "custId",
        key: "custId",
      },
      {
        title: "商品名",
        dataIndex: "product",
        key: "product",
      },
      {
        title: "订单金额",
        dataIndex: "totalNum",
        key: "totalNum",
        customRender: ({ text }: { text: number }) => `￥${text.toFixed(2)}`,
      },
      {
        title: "订单状态",
        dataIndex: "status",
        key: "status",
        slots: { customRender: "status" },
      },
      {
        title: "支付方式",
        dataIndex: "method",
        key: "method",
        customRender: ({ text }: { text: number }) =>
          text === 0 ? "支付宝" : "微信",
      },
      {
        title: "完成时间",
        dataIndex: "createTime",
        key: "createTime",
        customRender: ({ text }: { text: string }) =>
          text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-",
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 150,
        slots: { customRender: "action" },
      },
    ];

    const loading = ref(false);
    const tableData = ref([]);
    const pagination = ref<Pagination>({
      current: 1,
      pageSize: 10,
      total: 0,
    });

    const searchParams = ref<SearchParams>({
      current: 1,
      pageSize: 10,
      custId: undefined,
      product: "",
      totalNum: undefined,
      status: undefined,
      method: undefined,
    });

    const editModalVisible = ref(false);
    const editForm = ref<OrderForm>({
      id: 0,
      custId: 0,
      product: "",
      totalNum: 0,
      status: 0,
      method: 0,
    });

    const addModalVisible = ref(false);
    const addForm = ref<AddForm>({
      custId: 0,
      product: "",
      totalNum: 0,
      status: 0,
      method: 0,
    });

    // 获取状态文字
    const getStatusText = (status: number) => {
      const statusMap: Record<number, string> = {
        0: "未完成",
        1: "已完成",
      };
      return statusMap[status] || "未知状态";
    };

    // 设置订单状态颜色
    const getStatusColor = (status: number) => {
      const colorMap: Record<number, string> = {
        0: "orange",
        1: "green",
      };
      return colorMap[status] || "default";
    };

    // 搜索方法
    const doSearch = async () => {
      loading.value = true;
      try {
        const params = { ...searchParams.value };
        (Object.keys(params) as Array<keyof typeof params>).forEach((key) => {
          if (params[key] === undefined || params[key] === "") {
            delete params[key];
          }
        });

        const response = await myAxios.post("/order/search", params);
        if (response.data) {
          tableData.value = response.data.records;
          pagination.value.total = response.data.total;
          message.success("搜索成功");
        }
      } catch (error) {
        message.error("搜索请求失败");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const resetSearch = () => {
      searchParams.value = {
        current: 1,
        pageSize: 10,
        custId: undefined,
        product: "",
        totalNum: undefined,
        status: undefined,
        method: undefined,
      };
      loadData();
    };

    // 加载数据
    const loadData = async () => {
      loading.value = true;
      try {
        const response = await myAxios.get("/order/list/page", {
          params: {
            current: pagination.value.current,
            pageSize: pagination.value.pageSize,
          },
        });
        if (response.data) {
          tableData.value = response.data.records;
          pagination.value.total = response.data.total;
        }
      } catch (error) {
        message.error("获取数据失败");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const handleTableChange = (pag: any) => {
      pagination.value.current = pag.current;
      pagination.value.pageSize = pag.pageSize;
      loadData();
    };

    // 修改订单
    const handleEdit = (record: any) => {
      editForm.value = { ...record };
      editModalVisible.value = true;
    };

    const handleEditSubmit = async () => {
      try {
        const response = await myAxios.post("/order/update", editForm.value);
        if (response.data) {
          message.success("更新成功");
          editModalVisible.value = false;
          loadData();
        } else {
          message.error("更新失败");
        }
      } catch (error) {
        message.error("更新请求失败");
        console.error(error);
      }
    };

    // 删除订单
    const handleDelete = async (record: any) => {
      try {
        const response = await myAxios.post("/order/delete", {
          id: record.id,
        });
        if (response.data) {
          message.success("删除成功");
          loadData();
        } else {
          message.error("删除失败");
        }
      } catch (error) {
        message.error("删除请求失败");
        console.error(error);
      }
    };

    const showAddModal = () => {
      addModalVisible.value = true;
    };

    const handleAdd = async () => {
      if (
        !addForm.value.custId ||
        !addForm.value.product ||
        !addForm.value.totalNum
      ) {
        message.error("请填写必填项");
        return;
      }

      try {
        const response = await myAxios.post("/order/add", addForm.value);
        if (response.data) {
          message.success("创建成功");
          addModalVisible.value = false;
          addForm.value = {
            custId: 0,
            product: "",
            totalNum: 0,
            status: 0,
            method: 0,
          };
          loadData();
        } else {
          message.error("创建失败");
        }
      } catch (error) {
        message.error("创建请求失败");
        console.error(error);
      }
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
      doSearch,
      resetSearch,
      handleTableChange,
      handleEdit,
      handleEditSubmit,
      handleDelete,
      getStatusText,
      getStatusColor,
      editModalVisible,
      editForm,
      addModalVisible,
      addForm,
      showAddModal,
      handleAdd,
    };
  },
});
</script>

<style scoped>
.order {
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-table-pagination.ant-pagination) {
  margin: 16px 0;
}

.operation-area {
  margin-bottom: 16px;
}
</style>
