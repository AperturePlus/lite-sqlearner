import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeTheme,
  shell,
} from "electron";
import path from "path";

const APP_ID = "com.lite.sqlearner";
const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";
let mainWindow: BrowserWindow | null = null;

type ThemeMode = "light" | "dark";

const getWindowPalette = (theme: ThemeMode) => {
  if (theme === "dark") {
    return {
      backgroundColor: "#0f172a",
      titleBarColor: "#0b1220",
      titleBarSymbolColor: "#e2e8f0",
    };
  }
  return {
    backgroundColor: "#f7f7f7",
    titleBarColor: "#ffffff",
    titleBarSymbolColor: "#0f172a",
  };
};

const resolveInitialTheme = (): ThemeMode =>
  nativeTheme.shouldUseDarkColors ? "dark" : "light";

const applyWindowTheme = (window: BrowserWindow, theme: ThemeMode) => {
  const palette = getWindowPalette(theme);
  window.setBackgroundColor(palette.backgroundColor);

  if (isWindows) {
    window.setTitleBarOverlay({
      color: palette.titleBarColor,
      symbolColor: palette.titleBarSymbolColor,
      height: 36,
    });
  }
};

if (isWindows) {
  app.setAppUserModelId(APP_ID);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

const createWindow = () => {
  const initialTheme = resolveInitialTheme();
  const palette = getWindowPalette(initialTheme);
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1080,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: palette.backgroundColor,
    ...(isWindows
      ? {
          titleBarStyle: "hidden" as const,
          titleBarOverlay: {
            color: palette.titleBarColor,
            symbolColor: palette.titleBarSymbolColor,
            height: 36,
          },
        }
      : {}),
    ...(isMac ? { titleBarStyle: "hiddenInset" as const } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow = window;

  if (!isDev && process.platform !== "darwin") {
    Menu.setApplicationMenu(null);
  }

  window.once("ready-to-show", () => {
    window.show();
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("file://")) {
      return;
    }
    if (
      isDev &&
      process.env.VITE_DEV_SERVER_URL &&
      url.startsWith(process.env.VITE_DEV_SERVER_URL)
    ) {
      return;
    }
    event.preventDefault();
    shell.openExternal(url);
  });

  window.on("closed", () => {
    if (mainWindow === window) {
      mainWindow = null;
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    window.loadURL(devServerUrl);
  } else {
    window.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};

if (gotTheLock) {
  app.on("second-instance", () => {
    if (!mainWindow) {
      return;
    }
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    ipcMain.handle("app:get-system-locale", () => {
      const preferredLanguages = app.getPreferredSystemLanguages?.() || [];
      const firstPreferred = preferredLanguages[0];
      return firstPreferred || app.getLocale() || "en-US";
    });
    ipcMain.on("app:set-window-theme", (_event, theme: ThemeMode) => {
      if (!mainWindow || mainWindow.isDestroyed()) {
        return;
      }
      if (theme !== "light" && theme !== "dark") {
        return;
      }
      applyWindowTheme(mainWindow, theme);
    });

    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
