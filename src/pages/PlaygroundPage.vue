<template>
  <div id="playgroundPage">
    <h2>{{ t("playground.title") }}</h2>
    <a-row :gutter="[16, 16]">
      <a-col :md="12" :xs="24">
        <sql-editor
          :level="firstLevel"
          :editor-style="{ height: 480 + 'px' }"
          :on-submit="onSubmit"
          :result-status="resultStatus"
        />
        <a-card :title="t('playground.history')" style="margin-top: 16px">
          <a-collapse v-if="sqlHistoryList.length > 0">
            <a-collapse-panel
              v-for="(data, index) in sqlHistoryList"
              :key="index"
              :header="data.sql"
            >
              <sql-result
                :result="data.result"
                :error-msg="data.errorMsg"
                :result-status="data.resultStatus"
              />
            </a-collapse-panel>
          </a-collapse>
          <div v-else>{{ t("playground.emptyHistory") }}</div>
        </a-card>
      </a-col>
      <a-col :md="12" :xs="24">
        <sql-result :result="result" :result-status="resultStatus" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { QueryExecResult } from "sql.js";
import { allLevels } from "../levels";
import { useAppI18n } from "../composables/useAppI18n";
import { localizeLevel } from "../levels/i18n";

const SqlEditor = defineAsyncComponent(
  () => import("../components/SqlEditor.vue")
);
const SqlResult = defineAsyncComponent(
  () => import("../components/SqlResult.vue")
);
const { t, locale } = useAppI18n();
const firstLevel = computed(() => localizeLevel(allLevels[0], locale.value));

const result = ref<QueryExecResult[]>([]);
const resultStatus = ref(0);
const sqlHistoryList = ref<
  {
    sql: string;
    result: QueryExecResult[];
    resultStatus: number;
    errorMsg?: string;
  }[]
>([]);

/**
 * 执行
 * @param sql
 * @param res
 * @param answerResult
 * @param errorMsg
 */
const onSubmit = (
  sql: string,
  res: QueryExecResult[],
  answerResult: QueryExecResult[],
  errorMsg?: string
) => {
  const status = errorMsg
    ? -1
    : JSON.stringify(res) === JSON.stringify(answerResult)
    ? 1
    : -1;

  result.value = res;
  resultStatus.value = status;
  sqlHistoryList.value.push({
    sql,
    result: res,
    resultStatus: status,
    errorMsg,
  });
};
</script>

<style scoped></style>
