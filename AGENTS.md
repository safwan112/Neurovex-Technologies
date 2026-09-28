# Repository Guidelines

## Project Structure & Module Organization

This is an Astro site. Routes live in `src/pages/`, including English pages under `src/pages/en/` and API endpoints under `src/pages/api/`. Reusable Astro and React UI lives in `src/components/`; content schemas are in `src/content/`, translations in `src/i18n/`, and imported images in `src/assets/`. Static files belong in `public/`. Editorial data is organized in top-level `articles/`, `episodes/`, `authors/`, `team/`, and `testimonials/`. GitHub workflows and content-validation scripts live in `.github/`.

## Build, Test, and Development Commands

Use pnpm and keep `pnpm-lock.yaml` in sync with dependency changes.

- `pnpm install` installs dependencies.
- `pnpm dev` starts the local site at `localhost:4321`.
- `pnpm check` runs Astro's type and content checks.
- `pnpm lint:ci` runs ESLint without changing files; `pnpm lint` formats and fixes files in place.
- `pnpm build` creates the production site in `dist/`; `pnpm preview` serves that build locally.
- `pnpm validate-episode` validates episode Markdown.

## Coding Style & Naming Conventions

Follow `.prettierrc`: two-space indentation, 80-character print width, semicolons, double quotes, and LF line endings. Prettier also formats Astro files and sorts Tailwind classes. ESLint enforces kebab-case filenames; use names such as `episode-card.astro` and `chat-interface.tsx`. Keep page-specific code near its route and shared UI in `src/components/`. Run `pnpm lint` before committing formatting changes.

## Testing Guidelines

There is no general unit or end-to-end test command in `package.json`. For code changes, run `pnpm check`, `pnpm lint:ci`, and `pnpm build`; these match the main CI checks. For episode edits, run `pnpm validate-episode` and review the episode-validation workflow results. Check affected routes manually with `pnpm dev` or `pnpm preview`, especially localized pages and API behavior.

## Commit & Pull Request Guidelines

Recent commits use short, plain-English change summaries (for example, `new animation`); write a more specific imperative summary that names the affected feature. Keep PRs focused, describe the change and verification commands, and link a related issue when one exists. Include screenshots for visible UI changes. Do not commit secrets: use `.env.example` to identify local configuration and keep real values in an ignored `.env` file.
