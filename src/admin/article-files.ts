import { access, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

// Reading and writing article Markdown files for the dev-only admin.

export const ROOT = process.cwd();
export const ARTICLES_DIR = path.join(ROOT, "articles");
export const AUTHORS_DIR = path.join(ROOT, "authors");
export const TRASH_DIR = path.join(ROOT, ".trash", "articles");
export const FOLDER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Keep both markers in sync with the dev-admin integration in astro.config.mjs.
export const DELETED_MARKER = ".deleted";
export const UNUSED_FILES_MARKER = ".unused";

export const LANGUAGES = ["fr", "en"] as const;
export type Lang = (typeof LANGUAGES)[number];

export const fileNameFor = (lang: Lang) =>
  lang === "fr" ? "index.md" : "index.en.md";

export interface ArticleVersion {
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  date: string;
  authors: string[];
  slug: string;
  lang: Lang;
  cover?: string;
  body: string;
  // Frontmatter keys the admin form does not edit (featured, draft, ...).
  extra: Record<string, unknown>;
}

const EDITED_KEYS = [
  "title",
  "description",
  "tags",
  "keywords",
  "pubDatetime",
  "authors",
  "slug",
  "lang",
  "ogImage",
];

export const exists = async (target: string) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const quote = (value: unknown) => JSON.stringify(value);
const quoteList = (values: string[]) => `[${values.map(quote).join(", ")}]`;

const toDateString = (value: unknown) =>
  value instanceof Date
    ? value.toISOString().slice(0, 10)
    : String(value ?? "").slice(0, 10);

const toList = (value: unknown) =>
  Array.isArray(value) ? value.map(String).filter(Boolean) : [];

export const buildMarkdown = (article: ArticleVersion) => {
  const lines = [
    "---",
    `title: ${quote(article.title)}`,
    `tags: ${quoteList(article.tags)}`,
    `keywords: ${quoteList(article.keywords)}`,
    `pubDatetime: ${article.date}`,
    `authors: ${quoteList(article.authors)}`,
    `slug: ${article.slug}`,
    `lang: ${quote(article.lang)}`,
    `description: ${quote(article.description)}`,
  ];
  if (article.cover) lines.push(`ogImage: ${quote(article.cover)}`);
  for (const [key, value] of Object.entries(article.extra)) {
    lines.push(
      `${key}: ${value instanceof Date ? toDateString(value) : quote(value)}`
    );
  }
  lines.push("---", "", article.body.replace(/\r\n/g, "\n").trim(), "");
  return lines.join("\n");
};

export const readArticleVersion = async (
  folder: string,
  lang: Lang
): Promise<ArticleVersion | undefined> => {
  const filePath = path.join(ARTICLES_DIR, folder, fileNameFor(lang));
  if (!(await exists(filePath))) return undefined;

  const { data, content } = matter(await readFile(filePath, "utf-8"));
  const extra = Object.fromEntries(
    Object.entries(data).filter(([key]) => !EDITED_KEYS.includes(key))
  );
  return {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    tags: toList(data.tags),
    keywords: toList(data.keywords).filter(Boolean),
    date: toDateString(data.pubDatetime),
    authors: toList(data.authors),
    slug: String(data.slug ?? folder),
    lang,
    cover: data.ogImage ? String(data.ogImage) : undefined,
    body: content.trim(),
    extra,
  };
};

export const isValidFolder = async (folder: string) =>
  FOLDER_PATTERN.test(folder) &&
  (await exists(path.join(ARTICLES_DIR, folder))) &&
  !(await exists(path.join(ARTICLES_DIR, folder, DELETED_MARKER)));
