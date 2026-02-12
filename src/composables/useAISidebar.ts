import { computed, nextTick, onMounted, onUnmounted, ref, type Ref } from "vue";
import { message } from "ant-design-vue";
import { createAIClient } from "../core/aiClient";
import type { AIMessage } from "../core/ai.d";
import { useGlobalStore } from "../core/globalStore";
import { useAppI18n } from "./useAppI18n";

interface AIContextEventDetail {
  sql?: string;
  content?: string;
  result?: unknown[];
  answerResult?: unknown[];
  errorMsg?: string;
  resultStatus?: number;
  initSQL?: string;
}

interface AISidebarState {
  t: ReturnType<typeof useAppI18n>["t"];
  visible: Ref<boolean>;
  configModalVisible: Ref<boolean>;
  messages: Ref<AIMessage[]>;
  inputText: Ref<string>;
  loading: Ref<boolean>;
  streamingContent: Ref<string>;
  messagesContainer: Ref<HTMLElement | null>;
  currentSQL: Ref<string>;
  currentErrorMsg: Ref<string>;
  currentResultStatus: Ref<number>;
  hasConfig: Ref<boolean>;
  toggleSidebar: () => void;
  openConfig: () => void;
  buildPrompt: (promptKey: string, params?: Record<string, string>) => string;
  handleQuickPrompt: (prompt: string) => void;
  applySQLToEditor: (sql: string) => void;
  extractSQLFromMessage: (content: string) => string | null;
  handleSend: () => Promise<void>;
  handleClear: () => void;
}

const SQL_CODE_BLOCK_REGEX = /```sql\s*\n([\s\S]*?)\n```/i;

export const useAISidebar = (): AISidebarState => {
  const globalStore = useGlobalStore();
  const { t, locale } = useAppI18n();

  const visible = ref(false);
  const configModalVisible = ref(false);

  const messages = ref<AIMessage[]>([]);
  const inputText = ref("");
  const loading = ref(false);
  const streamingContent = ref("");
  const messagesContainer = ref<HTMLElement | null>(null);

  const currentSQL = ref("");
  const questionContent = ref("");
  const currentResult = ref<unknown[]>([]);
  const currentAnswerResult = ref<unknown[]>([]);
  const currentErrorMsg = ref("");
  const currentResultStatus = ref(-1);
  const currentInitSQL = ref("");

  const hasConfig = computed(() => Boolean(globalStore.aiConfig?.apiKey));

  const toggleSidebar = () => {
    visible.value = !visible.value;
  };

  const openConfig = () => {
    configModalVisible.value = true;
  };

  const scrollToBottom = () => {
    nextTick(() => {
      if (!messagesContainer.value) {
        return;
      }
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    });
  };

  const getSystemPrompt = () => {
    let prompt = t("ai.systemPrompt.role");

    if (questionContent.value) {
      prompt += `\n\n${t("ai.systemPrompt.question")}\n${
        questionContent.value
      }`;
    }

    if (currentInitSQL.value) {
      prompt += `\n\n${t("ai.systemPrompt.schema")}\n\`\`\`sql\n${
        currentInitSQL.value
      }\n\`\`\``;
    }

    if (currentSQL.value) {
      prompt += `\n\n${t("ai.systemPrompt.userSql")}\n\`\`\`sql\n${
        currentSQL.value
      }\n\`\`\``;
    }

    if (currentResult.value.length > 0) {
      prompt += `\n\n${t("ai.systemPrompt.userResult")}\n${JSON.stringify(
        currentResult.value,
        null,
        2
      )}`;
    }

    if (currentAnswerResult.value.length > 0) {
      prompt += `\n\n${t("ai.systemPrompt.answerResult")}\n${JSON.stringify(
        currentAnswerResult.value,
        null,
        2
      )}`;
    }

    if (currentErrorMsg.value) {
      prompt += `\n\n${t("ai.systemPrompt.error")} ${currentErrorMsg.value}`;
    }

    if (currentResultStatus.value === 0) {
      prompt += `\n\n${t("ai.systemPrompt.mismatch")}`;
    }

    prompt +=
      locale.value === "en-US"
        ? "\n\nRespond in English."
        : "\n\n请使用中文回答。";

    return prompt;
  };

  const buildPrompt = (promptKey: string, params?: Record<string, string>) => {
    return t(`ai.prompts.${promptKey}`, params);
  };

  const handleQuickPrompt = (prompt: string) => {
    inputText.value = prompt;
    void handleSend();
  };

  const applySQLToEditor = (sql: string) => {
    const event = new CustomEvent("updateEditorSQL", {
      detail: { sql },
    });
    window.dispatchEvent(event);
    message.success(t("ai.sidebar.appliedSql"));
  };

  const extractSQLFromMessage = (content: string): string | null => {
    const match = content.match(SQL_CODE_BLOCK_REGEX);
    if (match?.[1]) {
      return match[1].trim();
    }
    return null;
  };

  const removeLastUserMessage = () => {
    const lastMessage = messages.value[messages.value.length - 1];
    if (lastMessage?.role === "user") {
      messages.value.pop();
    }
  };

  const handleSend = async () => {
    if (!inputText.value.trim() || loading.value) {
      return;
    }

    if (!hasConfig.value) {
      message.warning(t("ai.sidebar.configFirst"));
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
        message.error(response.error || t("ai.sidebar.callFailed"));
        removeLastUserMessage();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      message.error(t("ai.sidebar.sendFailed", { message: errorMessage }));
      removeLastUserMessage();
    } finally {
      loading.value = false;
      streamingContent.value = "";
      scrollToBottom();
    }
  };

  const handleClear = () => {
    messages.value = [];
    streamingContent.value = "";
  };

  const updateContextFromEvent = (detail?: AIContextEventDetail) => {
    if (!detail) {
      return;
    }
    currentSQL.value = detail.sql || "";
    questionContent.value = detail.content || "";
    currentResult.value = detail.result || [];
    currentAnswerResult.value = detail.answerResult || [];
    currentErrorMsg.value = detail.errorMsg || "";
    currentResultStatus.value = detail.resultStatus ?? -1;
    currentInitSQL.value = detail.initSQL || "";
  };

  const handleUpdateContext = (event: Event) => {
    const customEvent = event as CustomEvent<AIContextEventDetail>;
    updateContextFromEvent(customEvent.detail);
  };

  const handleOpenSidebar = () => {
    visible.value = true;
  };

  onMounted(() => {
    window.addEventListener(
      "updateAIContext",
      handleUpdateContext as EventListener
    );
    window.addEventListener("openAISidebar", handleOpenSidebar);
  });

  onUnmounted(() => {
    window.removeEventListener(
      "updateAIContext",
      handleUpdateContext as EventListener
    );
    window.removeEventListener("openAISidebar", handleOpenSidebar);
  });

  return {
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
  };
};
