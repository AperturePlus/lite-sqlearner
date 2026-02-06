<template>
  <div id="indexPage">
    <a-row :gutter="[16, 16]">
      <a-col :lg="11" :xs="24">
        <question-board :level="level" :result-status="resultStatus" />
      </a-col>
      <a-col :lg="13" :xs="24">
        <sql-editor
          ref="sqlEditorRef"
          :level="level"
          :editor-style="{ height: '280px' }"
          :result-status="resultStatus"
          :on-submit="onSubmit"
        />
        <a-collapse v-model:active-key="activeKeys" style="margin-top: 16px">
          <a-collapse-panel
            key="result"
            header="查看执行结果"
            class="result-collapse-panel"
          >
            <sql-result
              :level="level"
              :result="result"
              :result-status="resultStatus"
              :answer-result="answerResult"
              :error-msg="errorMsgRef"
              style="margin-top: 16px"
            />
          </a-collapse-panel>
          <a-collapse-panel v-if="level.hint" key="hint" header="查看提示">
            <p>{{ level.hint }}</p>
          </a-collapse-panel>
          <a-collapse-panel key="ddl" header="查看建表语句">
            <code-editor
              :init-value="level.initSQL"
              :editor-style="{ minHeight: '400px' }"
              read-only
            />
          </a-collapse-panel>
          <a-collapse-panel key="answer" header="查看答案">
            <code-editor
              :init-value="level.answer"
              :editor-style="{ minHeight: '400px' }"
              read-only
            />
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import hljs from "highlight.js";
import { format } from "sql-formatter";
import SqlEditor from "../components/SqlEditor.vue";
import QuestionBoard from "../components/QuestionBoard.vue";
import SqlResult from "../components/SqlResult.vue";
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { QueryExecResult } from "sql.js";
import { allLevels, getLevelByKey } from "../levels";
import { checkResult } from "../core/result";
import CodeEditor from "../components/CodeEditor.vue";

interface IndexPageProps {
  levelKey?: string;
}

const props = defineProps<IndexPageProps>();
const level = computed(() => {
  if (props.levelKey) {
    return getLevelByKey(props.levelKey);
  }
  return allLevels[0];
});

const result = ref<QueryExecResult[]>([]);
const answerResult = ref<QueryExecResult[]>([]);
const errorMsgRef = ref<string>();
const resultStatus = ref<number>(-1);
const defaultActiveKeys = ["result"];
const activeKeys = ref([...defaultActiveKeys]);
const sqlEditorRef = ref<InstanceType<typeof SqlEditor>>();

// 广播当前上下文给 AI 侧边栏
const broadcastContext = () => {
  const event = new CustomEvent("updateAIContext", {
    detail: {
      content: level.value.content,
      sql: sqlEditorRef.value?.getCurrentSQL() || "",
      result: result.value,
      answerResult: answerResult.value,
      errorMsg: errorMsgRef.value,
      resultStatus: resultStatus.value,
      initSQL: level.value.initSQL,
    },
  });
  window.dispatchEvent(event);
};

watch(
  [level],
  () => {
    // 重置折叠面板状态
    activeKeys.value = [...defaultActiveKeys];
    // 广播初始上下文
    broadcastContext();
  },
  { immediate: true }
);

/**
 * 执行结果
 * @param sql
 * @param res
 * @param answerRes
 * @param errorMsg
 */
const onSubmit = (
  sql: string,
  res: QueryExecResult[],
  answerRes: QueryExecResult[],
  errorMsg?: string
) => {
  result.value = res;
  answerResult.value = answerRes;
  errorMsgRef.value = errorMsg;
  resultStatus.value = checkResult(res, answerRes);
  // 执行后广播最新上下文
  broadcastContext();
};

const highlightCode = (code: string) => {
  return hljs.highlightAuto(code).value;
};

// 监听 AI 更新编辑器事件
const handleUpdateEditorSQL = (event: CustomEvent) => {
  if (event.detail && event.detail.sql && sqlEditorRef.value) {
    sqlEditorRef.value.setSQL(event.detail.sql);
    // 可选：自动运行新的 SQL
    // doSubmit();
  }
};

onMounted(() => {
  window.addEventListener(
    "updateEditorSQL",
    handleUpdateEditorSQL as EventListener
  );
});

onUnmounted(() => {
  window.removeEventListener(
    "updateEditorSQL",
    handleUpdateEditorSQL as EventListener
  );
});
</script>

<style>
.result-collapse-panel .ant-collapse-content-box {
  padding: 0 !important;
}
</style>
