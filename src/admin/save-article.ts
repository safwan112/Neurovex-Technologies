import type { APIRoute } from "astro";
import {
  access,
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { isAuthenticated, unauthorized } from "./auth";

// Dev-only endpoint (injected by the dev-admin integration in astro.config.mjs).
// POST writes a new article as Markdown files into the top-level `articles/`
// folder; DELETE copies an article folder to `.trash/articles/` and removes
// its Markdown files.
export const prerender = false;

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "articles");
const AUTHORS_DIR = path.join(ROOT, "authors");
const TRASH_DIR = path.join(ROOT, ".trash", "articles");
const FOLDER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Keep in sync with the dev-admin integration in astro.config.mjs.
export const DELETED_MARKER = ".deleted";

const COVER_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_COVER_SIZE = 5 * 1024 * 1024;

interface ArticleFields {
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  date: string;
  author: string;
  slug: string;
  lang: "fr" | "en";
  cover?: string;
  body: string;
}

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

const list = (value: string) =>
  value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

const quote = (value: string) => JSON.stringify(value);
const quoteList = (values: string[]) => `[${values.map(quote).join(", ")}]`;

const exists = async (target: string) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const buildMarkdown = (article: ArticleFields) => {
  const lines = [
    "---",
    `title: ${quote(article.title)}`,
    `tags: ${quoteList(article.tags)}`,
    `keywords: ${quoteList(article.keywords)}`,
    `pubDatetime: ${article.date}`,
    `authors: ${quoteList([article.author])}`,
    `slug: ${article.slug}`,
    `lang: ${quote(article.lang)}`,
    `description: ${quote(article.description)}`,
  ];
  if (article.cover) lines.push(`ogImage: ${quote(article.cover)}`);
  lines.push("---", "", article.body.replace(/\r\n/g, "\n").trim(), "");
  return lines.join("\n");
};

const error = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const markAsDeletedDraft = (content: string) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return content;
  const frontmatter = match[1]
    .split(/\r?\n/)
    .filter(line => !/^(ogImage|draft):/.test(line));
  return `---\n${[...frontmatter, "draft: true"].join("\n")}\n---\n`;
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  if (!isAuthenticated(cookies)) return unauthorized();

  const folder = url.searchParams.get("folder") ?? "";
  const articleDir = path.join(ARTICLES_DIR, folder);
  if (
    !FOLDER_PATTERN.test(folder) ||
    !(await exists(articleDir)) ||
    (await exists(path.join(articleDir, DELETED_MARKER)))
  ) {
    return error("Article introuvable.", 404);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const trashName = `${folder}-${stamp}`;
  await mkdir(TRASH_DIR, { recursive: true });
  await cp(articleDir, path.join(TRASH_DIR, trashName), { recursive: true });

  // The running dev server cannot fully forget a deleted article: on Windows
  // its glob loader misses file deletions, and it keeps importing every image
  // an entry ever referenced until restart. So: rewrite the Markdown files as
  // drafts (a change the loader does see, which hides the article), remove
  // them, and leave the images plus a marker file in place. The dev-admin
  // integration removes marked folders the next time Astro starts.
  const files = await readdir(articleDir);
  const markdownFiles = files.filter(name => name.endsWith(".md"));
  for (const file of markdownFiles) {
    const filePath = path.join(articleDir, file);
    const content = await readFile(filePath, "utf-8");
    await writeFile(filePath, markAsDeletedDraft(content), "utf-8");
  }
  await writeFile(path.join(articleDir, DELETED_MARKER), trashName, "utf-8");
  await new Promise(resolve => setTimeout(resolve, 1500));
  for (const file of markdownFiles) {
    await rm(path.join(articleDir, file), { force: true });
  }

  return new Response(
    JSON.stringify({ trash: `.trash/articles/${trashName}` }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) return unauthorized();

  const form = await request.formData();

  const slug = text(form, "slug");
  const date = text(form, "date");
  const author = text(form, "author");

  if (!FOLDER_PATTERN.test(slug)) {
    return error(
      "Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets."
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return error("La date est invalide.");
  }
  if (
    !/^[a-z0-9-]+$/.test(author) ||
    !(await exists(path.join(AUTHORS_DIR, `${author}.json`)))
  ) {
    return error("L'auteur sélectionné n'existe pas.");
  }

  const articleDir = path.join(ARTICLES_DIR, slug);
  if (await exists(path.join(articleDir, DELETED_MARKER))) {
    return error(
      `L'article « ${slug} » vient d'être supprimé. Redémarrez pnpm dev pour réutiliser cette adresse.`,
      409
    );
  }
  if (await exists(articleDir)) {
    return error(`Un article avec le slug « ${slug} » existe déjà.`, 409);
  }

  const versions: ArticleFields[] = [];
  for (const lang of ["fr", "en"] as const) {
    const title = text(form, `${lang}-title`);
    const description = text(form, `${lang}-description`);
    const body = text(form, `${lang}-body`);
    const hasContent = title || description || body;

    if (lang === "en" && !hasContent) continue;
    if (!title || !description || !body) {
      return error(
        lang === "fr"
          ? "Le titre, la description et le contenu en français sont obligatoires."
          : "Pour la version anglaise, remplissez le titre, la description et le contenu (ou laissez les trois vides)."
      );
    }

    const tags = list(text(form, `${lang}-tags`));
    const keywords = list(text(form, `${lang}-keywords`));
    versions.push({
      title,
      description,
      body,
      tags: tags.length ? tags : ["Neurovex"],
      keywords: keywords.length ? keywords : tags,
      date,
      author,
      slug,
      lang,
    });
  }

  let cover: string | undefined;
  const coverFile = form.get("cover");
  if (coverFile instanceof File && coverFile.size > 0) {
    const extension = COVER_TYPES[coverFile.type];
    if (!extension) {
      return error("L'image doit être au format PNG, JPG ou WebP.");
    }
    if (coverFile.size > MAX_COVER_SIZE) {
      return error("L'image ne doit pas dépasser 5 Mo.");
    }
    cover = `cover.${extension}`;
  }

  await mkdir(articleDir, { recursive: true });
  if (cover && coverFile instanceof File) {
    await writeFile(
      path.join(articleDir, cover),
      Buffer.from(await coverFile.arrayBuffer())
    );
  }
  for (const version of versions) {
    const fileName = version.lang === "fr" ? "index.md" : "index.en.md";
    await writeFile(
      path.join(articleDir, fileName),
      buildMarkdown({ ...version, cover: cover && `./${cover}` }),
      "utf-8"
    );
  }

  return new Response(
    JSON.stringify({
      folder: `articles/${slug}`,
      links: versions.map(version =>
        version.lang === "fr" ? `/blog/${slug}` : `/en/blog/${slug}`
      ),
    }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
};
