import { defineStore } from "pinia";
import { allLevels } from "../levels";
import { AIConfig } from "./ai.d";
import { AppLocale, LanguagePreference, normalizeLocale } from "./i18n";

/**
 * 全局状态存储
 *
 * @author yupi
 */
export const useGlobalStore = defineStore("global", {
  state: () => ({
    // 学习记录
    studyHistoryList: [],
    // 当前关卡
    currentLevel: { ...allLevels[0] },
    theme: "light",
    languagePreference: "auto" as LanguagePreference,
    systemLocale: "zh-CN" as AppLocale,
    // AI 配置
    aiConfig: null as AIConfig | null,
  }),
  getters: {
    currentLocale(state): AppLocale {
      if (state.languagePreference === "auto") {
        return normalizeLocale(state.systemLocale);
      }
      return normalizeLocale(state.languagePreference);
    },
  },
  // 持久化
  persist: {
    key: "global",
    storage: window.localStorage,
    beforeRestore: () => {
      console.log("load globalStore data start");
    },
    afterRestore: () => {
      console.log("load globalStore data end");
    },
  },
  actions: {
    reset() {
      this.$reset();
    },
    setTheme(theme: "light" | "dark") {
      this.theme = theme;
    },
    setLanguagePreference(languagePreference: LanguagePreference) {
      this.languagePreference = languagePreference;
    },
    setSystemLocale(locale: string) {
      this.systemLocale = normalizeLocale(locale);
    },
    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
    },
    setAIConfig(config: AIConfig | null) {
      this.aiConfig = config;
    },
  },
});
