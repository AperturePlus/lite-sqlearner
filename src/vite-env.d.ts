/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ElectronBridge {
  getSystemLocale?: () => Promise<string>;
}

interface Window {
  electron?: ElectronBridge;
}
