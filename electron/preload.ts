import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getSystemLocale: () => ipcRenderer.invoke("app:get-system-locale"),
});
