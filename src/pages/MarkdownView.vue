<template>
  <div class="markdown-editor">
    <h2>Markdown 编辑器</h2>
    <div class="toolbar">
      <a-button-group>
        <a-tooltip title="粗体">
          <a-button @click="insertText('**', '**')">
            <BoldOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="斜体">
          <a-button @click="insertText('*', '*')">
            <ItalicOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="删除线">
          <a-button @click="insertText('~~', '~~')">
            <StrikethroughOutlined />
          </a-button>
        </a-tooltip>
      </a-button-group>

      <a-button-group>
        <a-tooltip title="标题">
          <a-button @click="insertText('# ')">
            <FontSizeOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="引用">
          <a-button @click="insertText('> ')">
            <AlignLeftOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="代码块">
          <a-button @click="insertText('```\n', '\n```')">
            <CodeOutlined />
          </a-button>
        </a-tooltip>
      </a-button-group>

      <a-button-group>
        <a-tooltip title="无序列表">
          <a-button @click="insertText('- ')">
            <UnorderedListOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="有序列表">
          <a-button @click="insertText('1. ')">
            <OrderedListOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="任务列表">
          <a-button @click="insertText('- [ ] ')">
            <CheckSquareOutlined />
          </a-button>
        </a-tooltip>
      </a-button-group>

      <a-button-group>
        <a-tooltip title="链接">
          <a-button @click="insertText('[', '](url)')">
            <LinkOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="图片">
          <a-button @click="insertText('![alt](', ')')">
            <PictureOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="表格">
          <a-button @click="insertTable">
            <TableOutlined />
          </a-button>
        </a-tooltip>
      </a-button-group>
    </div>

    <div class="editor-container">
      <div class="edit-area">
        <a-textarea
          ref="textAreaRef"
          v-model:value="markdownContent"
          :rows="20"
          placeholder="请输入 Markdown 内容..."
          @input="handleInput"
        />
      </div>
      <div class="preview-area">
        <div class="preview-content" v-html="htmlContent"></div>
      </div>
    </div>

    <div class="status-bar">
      <span>字数: {{ wordCount }}</span>
      <div class="status-right">
        <a-switch
          v-model:checked="syncScroll"
          checked-children="同步滚动"
          un-checked-children="独立滚动"
        />
        <a-button type="primary" @click="saveToLocal">
          <template #icon>
            <SaveOutlined />
          </template>
          保存到本地
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  FontSizeOutlined,
  AlignLeftOutlined,
  CodeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  name: "MarkdownView",
  components: {
    BoldOutlined,
    ItalicOutlined,
    StrikethroughOutlined,
    FontSizeOutlined,
    AlignLeftOutlined,
    CodeOutlined,
    UnorderedListOutlined,
    OrderedListOutlined,
    CheckSquareOutlined,
    LinkOutlined,
    PictureOutlined,
    TableOutlined,
    SaveOutlined,
  },
  setup() {
    const markdownContent = ref("");
    const htmlContent = ref("");
    const textAreaRef = ref();
    const syncScroll = ref(true);
    const wordCount = ref(0);

    const handleInput = async () => {
      htmlContent.value = DOMPurify.sanitize(
        await marked.parse(markdownContent.value)
      );
      wordCount.value = markdownContent.value.length;
    };

    const insertText = (prefix: string, suffix = "") => {
      const textarea = textAreaRef.value?.$el.querySelector("textarea");
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = markdownContent.value;
      const selection = text.substring(start, end);

      markdownContent.value =
        text.substring(0, start) +
        prefix +
        selection +
        suffix +
        text.substring(end);

      // 恢复光标位置
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    };

    const insertTable = () => {
      const table =
        "\n| 标题1 | 标题2 | 标题3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |\n";
      insertText(table);
    };

    // 同步滚动处理
    const handleScroll = (e: Event) => {
      if (!syncScroll.value) return;
      const textarea = e.target as HTMLTextAreaElement;
      const preview = document.querySelector(".preview-area");
      if (!preview) return;

      const percentage =
        textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
      preview.scrollTop =
        percentage * (preview.scrollHeight - preview.clientHeight);
    };

    onMounted(() => {
      const textarea = textAreaRef.value?.$el.querySelector("textarea");
      if (textarea) {
        textarea.addEventListener("scroll", handleScroll);
      }
    });

    watch(markdownContent, handleInput, { immediate: true });

    // 保存到本地
    const saveToLocal = () => {
      try {
        // 创建 Blob 对象
        const blob = new Blob([markdownContent.value], {
          type: "text/markdown",
        });
        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        // 创建临时 a 标签
        const link = document.createElement("a");
        link.href = url;
        // 设置文件名，默认为当前时间
        const fileName = `markdown_${new Date().toISOString().slice(0, 10)}.md`;
        link.download = fileName;
        // 触发点击
        document.body.appendChild(link);
        link.click();
        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("保存文件失败:", error);
      }
    };

    return {
      markdownContent,
      htmlContent,
      textAreaRef,
      syncScroll,
      wordCount,
      handleInput,
      insertText,
      insertTable,
      saveToLocal,
    };
  },
});
</script>

<style scoped>
.markdown-editor {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
}

h2 {
  margin-bottom: 20px;
  color: #1890ff;
}

.toolbar {
  margin-bottom: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px;
  background: #fafafa;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.editor-container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 0;
}

.edit-area,
.preview-area {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 16px;
  overflow-y: auto;
}

.preview-area {
  background: #fafafa;
}

.status-bar {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

:deep(.ant-btn) {
  display: flex;
  align-items: center;
}

:deep(.anticon) {
  margin-right: 4px;
}

:deep(.preview-content) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

:deep(.preview-content h1) {
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

:deep(.preview-content pre) {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
}

:deep(.preview-content code) {
  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
}

:deep(.preview-content blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0;
}

:deep(.preview-content table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

:deep(.preview-content th),
:deep(.preview-content td) {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

:deep(.preview-content tr:nth-child(2n)) {
  background-color: #f6f8fa;
}
</style>
