import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  getSystemLocale: () => ipcRenderer.invoke("app:get-system-locale"),
  setWindowTheme: (theme: "light" | "dark") =>
    ipcRenderer.send("app:set-window-theme", theme),
});
