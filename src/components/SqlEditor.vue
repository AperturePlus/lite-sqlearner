<template>
  <div id="sqlEditor">
    <div ref="editorRef" :style="editorStyle" />
    <a-space :size="16" style="margin-top: 16px">
      <a-button type="primary" style="width: 180px" @click="doSubmit">
        运行
      </a-button>
      <a-button @click="doFormat">格式化</a-button>
      <a-button @click="doReset">重置</a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import {
  CSSProperties,
  computed,
  onMounted,
  onUnmounted,
  ref,
  toRaw,
  toRefs,
  watchEffect,
} from "vue";
import * as monaco from "monaco-editor";
import { format } from "sql-formatter";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { initDB, runSQL } from "../core/sqlExecutor";
import { QueryExecResult } from "sql.js";
// eslint-disable-next-line no-undef
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import { message } from "ant-design-vue";
import { useGlobalStore } from "../core/globalStore";

(self as any).MonacoEnvironment = {
  getWorker(_: any, label: any) {
    return new EditorWorker();
  },
};

// @ts-ignore
interface SqlEditorProps {
  level: LevelType;
  editorStyle: CSSProperties;
  resultStatus: number;
  onSubmit: (
    sql: string,
    result: QueryExecResult[],
    answerResult: QueryExecResult[],
    errorMsg?: string
  ) => void;
}

const props = withDefaults(defineProps<SqlEditorProps>(), {});
const { level, onSubmit } = toRefs(props);
const inputEditor = ref<IStandaloneCodeEditor>();
const editorRef = ref<HTMLElement>();
const db = ref();
const globalStore = useGlobalStore();
const editorTheme = computed(() =>
  globalStore.theme === "dark" ? "vs-dark" : "vs"
);

watchEffect(async () => {
  // 初始化 / 更新默认 SQL
  if (inputEditor.value) {
    toRaw(inputEditor.value).setValue(
      "-- 请在此处输入 SQL\n" + level.value.defaultSQL
    );
  }
  // 初始化 / 更新 DB
  db.value = await initDB(level.value.initSQL);
  doSubmit();
});

/**
 * SQL 格式化
 */
const doFormat = () => {
  if (!inputEditor.value) {
    return;
  }
  const inputStr = toRaw(inputEditor.value).getValue();
  // https://www.npmjs.com/package/sql-formatter
  const resultStr = format(inputStr, { language: "sqlite" });
  toRaw(inputEditor.value).setValue(resultStr);
};

/**
 * 重置（同时重建数据库，清除用户对数据的污染）
 */
const doReset = async () => {
  if (inputEditor.value) {
    toRaw(inputEditor.value).setValue(level.value.defaultSQL);
    db.value = await initDB(level.value.initSQL);
    doSubmit();
  }
};

/**
 * 获取当前 SQL
 */
const getCurrentSQL = () => {
  if (!inputEditor.value) {
    return "";
  }
  return toRaw(inputEditor.value).getValue();
};

/**
 * 设置 SQL 内容
 */
const setSQL = (sql: string) => {
  if (!inputEditor.value) {
    return;
  }
  toRaw(inputEditor.value).setValue(sql);
};

/**
 * 提交结果
 * 答案 SQL 在独立的 DB 实例上运行，防止用户通过 INSERT/UPDATE/DELETE/DDL 污染数据影响判题
 */
const doSubmit = async () => {
  if (!inputEditor.value) {
    return;
  }
  const inputStr = toRaw(inputEditor.value).getValue();
  console.log("inputStr", inputStr);
  try {
    const result = runSQL(db.value, inputStr);
    // 答案在全新的干净 DB 上执行，隔离用户操作
    const answerDB = await initDB(level.value.initSQL);
    const answerResult = runSQL(answerDB, level.value.answer);
    answerDB.close();
    // 向外层传递结果
    onSubmit?.value(inputStr, result, answerResult);
  } catch (error: any) {
    message.error("语句错误，" + error.message);
    // 向外层传递结果
    onSubmit?.value(inputStr, [], [], error.message);
  }
};

onMounted(async () => {
  // 初始化代码编辑器
  if (editorRef.value) {
    const initValue = "";
    inputEditor.value = monaco.editor.create(editorRef.value, {
      value: initValue,
      language: "sql",
      theme: editorTheme.value,
      formatOnPaste: true,
      automaticLayout: true,
      fontSize: 16,
      minimap: {
        enabled: false,
      },
    });
    // 自动保存草稿
    // 暂不开启，刷新后恢复当前关卡的默认 SQL
    // setInterval(() => {
    //   if (inputEditor.value) {
    //     localStorage.setItem("draft", toRaw(inputEditor.value).getValue());
    //   }
    // }, 3000);
  }
});

watchEffect(() => {
  if (inputEditor.value) {
    monaco.editor.setTheme(editorTheme.value);
  }
});

/**
 * 释放资源
 */
onUnmounted(() => {
  if (inputEditor.value) {
    toRaw(inputEditor.value).dispose();
  }
});

// 暴露方法给父组件
defineExpose({
  getCurrentSQL,
  setSQL,
});
</script>

<style></style>
