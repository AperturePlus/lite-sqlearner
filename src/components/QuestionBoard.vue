<template>
  <div id="questionBoard">
    <a-card v-if="level" id="questionCard">
      <md-viewer :value="level.content" />
      <a-divider />
      <div class="question-actions">
        <a-button v-if="levelNum > 0" class="nav-btn" @click="toPrevLevel">
          {{ t("question.prev") }}
        </a-button>
        <a-button
          v-if="levelNum < mainLevels.length - 1"
          type="primary"
          class="nav-btn nav-btn-next"
          :disabled="resultStatus !== RESULT_STATUS_ENUM.SUCCEED"
          @click="toNextLevel"
        >
          {{ t("question.next") }}
        </a-button>
        <a-button
          v-if="levelNum === mainLevels.length - 1"
          type="primary"
          class="nav-btn nav-btn-next"
          :disabled="resultStatus !== RESULT_STATUS_ENUM.SUCCEED"
          @click="doWin"
        >
          {{ t("question.win") }}
        </a-button>
      </div>
    </a-card>
    <a-card v-else>{{ t("question.loadFailed") }}</a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, toRefs, watch } from "vue";
import mainLevels from "../levels/mainLevels";
import { getCurrentLevelNum, getNextLevel, getPrevLevel } from "../levels";
import { useRouter } from "vue-router";
import { RESULT_STATUS_ENUM } from "../core/result";
import { useAppI18n } from "../composables/useAppI18n";
const MdViewer = defineAsyncComponent(() => import("./MdViewer.vue"));

interface Props {
  level: LevelType;
  resultStatus: number;
}

const props = withDefaults(defineProps<Props>(), {});
const { level } = toRefs(props);
const router = useRouter();
const { t } = useAppI18n();
const levelNum = computed(() => {
  return getCurrentLevelNum(level.value);
});

/**
 * 切换关卡时，回到顶部
 */
watch([levelNum], () => {
  scrollTo({
    top: 0,
  });
  const questionCardDom = document.getElementById("questionCard");
  if (questionCardDom) {
    questionCardDom.scrollTop = 0;
  }
});

/**
 * 通关
 */
const doWin = () => {
  alert(t("question.winAlert"));
};

/**
 * 上一关
 */
const toPrevLevel = () => {
  const toLevel = getPrevLevel(level.value);
  if (toLevel) {
    router.push(`/learn/${toLevel.key}`);
  }
};

/**
 * 下一关
 */
const toNextLevel = () => {
  const toLevel = getNextLevel(level.value);
  if (toLevel) {
    router.push(`/learn/${toLevel.key}`);
  }
};
</script>

<style>
#questionBoard #questionCard {
  max-height: calc(100vh - 100px);
  min-height: 600px;
  overflow-y: auto;
}

#questionBoard .question-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
}

#questionBoard .question-actions .nav-btn {
  min-width: 96px;
}

#questionBoard .question-actions .nav-btn-next {
  margin-left: auto;
}

#questionBoard #questionCard::-webkit-scrollbar {
  width: 6px;
}

#questionBoard #questionCard::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 0;
}

#questionBoard #questionCard::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 3px;
}

#questionBoard #questionCard::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

:global([data-theme="dark"]
    #questionBoard
    #questionCard::-webkit-scrollbar-thumb) {
  background: rgba(148, 163, 184, 0.35);
}

:global([data-theme="dark"]
    #questionBoard
    #questionCard::-webkit-scrollbar-thumb:hover) {
  background: rgba(148, 163, 184, 0.5);
}

:global([data-theme="dark"] #questionBoard .question-actions .ant-btn-default) {
  background: rgba(30, 41, 59, 0.7) !important;
  border-color: rgba(71, 85, 105, 0.6) !important;
  color: #e2e8f0 !important;
}

:global([data-theme="dark"]
    #questionBoard
    .question-actions
    .ant-btn-default:hover:not(:disabled)) {
  background: rgba(30, 41, 59, 0.92) !important;
  border-color: rgba(96, 165, 250, 0.75) !important;
  color: #bfdbfe !important;
}

:global([data-theme="dark"] #questionBoard .question-actions .ant-btn-primary) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
}

:global([data-theme="dark"]
    #questionBoard
    .question-actions
    .ant-btn-primary:hover:not(:disabled)) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

:global([data-theme="dark"]
    #questionBoard
    .question-actions
    .ant-btn:disabled) {
  background: rgba(30, 41, 59, 0.35) !important;
  border-color: rgba(71, 85, 105, 0.35) !important;
  color: rgba(148, 163, 184, 0.6) !important;
  box-shadow: none !important;
}
</style>
