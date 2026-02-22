import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import net from "node:net";

function canListen(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => {
      resolve(false);
    });
    server.listen(port, host, () => {
      server.close(() => resolve(true));
    });
  });
}

async function resolveDevPort(host: string, preferredPorts: number[]) {
  for (const port of preferredPorts) {
    if (await canListen(host, port)) {
      return port;
    }
  }
  return 6173;
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const devHost = "127.0.0.1";
  const devPort = await resolveDevPort(devHost, [5173, 5262, 6173, 3000]);

  return {
    base: "./",
    server: {
      host: devHost,
      port: devPort,
    },
    plugins: [
      vue({
        // Support Markdown content imports
        include: [/\.vue$/, /\.md$/, /\.db$/],
      }),
    ],
    build: {
      target: "es2020",
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return;
            }
            if (id.includes("monaco-editor")) {
              return "vendor-monaco";
            }
            if (id.includes("sql.js")) {
              return "vendor-sqljs";
            }
            if (
              id.includes("@bytemd") ||
              id.includes("highlight.js") ||
              id.includes("github-markdown-css")
            ) {
              return "vendor-markdown";
            }
            if (
              id.includes("openai") ||
              id.includes("@anthropic-ai") ||
              id.includes("@google/generative-ai")
            ) {
              return "vendor-ai";
            }
            if (id.includes("ant-design-vue") || id.includes("@ant-design")) {
              return "vendor-antd";
            }
            if (
              id.includes("vue") ||
              id.includes("vue-router") ||
              id.includes("pinia")
            ) {
              return "vendor-vue";
            }
            return "vendor-misc";
          },
        },
      },
    },
  };
});
