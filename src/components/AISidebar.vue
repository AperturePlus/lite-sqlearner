<template>
  <div class="ai-sidebar-wrapper">
    <!-- 触发按钮 - 悬浮在右侧 -->
    <div 
      class="ai-trigger-btn" 
      @click="toggleSidebar" 
      :class="{ active: visible }"
      v-show="!visible"
    >
      <robot-outlined />
      <span class="btn-text">AI助手</span>
    </div>

    <!-- 侧边栏抽屉 -->
    <a-drawer
      v-model:visible="visible"
      title="🤖 AI 助手"
      placement="right"
      :width="420"
      :headerStyle="{ background: 'var(--header-bg)', borderBottom: '1px solid var(--border-color)' }"
      :bodyStyle="{ padding: 0, background: 'var(--bg-color)', height: '100%' }"
      :contentWrapperStyle="{ boxShadow: '-4px 0 16px rgba(0,0,0,0.1)' }"
      getContainer="body"
    >
      <template #extra>
        <a-button type="link" size="small" @click="openConfig">
          <setting-outlined /> 设置
        </a-button>
      </template>

      <div v-if="!hasConfig" class="no-config">
        <div class="no-config-content">
          <robot-outlined class="no-config-icon" />
          <h3>未配置 AI 助手</h3>
          <p>需要配置 API Key 才能使用 AI 助手功能</p>
          <a-button type="primary" size="large" @click="openConfig">
            立即配置
          </a-button>
        </div>
      </div>

      <div v-else class="chat-container">
        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-chat">
            <bulb-outlined class="empty-icon" />
            <p>有什么 SQL 问题需要帮助吗？</p>
            <p class="hint">点击下方快捷按钮或直接输入问题</p>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', `message-${msg.role}`]"
          >
            <div class="message-avatar">
              <user-outlined v-if="msg.role === 'user'" />
              <robot-outlined v-else />
            </div>
            <div class="message-content">
              <md-viewer :value="msg.content" />
            </div>
          </div>

          <div v-if="loading" class="message message-assistant">
            <div class="message-avatar">
              <robot-outlined />
            </div>
            <div class="message-content">
              <md-viewer :value="streamingContent || '思考中...'" />
              <span class="cursor-blink">▋</span>
            </div>
          </div>
        </div>

        <!-- 快捷提示 -->
        <div class="quick-actions">
          <a-button
            size="small"
            @click="handleQuickPrompt('请解释一下当前题目的要求')"
          >
            📖 解释题目
          </a-button>
          <a-button
            size="small"
            @click="handleQuickPrompt('请帮我分析一下这个 SQL 语句：\n```sql\n' + currentSQL + '\n```')"
            :disabled="!currentSQL"
          >
            🔍 分析SQL
          </a-button>
          <a-button
            size="small"
            @click="handleQuickPrompt('这个题目应该怎么写 SQL？请给我一些提示，不要直接给出答案')"
          >
            💡 获取提示
          </a-button>
          <a-button
            size="small"
            danger
            @click="handleClear"
            :disabled="messages.length === 0"
          >
            🗑️ 清空
          </a-button>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <a-textarea
            v-model:value="inputText"
            placeholder="输入你的问题..."
            :auto-size="{ minRows: 2, maxRows: 4 }"
            @keydown.enter.ctrl="handleSend"
          />
          <a-button
            type="primary"
            class="send-btn"
            @click="handleSend"
            :loading="loading"
            :disabled="!inputText.trim()"
          >
            发送
          </a-button>
          <div class="input-hint">按 Ctrl+Enter 发送</div>
        </div>
      </div>
    </a-drawer>

    <!-- AI 配置弹窗 -->
    <AIConfigModal v-model:visible="configModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from "vue";
import { message } from "ant-design-vue";
import {
  RobotOutlined,
  SettingOutlined,
  UserOutlined,
  BulbOutlined,
} from "@ant-design/icons-vue";
import { useGlobalStore } from "../core/globalStore";
import { createAIClient } from "../core/aiClient";
import { AIMessage } from "../core/ai.d";
import MdViewer from "./MdViewer.vue";
import AIConfigModal from "./AIConfigModal.vue";

const globalStore = useGlobalStore();

// 侧边栏状态
const visible = ref(false);
const configModalVisible = ref(false);

// 消息状态
const messages = ref<AIMessage[]>([]);
const inputText = ref("");
const loading = ref(false);
const streamingContent = ref("");
const messagesContainer = ref<HTMLElement | null>(null);

