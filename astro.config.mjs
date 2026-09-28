import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import icon from "astro-icon";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

import rehypeExternalLinks from "rehype-external-links";

import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
// import netlify from "@astrojs/netlify";
import { getAstroRedirects } from "./src/redirects";

import vercel from "@astrojs/vercel";

const envSchema = {
  NOTION_API_KEY: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  GEEKSBLABLA_NOTION_DATABASE_ID: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  YOUTUBE_API_KEY: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  CLOUDINARY_API_SECRET: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  PUBLIC_CLOUDINARY_API_KEY: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  PUBLIC_CLOUDINARY_CLOUD_NAME: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  OPENAI_API_KEY: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  OPENAI_CHAT_MODEL: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  OPENAI_EMBEDDING_MODEL: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  CHROMA_URL: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  CHROMA_TOKEN: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  CHROMA_COLLECTION: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  N_RESULTS_RETRIEVE: envField.number({
    context: "server",
    access: "secret",
    optional: true,
  }),
  N_RESULTS_CONTEXT: envField.number({
    context: "server",
    access: "secret",
    optional: true,
  }),
  TRANSLATE_NON_ENGLISH: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  OPEN_ROUTER_API_KEY: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  SUPADATA_API_KEY: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  RESEND_API_KEY: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
  ADMIN_PASSWORD: envField.string({
    context: "server",
    access: "secret",
    optional: true,
  }),
};

const redirects = getAstroRedirects();

const articlesDir = fileURLToPath(new URL("./articles/", import.meta.url));

// Cleans up after the article admin (see src/admin/save-article.ts): removes
// folders marked as deleted (already copied to .trash/) and cover images that
// an edit replaced. Both are kept while the dev server that used them runs.
const cleanUpArticleFolders = () => {
  for (const folder of readdirSync(articlesDir)) {
    const folderPath = path.join(articlesDir, folder);
    if (existsSync(path.join(folderPath, ".deleted"))) {
      rmSync(folderPath, { recursive: true, force: true });
      continue;
    }
    const unusedList = path.join(folderPath, ".unused");
    if (existsSync(unusedList)) {
      for (const file of readFileSync(unusedList, "utf-8").split("\n")) {
        const name = path.basename(file.trim());
        if (name) rmSync(path.join(folderPath, name), { force: true });
      }
      rmSync(unusedList, { force: true });
    }
  }
};

// Publication date of each article page, used as <lastmod> in the sitemap.
const getArticleDates = () => {
  const dates = new Map();
  for (const folder of readdirSync(articlesDir)) {
    for (const [file, prefix] of [
      ["index.md", "/blog/"],
      ["index.en.md", "/en/blog/"],
    ]) {
      const filePath = path.join(articlesDir, folder, file);
      if (!existsSync(filePath)) continue;
      const { data } = matter(readFileSync(filePath, "utf-8"));
      if (data.draft || !data.pubDatetime) continue;
      dates.set(`${prefix}${data.slug ?? folder}`, new Date(data.pubDatetime));
    }
  }
  return dates;
};
const articleDates = getArticleDates();

// Password-protected article admin (/admin): only registered during
// `astro dev`, so it is never part of the production build.
const devAdmin = {
  name: "neurovex-dev-admin",
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      cleanUpArticleFolders();
      if (command !== "dev") return;
      injectRoute({
        pattern: "/admin",
        entrypoint: "./src/admin/index.astro",
      });
      injectRoute({
        pattern: "/admin/login",
        entrypoint: "./src/admin/login.astro",
      });
      injectRoute({
        pattern: "/admin/logout",
        entrypoint: "./src/admin/logout.ts",
      });
      injectRoute({
        pattern: "/admin/new-article",
        entrypoint: "./src/admin/new-article.astro",
      });
      injectRoute({
        pattern: "/admin/edit-article",
        entrypoint: "./src/admin/edit-article.astro",
      });
      injectRoute({
        pattern: "/api/admin/articles",
        entrypoint: "./src/admin/save-article.ts",
      });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  adapter: vercel(),
  env: {
    schema: envSchema,
  },
  prefetch: {
    prefetchAll: true,
  },
  experimental: {},
  build: {
    format: "file",
  },
  redirects,

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      filter: page => {
        const path = new URL(page).pathname;
        return ![
          /^\/404(?:\/|$)/,
          /^\/en\/404(?:\/|$)/,
          /^\/chat(?:\/|$)/,
          /^\/links(?:\/|$)/,
          /^\/brand(?:\/|$)/,
          /^\/podcast\/new(?:\/|$)/,
          /^\/podcast\/planning(?:\/|$)/,
        ].some(pattern => pattern.test(path));
      },
      // Links each French page to its English version (hreflang alternates).
      i18n: {
        defaultLocale: "fr",
        locales: { fr: "fr-FR", en: "en-US" },
      },
      serialize: item => {
        const pathname = new URL(item.url).pathname
          .replace(/\.html$/, "")
          .replace(/\/$/, "");
        const date = articleDates.get(pathname);
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
    icon(),
    devAdmin,
    mdx(),
    pagefind(),
  ],

  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
          internal: true,
        },
      ],
    ],
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: {
    assetsInclude: ["**/*.riv"],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js", "node:fs", "stream"],
    },
    ssr: {
      external: [
        "@resvg/resvg-js",
        "@resvg/resvg-js-darwin-arm64",
        "@resvg/resvg-js-darwin-x64",
        "@resvg/resvg-js-linux-arm64-gnu",
        "@resvg/resvg-js-linux-arm64-musl",
        "@resvg/resvg-js-linux-x64-gnu",
        "@resvg/resvg-js-linux-x64-musl",
        "@resvg/resvg-js-win32-arm64-msvc",
        "@resvg/resvg-js-win32-x64-msvc",
        "node:fs",
        "node:path",
        "node:url",
        "node:crypto",
        "path",
        "fs",
        "stream",
        "util",
        "console",
        "child_process",
      ],
    },
  },
  scopedStyleStrategy: "where",
});
