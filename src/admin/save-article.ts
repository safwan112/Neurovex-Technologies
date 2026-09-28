import type { APIRoute } from "astro";
import {
  appendFile,
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { isAuthenticated, unauthorized } from "./auth";
import {
  ARTICLES_DIR,
  AUTHORS_DIR,
  DELETED_MARKER,
  FOLDER_PATTERN,
  LANGUAGES,
  TRASH_DIR,
  UNUSED_FILES_MARKER,
  buildMarkdown,
  exists,
  fileNameFor,
  isValidFolder,
  readArticleVersion,
  type ArticleVersion,
  type Lang,
} from "./article-files";

// Dev-only endpoint (injected by the dev-admin integration in astro.config.mjs).
// POST creates an article folder in `articles/`, PUT updates one, and DELETE
// copies one to `.trash/articles/` and removes its Markdown files.
export const prerender = false;

const COVER_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_COVER_SIZE = 5 * 1024 * 1024;

type FormVersion = Pick<
  ArticleVersion,
  "title" | "description" | "body" | "tags" | "keywords"
>;

class FormError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

const list = (value: string) =>
  value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const readDate = (form: FormData) => {
  const date = text(form, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new FormError("La date est invalide.");
  }
  return date;
};

// Returns the filled-in language versions; English is optional.
const readVersions = (form: FormData) => {
  const versions = new Map<Lang, FormVersion>();
  for (const lang of LANGUAGES) {
    const title = text(form, `${lang}-title`);
    const description = text(form, `${lang}-description`);
    const body = text(form, `${lang}-body`);

    if (lang === "en" && !title && !description && !body) continue;
    if (!title || !description || !body) {
      throw new FormError(
        lang === "fr"
          ? "Le titre, la description et le contenu en français sont obligatoires."
          : "Pour la version anglaise, remplissez le titre, la description et le contenu (ou laissez les trois vides)."
      );
    }

    const tags = list(text(form, `${lang}-tags`));
    const keywords = list(text(form, `${lang}-keywords`));
    versions.set(lang, {
      title,
      description,
      body,
      tags: tags.length ? tags : ["Neurovex"],
      keywords: keywords.length ? keywords : tags,
    });
  }
  return versions;
};

// Validates an uploaded cover; returns undefined when none was chosen.
const readCover = (form: FormData) => {
  const file = form.get("cover");
  if (!(file instanceof File) || file.size === 0) return undefined;

  const extension = COVER_TYPES[file.type];
  if (!extension) {
    throw new FormError("L'image doit être au format PNG, JPG ou WebP.");
  }
  if (file.size > MAX_COVER_SIZE) {
    throw new FormError("L'image ne doit pas dépasser 5 Mo.");
  }
  return { file, extension };
};

const articleLinks = (slug: string, langs: Lang[]) =>
  langs.map(lang => (lang === "fr" ? `/blog/${slug}` : `/en/blog/${slug}`));

const handle =
  (handler: APIRoute): APIRoute =>
  async context => {
    if (!isAuthenticated(context.cookies)) return unauthorized();
    try {
      return await handler(context);
    } catch (caught) {
      if (caught instanceof FormError) {
        return json({ error: caught.message }, caught.status);
      }
      throw caught;
    }
  };

export const POST = handle(async ({ request }) => {
  const form = await request.formData();
  const slug = text(form, "slug");
  const author = text(form, "author");
  const date = readDate(form);

  if (!FOLDER_PATTERN.test(slug)) {
    throw new FormError(
      "Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets."
    );
  }
  if (
    !/^[a-z0-9-]+$/.test(author) ||
    !(await exists(path.join(AUTHORS_DIR, `${author}.json`)))
  ) {
    throw new FormError("L'auteur sélectionné n'existe pas.");
  }

  const articleDir = path.join(ARTICLES_DIR, slug);
  if (await exists(path.join(articleDir, DELETED_MARKER))) {
    throw new FormError(
      `L'article « ${slug} » vient d'être supprimé. Redémarrez pnpm dev pour réutiliser cette adresse.`,
      409
    );
  }
  if (await exists(articleDir)) {
    throw new FormError(
      `Un article avec le slug « ${slug} » existe déjà.`,
      409
    );
  }

  const versions = readVersions(form);
  const cover = readCover(form);
  const coverName = cover && `cover.${cover.extension}`;

  await mkdir(articleDir, { recursive: true });
  if (cover && coverName) {
    await writeFile(
      path.join(articleDir, coverName),
      Buffer.from(await cover.file.arrayBuffer())
    );
  }
  for (const [lang, version] of versions) {
    await writeFile(
      path.join(articleDir, fileNameFor(lang)),
      buildMarkdown({
        ...version,
        date,
        lang,
        slug,
        authors: [author],
        cover: coverName && `./${coverName}`,
        extra: {},
      }),
      "utf-8"
    );
  }

  return json(
    {
      folder: `articles/${slug}`,
      links: articleLinks(slug, [...versions.keys()]),
    },
    201
  );
});

export const PUT = handle(async ({ request, url }) => {
  const folder = url.searchParams.get("folder") ?? "";
  if (!(await isValidFolder(folder))) {
    throw new FormError("Article introuvable.", 404);
  }
  const articleDir = path.join(ARTICLES_DIR, folder);

  const form = await request.formData();
  const date = readDate(form);
  const versions = readVersions(form);
  const cover = readCover(form);

  const existing = new Map<Lang, ArticleVersion>();
  for (const lang of LANGUAGES) {
    const version = await readArticleVersion(folder, lang);
    if (version) existing.set(lang, version);
  }
  const base = existing.get("fr") ?? existing.values().next().value;
  if (!base) throw new FormError("Article introuvable.", 404);

  // Removing a language would delete its file, which the running dev server
  // does not pick up on Windows (see DELETE below), so it is not offered here.
  for (const lang of existing.keys()) {
    if (!versions.has(lang)) {
      throw new FormError(
        lang === "en"
          ? "La version anglaise existe déjà : remplissez ses champs (elle ne peut pas être retirée ici)."
          : "La version française est obligatoire."
      );
    }
  }

  // A new cover gets a unique name: the dev server keeps importing the old
  // file until restart, so the old one is only listed for cleanup at startup.
  let newCover: string | undefined;
  if (cover) {
    newCover = `./cover-${Date.now()}.${cover.extension}`;
    await writeFile(
      path.join(articleDir, newCover),
      Buffer.from(await cover.file.arrayBuffer())
    );
    const oldCovers = new Set(
      [...existing.values()]
        .map(version => version.cover)
        .filter((file): file is string => !!file && file.startsWith("./"))
    );
    for (const oldCover of oldCovers) {
      await appendFile(
        path.join(articleDir, UNUSED_FILES_MARKER),
        `${path.basename(oldCover)}\n`,
        "utf-8"
      );
    }
  }

  for (const [lang, version] of versions) {
    const previous = existing.get(lang) ?? base;
    await writeFile(
      path.join(articleDir, fileNameFor(lang)),
      buildMarkdown({
        ...version,
        date,
        lang,
        slug: base.slug,
        authors: previous.authors.length ? previous.authors : base.authors,
        cover: newCover ?? previous.cover,
        extra: existing.has(lang) ? previous.extra : {},
      }),
      "utf-8"
    );
  }

  return json({
    folder: `articles/${folder}`,
    links: articleLinks(base.slug, [...versions.keys()]),
  });
});

const markAsDeletedDraft = (content: string) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return content;
  const frontmatter = match[1]
    .split(/\r?\n/)
    .filter(line => !/^(ogImage|draft):/.test(line));
  return `---\n${[...frontmatter, "draft: true"].join("\n")}\n---\n`;
};

export const DELETE = handle(async ({ url }) => {
  const folder = url.searchParams.get("folder") ?? "";
  if (!(await isValidFolder(folder))) {
    throw new FormError("Article introuvable.", 404);
  }
  const articleDir = path.join(ARTICLES_DIR, folder);

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

  return json({ trash: `.trash/articles/${trashName}` });
});
