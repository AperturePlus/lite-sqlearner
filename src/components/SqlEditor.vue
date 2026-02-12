<template>
  <div id="sqlEditor">
    <div ref="editorRef" :style="editorStyle" />
    <a-space :size="16" style="margin-top: 16px">
      <a-button type="primary" style="width: 180px" @click="doSubmit">
        {{ t("editor.run") }}
      </a-button>
      <a-button @click="doFormat">{{ t("editor.format") }}</a-button>
      <a-button @click="doReset">{{ t("editor.reset") }}</a-button>
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
  watch,
} from "vue";
import type { editor } from "monaco-editor";
import { format } from "sql-formatter";
import { initDB, runSQL } from "../core/sqlExecutor";
import { Database, QueryExecResult } from "sql.js";
import { message } from "ant-design-vue";
import { useGlobalStore } from "../core/globalStore";
import { ensureMonacoSqlLanguage } from "../core/monacoSql";
import { useAppI18n } from "../composables/useAppI18n";

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

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
const monacoRef = ref<any>(null);
const db = ref<Database | null>(null);
const globalStore = useGlobalStore();
const { t, locale } = useAppI18n();
const editorTheme = computed(() =>
  globalStore.theme === "dark" ? "vs-dark" : "vs"
);

const closeDB = () => {
  if (db.value) {
    db.value.close();
    db.value = null;
  }
};

let initVersion = 0;
let submitVersion = 0;

watch(
  [() => level.value.key, inputEditor, locale],
  async () => {
    if (!inputEditor.value) {
      return;
    }

    // 关卡或语言变更时，使历史提交结果失效，避免旧结果回写
    submitVersion += 1;

    // 初始化 / 更新默认 SQL
    toRaw(inputEditor.value).setValue(
      `${t("editor.placeholder")}\n${level.value.defaultSQL}`
    );

    // 初始化 / 更新 DB
    closeDB();
    const currentVersion = ++initVersion;
    const nextDB = await initDB(level.value.initSQL);

    // 异步初始化竞态保护：仅保留最新一次初始化结果
    if (currentVersion !== initVersion) {
      nextDB.close();
      return;
    }

    db.value = nextDB;
    await doSubmit();
  },
  { immediate: true }
);

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
    closeDB();
    db.value = await initDB(level.value.initSQL);
    await doSubmit();
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
  if (!inputEditor.value || !db.value) {
    return;
  }
  const currentSubmitVersion = ++submitVersion;
  const inputStr = toRaw(inputEditor.value).getValue();
  let answerDB: Database | null = null;
  try {
    const result = runSQL(db.value, inputStr);
    // 答案在全新的干净 DB 上执行，隔离用户操作
    answerDB = await initDB(level.value.initSQL);
    const answerResult = runSQL(answerDB, level.value.answer);
    if (currentSubmitVersion !== submitVersion) {
      return;
    }
    // 向外层传递结果
    onSubmit?.value(inputStr, result, answerResult);
  } catch (error: any) {
    if (currentSubmitVersion !== submitVersion) {
      return;
    }
    message.error(t("editor.error", { message: error.message }));
    // 向外层传递结果
    onSubmit?.value(inputStr, [], [], error.message);
  } finally {
    if (answerDB) {
      answerDB.close();
    }
  }
};

onMounted(async () => {
  if (editorRef.value) {
    const monaco = await import("monaco-editor/esm/vs/editor/editor.api");
    const { default: EditorWorker } = await import(
      "monaco-editor/esm/vs/editor/editor.worker?worker"
    );
    (self as any).MonacoEnvironment = {
      getWorker() {
        return new EditorWorker();
      },
    };
    await ensureMonacoSqlLanguage(monaco);
    monacoRef.value = monaco;
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

watch(editorTheme, (theme) => {
  if (inputEditor.value && monacoRef.value) {
    monacoRef.value.editor.setTheme(theme);
  }
});

/**
 * 释放资源
 */
onUnmounted(() => {
  closeDB();
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
