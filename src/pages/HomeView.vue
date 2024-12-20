<template>
  <div class="home">
    <h2>客户信息列表</h2>

    <!-- 搜索模块 -->
    <div class="search-area">
      <a-form layout="inline">
        <a-form-item label="客户名称">
          <a-input
            v-model:value="searchParams.custName"
            placeholder="请输入客户名称"
            allowClear
          />
        </a-form-item>
        <a-form-item label="客户来源">
          <a-input
            v-model:value="searchParams.custSource"
            placeholder="请输入客户来源"
            allowClear
          />
        </a-form-item>
        <a-form-item label="客户行业">
          <a-input
            v-model:value="searchParams.custIndustry"
            placeholder="请输入客户行业"
            allowClear
          />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input
            v-model:value="searchParams.phone"
            placeholder="请输入联系电话"
            allowClear
          />
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

    <div class="operation-area">
      <a-button type="primary" @click="showAddModal">
        <template #icon>
          <PlusOutlined />
        </template>
        新建客户
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      row-key="id"
    >
      <template #action="{ record }">
        <a-space>
          <a-button type="link" @click="handleEdit(record)">
            <template #icon>
              <EditOutlined />
            </template>
            修改
          </a-button>
          <a-popconfirm
            title="确定要删除这条记录吗？"
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

    <!-- 编辑框模块 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑客户信息"
      @ok="handleEditSubmit"
      @cancel="handleEditCancel"
    >
      <a-form
        :model="editForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="客户名称">
          <a-input v-model:value="editForm.custName" />
        </a-form-item>
        <a-form-item label="客户来源">
          <a-input v-model:value="editForm.custSource" />
        </a-form-item>
        <a-form-item label="客户行业">
          <a-input v-model:value="editForm.custIndustry" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="editForm.phone" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-model:value="editForm.gender">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="0">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="客户级别">
          <a-select v-model:value="editForm.level">
            <a-select-option :value="0">普通客户</a-select-option>
            <a-select-option :value="1">VIP客户</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="addModalVisible"
      title="新建客户"
      @ok="handleAdd"
      @cancel="handleCancel"
    >
      <a-form
        :model="addForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="客户名称" required>
          <a-input
            v-model:value="addForm.custName"
            placeholder="请输入客户名称"
          />
        </a-form-item>
        <a-form-item label="客户来源">
          <a-input
            v-model:value="addForm.custSource"
            placeholder="请输入客户来源"
          />
        </a-form-item>
        <a-form-item label="客户行业">
          <a-input
            v-model:value="addForm.custIndustry"
            placeholder="请输入客户行业"
          />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="addForm.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-model:value="addForm.gender">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="0">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="客户级别">
          <a-select v-model:value="addForm.level">
            <a-select-option :value="0">普通客户</a-select-option>
            <a-select-option :value="1">VIP客户</a-select-option>
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

// 客户信息字段
interface CustomerForm {
  id?: number | null;
  custName: string;
  custSource: string;
  custIndustry: string;
  phone: string;
  gender: number;
  level: number;
}

interface SearchParams {
  custName: string;
  custSource: string;
  custIndustry: string;
  phone: string;
}

// 分页接口
interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

const pagination = ref<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0,
});

