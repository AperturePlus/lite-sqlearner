<template>
  <a-card
    id="sqlResult"
    class="sql-result-card"
    :title="t('result.title')"
    :extra="statusText"
    :bordered="false"
  >
    <sql-result-table v-if="!errorMsg" :result="result" />
    <div v-else>{{ t("result.errorPrefix") }}{{ errorMsg }}</div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import { QueryExecResult } from "sql.js";
import SqlResultTable from "./SqlResultTable.vue";
import { RESULT_STATUS_ENUM } from "../core/result";
import { useAppI18n } from "../composables/useAppI18n";

interface Props {
  result: QueryExecResult[];
  answerResult: QueryExecResult[];
  resultStatus: number;
  errorMsg?: string;
  // eslint-disable-next-line vue/require-default-prop
  level?: LevelType;
}

const props = withDefaults(defineProps<Props>(), {
  result: () => [],
  answerResult: () => [],
  errorMsg: () => "",
});
const { t } = useAppI18n();
const statusText = computed(() => {
  if (props.resultStatus === RESULT_STATUS_ENUM.SUCCEED) {
    return t("result.status.success");
  }
  if (props.resultStatus === RESULT_STATUS_ENUM.ERROR) {
    return t("result.status.error");
  }
  return t("result.status.default");
});

// e.g. [{"columns":["a","b"],"values":[[0,"hello"],[1,"world"]]}]
const { result } = toRefs(props);
</script>

<style scoped>
.sql-result-card {
  max-height: 420px;
  overflow-y: auto;
}

.sql-result-card::-webkit-scrollbar {
  width: 6px;
}

.sql-result-card::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 0;
}

.sql-result-card::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 3px;
}

.sql-result-card::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

:global([data-theme="dark"] .sql-result-card::-webkit-scrollbar-thumb) {
  background: rgba(148, 163, 184, 0.35);
}

:global([data-theme="dark"] .sql-result-card::-webkit-scrollbar-thumb:hover) {
  background: rgba(148, 163, 184, 0.5);
}
</style>
