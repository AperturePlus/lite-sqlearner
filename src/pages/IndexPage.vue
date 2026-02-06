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
import hljs from 'highlight.js';
import { format } from "sql-formatter";
import SqlEditor from "../components/SqlEditor.vue";
import QuestionBoard from "../components/QuestionBoard.vue";
import SqlResult from "../components/SqlResult.vue";
import { computed, ref, watch } from "vue";
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
watch([level], () => {
  // 发送上下文更新事件
  const event = new CustomEvent("updateAIContext", {
    detail: {
      content: level.value.content,
      sql: sqlEditorRef.value?.getCurrentSQL() || ""
    }
  });
  window.dispatchEvent(event);
  // 重置折叠面板状态
  activeKeys.value = [...defaultActiveKeys];
}, { immediate: true });

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
};

const highlightCode = (code: string) => {
  return hljs.highlightAuto(code).value;
};

</script>

<style>
.result-collapse-panel .ant-collapse-content-box {
  padding: 0 !important;
}
</style>
