<template>
  <div class="ai-sidebar-wrapper">
    <!-- 触发按钮 - 悬浮在右侧 -->
    <div
      v-show="!visible"
      class="ai-trigger-btn"
      :class="{ active: visible }"
      @click="toggleSidebar"
    >
      <robot-outlined />
      <span class="btn-text">{{ t("ai.sidebar.trigger") }}</span>
    </div>

    <!-- 侧边栏抽屉 -->
    <a-drawer
      v-model:visible="visible"
      :title="t('ai.sidebar.title')"
      placement="right"
      :width="420"
      :header-style="{
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--border-color)',
      }"
      :body-style="{
        padding: 0,
        background: 'var(--bg-color)',
        height: '100%',
      }"
      :content-wrapper-style="{ boxShadow: '-4px 0 16px rgba(0,0,0,0.1)' }"
      get-container="body"
    >
      <template #extra>
        <a-button type="link" size="small" @click="openConfig">
          <setting-outlined /> {{ t("ai.sidebar.settings") }}
        </a-button>
      </template>

      <div v-if="!hasConfig" class="no-config">
        <div class="no-config-content">
          <robot-outlined class="no-config-icon" />
          <h3>{{ t("ai.sidebar.noConfigTitle") }}</h3>
          <p>{{ t("ai.sidebar.noConfigDescription") }}</p>
          <a-button type="primary" size="large" @click="openConfig">
            {{ t("ai.sidebar.configNow") }}
          </a-button>
        </div>
      </div>

      <div v-else class="chat-container">
        <!-- 消息列表 -->
        <div ref="messagesContainer" class="messages-container">
          <div v-if="messages.length === 0" class="empty-chat">
            <bulb-outlined class="empty-icon" />
            <p>{{ t("ai.sidebar.emptyTitle") }}</p>
            <p class="hint">{{ t("ai.sidebar.emptyHint") }}</p>
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
              <!-- AI 回复中的 SQL 代码应用按钮 -->
              <div
                v-if="
                  msg.role === 'assistant' && extractSQLFromMessage(msg.content)
                "
                class="sql-actions"
              >
                <a-button
                  type="primary"
                  size="small"
                  @click="applySQLToEditor(extractSQLFromMessage(msg.content)!)"
                >
                  {{ t("ai.sidebar.applySql") }}
                </a-button>
              </div>
            </div>
          </div>

          <div v-if="loading" class="message message-assistant">
            <div class="message-avatar">
              <robot-outlined />
            </div>
            <div class="message-content">
              <md-viewer
                :value="streamingContent || t('ai.sidebar.thinking')"
              />
              <span class="cursor-blink">▋</span>
            </div>
          </div>
        </div>

        <!-- 快捷提示 -->
        <div class="quick-actions">
          <a-button
            size="small"
            @click="handleQuickPrompt(buildPrompt('explainQuestion'))"
          >
            {{ t("ai.sidebar.quickExplainQuestion") }}
          </a-button>
          <a-button
            size="small"
            :disabled="!currentSQL"
            @click="
              handleQuickPrompt(buildPrompt('analyzeSql', { sql: currentSQL }))
            "
          >
            {{ t("ai.sidebar.quickAnalyzeSql") }}
          </a-button>
          <a-button
            size="small"
            @click="handleQuickPrompt(buildPrompt('getHint'))"
          >
            {{ t("ai.sidebar.quickGetHint") }}
          </a-button>
          <a-button
            size="small"
            type="primary"
            danger
            :disabled="currentResultStatus !== 0"
            @click="handleQuickPrompt(buildPrompt('fixSql'))"
          >
            {{ t("ai.sidebar.quickFixSql") }}
          </a-button>
          <a-button
            size="small"
            :disabled="!currentErrorMsg"
            @click="
              handleQuickPrompt(
                buildPrompt('analyzeError', { error: currentErrorMsg })
              )
            "
          >
            {{ t("ai.sidebar.quickAnalyzeError") }}
          </a-button>
          <a-button
            size="small"
            danger
            :disabled="messages.length === 0"
            @click="handleClear"
          >
            {{ t("ai.sidebar.quickClear") }}
          </a-button>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <a-textarea
            v-model:value="inputText"
            :placeholder="t('ai.sidebar.inputPlaceholder')"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            @keydown.enter.ctrl="handleSend"
          />
          <a-button
            type="primary"
            class="send-btn"
            :loading="loading"
            :disabled="!inputText.trim()"
            @click="handleSend"
          >
            {{ t("ai.sidebar.send") }}
          </a-button>
          <div class="input-hint">{{ t("ai.sidebar.sendHint") }}</div>
        </div>
      </div>
    </a-drawer>

    <!-- AI 配置弹窗 -->
    <AIConfigModal v-model:visible="configModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import {
  BulbOutlined,
  RobotOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import AIConfigModal from "./AIConfigModal.vue";
import { useAISidebar } from "../composables/useAISidebar";

const MdViewer = defineAsyncComponent(() => import("./MdViewer.vue"));

const {
  t,
  visible,
  configModalVisible,
  messages,
  inputText,
  loading,
  streamingContent,
  messagesContainer,
  currentSQL,
  currentErrorMsg,
  currentResultStatus,
  hasConfig,
  toggleSidebar,
  openConfig,
  buildPrompt,
  handleQuickPrompt,
  applySQLToEditor,
  extractSQLFromMessage,
  handleSend,
  handleClear,
} = useAISidebar();
</script>

<style scoped src="./ai-sidebar/ai-sidebar.css"></style>
