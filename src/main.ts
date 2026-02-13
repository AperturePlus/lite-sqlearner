import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import * as VueRouter from "vue-router";
import routes from "./configs/routes";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { normalizeLocale } from "./core/i18n";
import { useGlobalStore } from "./core/globalStore";
import "ant-design-vue/dist/antd.css";
import "./style.css";

// 路由
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

// 状态管理
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const detectSystemLocale = async () => {
  try {
    const electronLocale = await (
      window as Window & {
        electron?: {
          getSystemLocale?: () => Promise<string> | string;
        };
      }
    ).electron?.getSystemLocale?.();
    if (electronLocale) {
      return electronLocale;
    }
  } catch (error) {
    console.warn("Failed to detect locale from Electron bridge:", error);
  }
  return navigator.language || "zh-CN";
};

const bootstrap = async () => {
  const globalStore = useGlobalStore(pinia);
  const systemLocale = normalizeLocale(await detectSystemLocale());
  globalStore.setSystemLocale(systemLocale);

  createApp(App).use(Antd).use(router).use(pinia).mount("#app");
};

bootstrap();