export default defineComponent({
  name: "HomeView",
  components: {
    SearchOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
  setup() {
    // 表格字段
    const columns = [
      {
        title: "客户编号",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "客户名称",
        dataIndex: "custName",
        key: "custName",
      },
      {
        title: "客户来源",
        dataIndex: "custSource",
        key: "custSource",
      },
      {
        title: "客户行业",
        dataIndex: "custIndustry",
        key: "custIndustry",
      },
      {
        title: "性别",
        dataIndex: "gender",
        key: "gender",
        customRender: ({ text }: { text: number }) =>
          text === 1 ? "男" : "女",
      },
      {
        title: "联系电话",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "客户级别",
        dataIndex: "level",
        key: "level",
        customRender: ({ text }: { text: number }) =>
          text === 0 ? "普通客户" : "VIP 客户",
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
    const addModalVisible = ref(false);

    // 搜索参数
    const searchParams = ref<SearchParams>({
      custName: "",
      custSource: "",
      custIndustry: "",
      phone: "",
    });

    // 添加参数
    const addForm = ref<CustomerForm>({
      custName: "",
      custSource: "",
      custIndustry: "",
      phone: "",
      gender: 1,
      level: 0,
    });

    const showAddModal = () => {
      addModalVisible.value = true;
    };

    // 搜索方法
    const doSearch = async () => {
      loading.value = true;
      try {
        const response = await myAxios.post(
          "/customer/search",
          searchParams.value
        );

        if (response.data) {
          tableData.value = response.data.records || [];
          message.success("搜索成功");
        } else {
          message.error("搜索失败");
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
        custName: "",
        custSource: "",
        custIndustry: "",
        phone: "",
      };
      loadData();
    };

    // 表单验证
    const validateForm = (form: CustomerForm): boolean => {
      if (!form.custName.trim()) {
        message.error("客户名称不能为空");
        return false;
      }
      if (!form.phone.trim()) {
        message.error("联系电话不能为空");
        return false;
      }
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(form.phone)) {
        message.error("请输入正确的手机号码");
        return false;
      }
      return true;
    };

    // 添加方法
    const handleAdd = async () => {
      if (!validateForm(addForm.value)) {
        return;
      }

      try {
        const response = await myAxios.post("/customer/add", addForm.value);

        if (response.data) {
          message.success("添加成功");
          addModalVisible.value = false;
          addForm.value = {
            custName: "",
            custSource: "",
            custIndustry: "",
            phone: "",
            gender: 1,
            level: 0,
          };
          loadData();
        } else {
          message.error("添加失败");
        }
      } catch (error) {
        message.error("添加请求失败");
        console.error(error);
      }
    };

    const handleCancel = () => {
      addModalVisible.value = false;
      resetForm(addForm.value);
    };

    // 加载数据，调用分页查询接口
    const loadData = async () => {
      loading.value = true;
      try {
        const response = await myAxios.get("/customer/list/page", {
          params: {
            current: pagination.value.current,
            pageSize: pagination.value.pageSize,
          },
        });
        if (response.data) {
          tableData.value = response.data.records;
          pagination.value.total = response.data.total;
        } else {
          // todo 显示详细错误信息
          message.error("获取数据失败");
        }
      } catch (error) {
        message.error("请求失败");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadData();
    });

    const editModalVisible = ref(false);
    const editForm = ref<CustomerForm>({
      id: null,
      custName: "",
      custSource: "",
      custIndustry: "",
      phone: "",
      gender: 1,
      level: 0,
    });

    const handleEdit = (record: any) => {
      editForm.value = { ...record }; // 复制当前记录到表单
      editModalVisible.value = true; // 显示编辑对话框
    };

    const handleEditSubmit = async () => {
      if (!validateForm(editForm.value)) {
        return;
      }

      try {
        const response = await myAxios.post("/customer/update", editForm.value);

        if (response.data) {
          message.success("更新成功");
          editModalVisible.value = false;
          loadData(); // 重新加载数据
        } else {
          message.error("更新失败");
        }
      } catch (error) {
        message.error("更新请求失败");
        console.error(error);
      }
    };

    const handleEditCancel = () => {
      editModalVisible.value = false;
      resetForm(editForm.value);
    };

    const handleDelete = async (record: any) => {
      try {
        const response = await myAxios.post("/customer/delete", {
          id: record.id,
        });

        if (response.data) {
          message.success("删除成功");
          loadData(); // 重新加载数据
        } else {
          message.error("删除失败");
        }
      } catch (error) {
        message.error("删除请求失败");
        console.error(error);
      }
    };

    const resetForm = (form: CustomerForm) => {
      form.custName = "";
      form.custSource = "";
      form.custIndustry = "";
      form.phone = "";
      form.gender = 1;
      form.level = 0;
      if ("id" in form) {
        form.id = null;
      }
    };

    const handleTableChange = (pag: any) => {
      pagination.value.current = pag.current;
      pagination.value.pageSize = pag.pageSize;
      loadData();
    };

    return {
      loading,
      tableData,
      searchParams,
      doSearch,
      resetSearch,
      columns,
      handleEdit,
      handleDelete,
      editModalVisible,
      editForm,
      handleEditSubmit,
      handleEditCancel,
      addModalVisible,
      addForm,
      showAddModal,
      handleAdd,
      handleCancel,
      pagination,
      handleTableChange,
    };
  },
});
</script>

<style scoped>
.home {
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