// 当前 SQL 和题目内容
const currentSQL = ref("");
const questionContent = ref("");

// 是否已配置
const hasConfig = computed(() => {
  return globalStore.aiConfig && globalStore.aiConfig.apiKey;
});

// 切换侧边栏
const toggleSidebar = () => {
  console.log("Toggle sidebar clicked, current visible:", visible.value);
  visible.value = !visible.value;
};

// 打开配置
const openConfig = () => {
  configModalVisible.value = true;
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 构建系统提示
const getSystemPrompt = () => {
  let prompt = "你是一个 SQL 学习助手，专门帮助用户学习和理解 SQL。使用简洁明了的语言回答问题，适当使用代码示例。";

  if (questionContent.value) {
    prompt += `\n\n当前题目内容：\n${questionContent.value}`;
  }

  if (currentSQL.value) {
    prompt += `\n\n用户当前编写的 SQL：\n\`\`\`sql\n${currentSQL.value}\n\`\`\``;
  }

  return prompt;
};

// 快捷提示
const handleQuickPrompt = (prompt: string) => {
  inputText.value = prompt;
  handleSend();
};

// 发送消息
const handleSend = async () => {
  if (!inputText.value.trim() || loading.value) {
    return;
  }

  if (!hasConfig.value) {
    message.warning("请先配置 AI 助手");
    openConfig();
    return;
  }

  const userMessage: AIMessage = {
    role: "user",
    content: inputText.value.trim(),
  };

  messages.value.push(userMessage);
  inputText.value = "";
  loading.value = true;
  streamingContent.value = "";
  scrollToBottom();

  try {
    const client = createAIClient(globalStore.aiConfig!);

    const allMessages: AIMessage[] = [
      { role: "system", content: getSystemPrompt() },
      ...messages.value,
    ];

    const response = await client.chat(allMessages, (chunk) => {
      streamingContent.value += chunk;
      scrollToBottom();
    });

    if (response.success) {
      messages.value.push({
        role: "assistant",
        content: response.content,
      });
    } else {
      message.error(response.error || "AI 调用失败");
      messages.value.pop();
    }
  } catch (error: any) {
    message.error("发送失败：" + error.message);
    messages.value.pop();
  } finally {
    loading.value = false;
    streamingContent.value = "";
    scrollToBottom();
  }
};

// 清空对话
const handleClear = () => {
  messages.value = [];
  streamingContent.value = "";
};

// 监听外部事件更新上下文
const handleUpdateContext = (event: CustomEvent) => {
  if (event.detail) {
    currentSQL.value = event.detail.sql || "";
    questionContent.value = event.detail.content || "";
  }
};

// 监听打开侧边栏事件
const handleOpenSidebar = () => {
  visible.value = true;
};

onMounted(() => {
  window.addEventListener("updateAIContext", handleUpdateContext as EventListener);
  window.addEventListener("openAISidebar", handleOpenSidebar);
});

onUnmounted(() => {
  window.removeEventListener("updateAIContext", handleUpdateContext as EventListener);
  window.removeEventListener("openAISidebar", handleOpenSidebar);
});
</script>

<style scoped>
.ai-trigger-btn {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 8px;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  writing-mode: vertical-rl;
}

.ai-trigger-btn:hover {
  padding-right: 12px;
  box-shadow: -4px 4px 12px rgba(0, 0, 0, 0.2);
}

.ai-trigger-btn.active {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.ai-trigger-btn .btn-text {
  font-size: 12px;
  letter-spacing: 2px;
}

.no-config {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-config-content {
  text-align: center;
  padding: 40px;
}

.no-config-icon {
  font-size: 64px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.no-config-content h3 {
  margin-bottom: 8px;
  color: var(--text-color);
}

.no-config-content p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 55px);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-chat {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #faad14;
}

.empty-chat p {
  margin-bottom: 8px;
}

.empty-chat .hint {
  font-size: 12px;
  opacity: 0.7;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.message-user .message-avatar {
  background: var(--link-color);
  color: white;
}

.message-assistant .message-avatar {
  background: var(--component-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.message-content {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
  overflow-x: auto;
}

.message-assistant .message-content {
  background: var(--component-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.message-user .message-content {
  background: var(--link-color);
  color: white;
}

.cursor-blink {
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.quick-actions {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.input-area {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-color);
}

.send-btn {
  margin-top: 8px;
  width: 100%;
}

.input-hint {
  text-align: right;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}
</style>
