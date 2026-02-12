import { computed } from "vue";
import { useGlobalStore } from "../core/globalStore";
import { t as translate } from "../core/i18n";

export const useAppI18n = () => {
  const globalStore = useGlobalStore();
  const locale = computed(() => globalStore.currentLocale);
  const t = (key: string, params?: Record<string, string | number>) => {
    return translate(locale.value, key, params);
  };

  return {
    locale,
    t,
  };
};
