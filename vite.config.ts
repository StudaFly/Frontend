/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Public host of a Cloudflare Tunnel to this dev server (e.g. dev.studafly.com):
  // Vite must accept it, and hot reload goes through the tunnel (HTTPS, port 443).
  const publicHost = env.DEV_PUBLIC_HOST;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      // The browser calls the API on the same origin (VITE_API_URL=/api/v1): no CORS and no
      // HTTP call from an HTTPS page when the app is opened through the tunnel.
      proxy: {
        "/api": {
          target: env.API_PROXY_TARGET || "http://localhost:8080",
          changeOrigin: true,
        },
      },
      ...(publicHost && {
        allowedHosts: [publicHost],
        hmr: { host: publicHost, protocol: "wss", clientPort: 443 },
      }),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      css: false,
      setupFiles: "./tests/setup.ts",
      exclude: ["node_modules", "tests/e2e/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
        exclude: ["node_modules/", "tests/"],
      },
    },
  };
});
