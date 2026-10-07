import { cloudflare } from "@cloudflare/vite-plugin";
import { sites } from "@openai/sites-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import hostingConfig from "./.openai/hosting.json";

const PROJECT_ROOT = import.meta.dirname;
const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

function sitesHtmlEntry(): Plugin {
  return {
    name: "sites-html-entry",
    transformIndexHtml(html) {
      return html.replace(
        'src="/src/main.tsx"',
        'src="/client/src/main.tsx"',
      );
    },
  };
}

function flattenClientIndex(): Plugin {
  return {
    name: "flatten-client-index",
    enforce: "post",
    generateBundle(_options, bundle) {
      const nestedIndex = bundle["client/index.html"];
      if (!nestedIndex || nestedIndex.type !== "asset") return;

      delete bundle["client/index.html"];
      nestedIndex.fileName = "index.html";
      bundle["index.html"] = nestedIndex;
    },
  };
}

export default defineConfig({
  root: PROJECT_ROOT,
  publicDir: path.resolve(PROJECT_ROOT, "client", "public"),
  plugins: [
    react(),
    tailwindcss(),
    sites(),
    sitesHtmlEntry(),
    flattenClientIndex(),
    cloudflare({
      viteEnvironment: { name: "server" },
      config: {
        name: "downsize-baltimore",
        main: path.resolve(PROJECT_ROOT, "server", "worker.ts"),
        compatibility_date: "2026-05-22",
        compatibility_flags: ["nodejs_compat"],
        d1_databases: hostingConfig.d1
          ? [
              {
                binding: hostingConfig.d1,
                database_name: "downsize-baltimore-content",
                database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
              },
            ]
          : [],
        vars:
          process.env.NODE_ENV === "production"
            ? {}
            : {
                BLOG_LOGIN_USERNAME: process.env.BLOG_LOGIN_USERNAME ?? "",
                BLOG_LOGIN_PASSWORD_HASH: process.env.BLOG_LOGIN_PASSWORD_HASH ?? "",
              },
        assets: {
          binding: "ASSETS",
          not_found_handling: "single-page-application",
          run_worker_first: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "/src": path.resolve(PROJECT_ROOT, "client", "src"),
      "@": path.resolve(PROJECT_ROOT, "client", "src"),
      "@shared": path.resolve(PROJECT_ROOT, "shared"),
      "@assets": path.resolve(PROJECT_ROOT, "attached_assets"),
    },
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(PROJECT_ROOT, "client", "index.html"),
    },
    sourcemap: false,
  },
});
