# Neurovex Technologies — Codebase Audit

Audit du dépôt local, 28 septembre 2026. Périmètre : code et contenu versionnés, contrôles locaux. **Aucun changement au site.** Les appréciations visuelles et le fonctionnement des services externes restent à confirmer en navigateur et dans un environnement de recette.

## 1. Executive Summary

Le socle Astro 5, les pages principales FR/EN, les quatre services, les articles récents, le formulaire et les composants communs existent. `astro check` et ESLint passent. La dette majeure est le mélange entre le nouveau site d’agence et l’ancien produit GeeksBlaBla : routes podcast/chat/édition, endpoints facturables et contenu hérité restent présents. Le site présente les services mais pas de réalisations vérifiables ni de parcours « devis » structuré. Les témoignages sont anonymisés et doivent être validés comme authentiques. Le menu mobile est inaccessible au clavier avec sa case masquée. Des pages légales manquent. La production n'est pas validée : le build local échoue sur une requête Google Fonts durant la génération OG, et l'envoi Resend n'a pas été testé avec une configuration réelle.

**Priorités :** sécuriser ou retirer les fonctions héritées exposées ; confirmer le build reproductible ; valider formulaire, preuves commerciales et conformité ; puis polir les parcours et la performance. Aucun incident de production réel n'a été confirmé par cet audit local.

## 2. Current Architecture

- **Stack :** Astro `^5.13.3`, TypeScript, composants `.astro`, quelques îlots React 18, Tailwind 3 + CSS global (`src/global.css`, `tailwind.config.cjs`), astro-icon, Rive, MDX. Gestionnaire : pnpm et `pnpm-lock.yaml`.
- **Rendu :** `output: "static"` avec adapter Vercel et routes `prerender = false` ; `wrangler.jsonc` et script `deploy` Cloudflare subsistent. Déploiement cible à clarifier.
- **Structure :** `src/pages` routes FR et `/en`, `src/components`, `src/i18n`, `src/content/config.ts` (blog, podcast, gallery, team, authors, testimonials), `src/actions`, `src/pages/api`, `articles/`, `episodes/`, `public/`.
- **Actifs :** images Astro, SVG, icônes locales, 4 vidéos MP4 de service, animations Rive, GIF de héros de 6,5 Mo, vidéo contact ; Google Fonts (Space Grotesk, IBM Plex Mono, Poppins) et polices locales CommitMono.
- **Services tiers :** Resend, PostHog, Google Fonts, unpkg/Rive ; code hérité Notion, Cloudinary, YouTube/Supadata, OpenAI/OpenRouter, Chroma, Giscus et Pagefind. Variables déclarées dans `astro.config.mjs` ; `.env.example` documente leurs noms. Aucune valeur secrète reproduite ici.
- **SEO :** `@astrolib/seo`, canonique dans le layout, sitemap Astro filtré, `public/robots.txt`, RSS, OG générique ou par article. Pas de schéma JSON-LD ni de `hreflang` repéré. `SITE.website` pointe vers `https://neurovex.ma/`.
- **Contrôles exécutés :** commandes `pnpm check`, `pnpm lint:ci`, `pnpm build` bloquées avant exécution par la tentative de synchronisation pnpm hors réseau ; sans modifier les dépendances, binaires locaux : `astro check` = 0 erreur, 0 warning, 9 hints ; ESLint = succès ; `astro build` = échec à `/blog/.../index.png` (`ENOTFOUND fonts.googleapis.com` dans `src/lib/load-fonts.ts`). L'avertissement Browserslist signale une base caniuse-lite de 17 mois. Pas de suite générale de tests. `validate-episode` concerne seulement les épisodes. Le serveur et les soumissions réelles n'ont pas été exercés.

## 3. Route Inventory

Statut fondé sur code et contenu ; « Broken » signale un problème avéré dans le parcours ou la génération, non une preuve d'indisponibilité en ligne.

| Route                                                         | Status       | Purpose                        | Issues                                                                             | Priority |
| ------------------------------------------------------------- | ------------ | ------------------------------ | ---------------------------------------------------------------------------------- | -------- |
| `/`, `/en/`                                                   | Needs polish | Accueil agence                 | CTA masqués sous `md`; GIF lourd; titres desktop hors `h1`                         | P1       |
| `/services`, `/en/services`                                   | Needs polish | Quatre services                | Vidéos en autoplay, absence de pages détaillées et de preuve par service           | P2       |
| `/about`, `/en/about`                                         | Incomplete   | Présentation/méthode           | Récit et process, aucune équipe Neurovex affichée malgré collection `team` héritée | P1       |
| `/contact`, `/en/contact`                                     | Needs polish | Contact                        | Formulaire présent ; livraison Resend et anti-abus à vérifier                      | P1       |
| `/blog`, `/en/blog`                                           | Needs polish | Ressources                     | Titres/meta peu spécifiques ; dépend de contenu publié                             | P2       |
| `/blog/[slug]`, `/en/blog/[slug]`                             | Needs polish | Articles + pagination          | OG dynamique dépend du réseau ; pagination à valider ; pas de `hreflang`           | P1       |
| `/blog/[slug]/index.png`                                      | Broken       | OG image générée               | Build local échoue sur Google Fonts                                                | P1       |
| `/404`, `/en/404`                                             | Needs polish | Erreur                         | Pages existantes, style et comportement HTTP à vérifier sur hébergeur              | P2       |
| `/podcast`, `/podcast/[...slug]`                              | Incomplete   | Ancien podcast                 | Branding GeeksBlaBla, hors offre agence                                            | P1       |
| `/podcast/planning`, `/podcast/new`, `/podcast/new/[...slug]` | Incomplete   | Outils éditoriaux hérités      | Accès/usage à décider, actions externes                                            | P0       |
| `/chat`, `/api/chat`                                          | Incomplete   | Chat ancien podcast            | API IA facturable, validation/limitation insuffisantes                             | P0       |
| `/api/episode-analysis`, `/api/youtube-subtitle`              | Incomplete   | Analyse/transcription héritées | Routes publiques utilisant services payants, erreurs détaillées                    | P0       |
| `/links`, `/brand`                                            | Incomplete   | Pages héritées                 | GeeksBlaBla visible ; filtre sitemap seul                                          | P1       |
| `/rss.xml`                                                    | Needs polish | Flux                           | TODO, inclut la collection brute sans filtre explicite de langue/brouillon         | P2       |
| `/facebook`, `/linkedin`, `/blabla/[...slug]`                 | Needs polish | Redirections                   | Générées depuis `src/redirects.ts`; tester sur hébergeur                           | P3       |
| `/privacy`, `/terms`, `/legal` et équivalents EN              | Missing      | Information juridique          | Aucune route trouvée                                                               | P1       |
| `/work`, `/case-studies`, `/quote`                            | Missing      | Références/devis               | À créer seulement avec cas réels et besoin commercial confirmé                     | P1       |

Les slugs publiés viennent de `articles/`; plusieurs anciens articles sont `draft: true`. Les routes dynamiques d'épisodes viennent de `episodes/` (238 fichiers repérés). La table regroupe ces instances, à valider par échantillonnage après build.

## 4. What Is Already Complete

Navigation principale bilingue, fiche des quatre services, contact et coordonnées, CTA du footer, page 404, données d'articles FR/EN, filtrage des brouillons dans les listes, contrôles Zod côté action contact, échappement HTML des champs dans le courriel, honeypot, état succès/erreur côté formulaire, canonique et sitemap de base. Ne pas recréer ces éléments ; les vérifier en conditions réelles.

## 5. Critical Issues

1. **P0 — Exposition d'outils hérités facturables.** `src/pages/api/chat.ts` accepte du JSON sans garde de taille, identité ni quota visible et appelle recherche vectorielle + OpenAI. `src/pages/api/episode-analysis.ts` et `youtube-subtitle.ts` utilisent des fournisseurs externes ; actions de création sous `src/actions/` et routes `/podcast/new` restent présentes. Risque de coûts/abus si déployées. Décision et correction **SENIOR**.
2. **P1 — Build non reproductible hors réseau.** `src/pages/blog/[slug]/index.png.ts` → `src/lib/load-fonts.ts` télécharge Google Fonts ; `astro build` a échoué avec `ENOTFOUND fonts.googleapis.com`. Prévoir police locale ou génération indépendante du réseau, puis rebâtir. Ceci est une limite observée localement, pas une panne prouvée en CI connectée.
3. **P1 — Branding hérité public.** `/links`, `/brand`, `/podcast`, `/chat` affichent GeeksBlaBla ; `astro.config.mjs` les exclut partiellement du sitemap mais ne les rend pas privées. Peut brouiller l'identité et indexation via liens directs.
4. **P1 — Parcours mobile.** `src/components/header.astro` masque `input[type=checkbox]` avec `hidden` et n'offre qu'un `label` pour ouvrir le menu. Commande non focalisable au clavier ; état non annoncé.
5. **P1 — Confiance et conformité.** `testimonials/data.json` contient citations sans nom de client ; leur provenance doit être confirmée. Aucune route juridique ni information de confidentialité/cookies repérée, tandis que `src/components/posthog.astro` charge PostHog en production.

## 6. UI/UX Findings

- Accueil : `src/components/home/hero.astro` cache **les deux** CTA sur mobile (`hidden md:flex`) ; le visiteur doit faire défiler ou ouvrir le menu. Le visuel GIF domine le premier écran.
- Le composant `home/projects.astro` affiche en réalité les services. Aucune réalisation client/case study dans la navigation ; la promesse de « projets » reste non démontrée.
- `/about` n'utilise pas `about/team.astro`; le fichier `team/team-members.json` appartient au contexte ancien. Ne pas l'exposer comme équipe Neurovex sans validation.
- `/services` est une longue liste unique. Chaque ancre sert de destination, mais pas de page individuelle : des pages séparées ne sont recommandées que si des détails et exemples uniques sont disponibles.
- `/contact` dispose de messages succès/erreur, mais aucune confirmation de livraison ou référence de demande côté visiteur.
- Style visible dans le code : cartes arrondies du contact et des services, blocs blog d'un autre style ; revue visuelle nécessaire pour juger l'écart réel.

## 7. Responsive Findings

- **Mobile :** CTA héros absents ; menu inaccessible au clavier ; témoignages à défilement horizontal sans boutons sur mobile (`src/components/home/testimonials.astro`). Tester découverte tactile.
- **Tablette (768–1024 px) :** navigation desktop activée dès `md`, avec logo, cinq liens et sélecteur de langue (`header.astro`) ; risque de manque de place, à mesurer en FR/EN.
- **Laptop/desktop :** animation typewriter et trois lignes mesurées par JS (`hero.astro`), possible débordement aux largeurs intermédiaires et textes EN ; à tester visuellement.
- **Grand écran :** conteneurs `main` bornés ; aucun débordement établi statiquement. Tester 320, 375, 768, 1024, 1440, 1920 px et zoom 200 %, en particulier formulaires, footer, vidéos et textes longs.

## 8. Content Findings

- `src/i18n/ui.ts` porte le contenu commercial bilingue ; les services et FAQ sont réels, mais les preuves concrètes (clients, métriques, livrables, périmètre géographique) ne sont pas étayées dans le code.
- Témoignages anonymes dans `testimonials/data.json` : valider autorisation, authenticité et attribution avant publication.
- `articles/` contient des articles Neurovex FR/EN et des brouillons GeeksBlaBla. Éviter toute publication accidentelle et valider les traductions.
- `/links`, `/brand`, `/chat`, `/podcast` conservent du texte GeeksBlaBla ; `package.json` garde le nom `geeksblabla-community`.
- Aucun contenu juridique visible. Aucun parcours carrière nécessairement pertinent à ce stade ; ne pas le créer sans offre réelle.

## 9. Conversion Findings

| Parcours                                    | État               | Friction                                                                                |
| ------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| Visiteur → Service → Confiance → Contact    | Possible           | Services et CTA existent ; preuves client faibles et non reliées aux services           |
| Visiteur → Portfolio → Case study → Contact | Impossible         | Portfolio et cas client absents                                                         |
| Visiteur → Accueil → Service → Devis        | Partiel            | Lien service présent, pas de demande de devis structurée ; CTA héros absents sur mobile |
| Visiteur → CTA → Formulaire → Succès        | Implémenté en code | Livraison Resend et expérience après erreur non testées                                 |

Le site répond globalement à « quoi » et « comment contacter » ; « pour qui précisément », « pourquoi nous choisir » et « quelles réalisations » restent insuffisamment prouvés.

## 10. SEO Findings

- Layout fournit titre, description par défaut, canonique et OG ; articles ont titre/description propres. Accueil partage le titre global, `/about` et `/blog` gardent la description par défaut ; améliorer les métadonnées page par page.
- Pas de `hreflang` ni Schema.org trouvés ; ajouter d'abord Organization/LocalBusiness seulement avec identité vérifiée, puis alternatives FR/EN.
- `robots.txt` autorise tout ; le sitemap filtre plusieurs pages héritées, mais un filtre sitemap n'est pas un `noindex`. Décider de leur suppression/redirect ou directives adaptées.
- `src/pages/rss.xml.js` prend toute la collection ; vérifier que les brouillons et liens EN ne fuitent pas dans le flux FR.
- `src/components/home/hero.astro` possède un `h1` mobile masqué sur desktop et des `p` visuellement titrés : sur desktop, aucun `h1` visible. Corriger la hiérarchie.
- Favicon présent. OG par défaut est `favicon.png`, peu adapté au partage. Pas de manifest identifié ; faible priorité sauf besoin PWA.
- Liens internes de blog localisés ; tests automatiques de liens et des slugs restent à faire après build. Ne pas affirmer des liens cassés sans crawl réussi.

## 11. Performance Findings

- `public/animations/anime-hands.gif` pèse 6,5 Mo et se charge `eager` sur l'accueil ; meilleur candidat pour conversion vidéo/format optimisé et poster.
- Les quatre vidéos de service et `contact.webm` sont en `autoplay`, `loop`, `preload="auto"` ; sur services, plusieurs peuvent charger simultanément. Ajouter chargement conditionnel et alternative mouvement réduit.
- Trois familles Google Fonts plus polices locales ; vérifier poids réellement utilisés et coût de connexion. La même dépendance réseau casse le build OG local.
- Page `/chat` hydrate React `client:load` et le build émet un chunk chat d'environ 239 Ko, justifié seulement si route conservée. Pages agence principales sont surtout statiques Astro.
- Scripts externes Rive via unpkg (`index`, `/en`, podcast) ; comparer à dépendance installée et vérifier intégrité/disponibilité. Pas de conclusion « dépendance inutilisée » sans analyse d'import complète.

## 12. Accessibility Findings

- Menu mobile : contrôle non focalisable, pas de `aria-expanded` ; problème concret (`header.astro`).
- Formulaire : labels présents, mais `#contact-error` et `#contact-success` n'ont pas de région `aria-live`/rôle statut ; l'annonce dynamique peut manquer au lecteur d'écran (`contact-card.astro`).
- Lang switch `<details>` est naturellement activable, mais `summary` supprime le contour (`outline-none`) sans style focus de remplacement (`lang-switch.astro`).
- Animation de fond du héros (`move-grid`) et vidéos autoplay doivent respecter `prefers-reduced-motion`; le héros traite certaines animations, pas tout le média.
- Images décoratives du logo ont `alt=""` avec lien nommé : correct. Audit complet des images et contrastes nécessite rendu visuel/outils navigateur.

## 13. Code Quality Findings

- Pages FR/EN dupliquées quasiment à l'identique (`src/pages` et `src/pages/en`) : risque de divergence lors de futures modifications.
- Deux systèmes coexistent : agence Neurovex et ancien podcast, avec contenu, composants, intégrations et redirections historiques. Toute suppression doit être précédée d'une décision produit et de vérification des liens entrants.
- `src/lib/notion/notion-mock.json` et `gallery-mock-data.json` sont des données de développement ; `src/content/config.ts` bascule vers le mock sans variable Cloudinary. Vérifier portée des pages qui l'utilisent.
- Marqueurs explicites : TODO dans `src/pages/rss.xml.js`, `src/lib/utils.ts`, `src/lib/podcast-utils.ts`; code commenté dans `astro.config.mjs` et podcast ; anciens actifs `*_old.riv`.
- `astro check` signale 9 hints : `returnValue` et `ViewTransitions` dépréciés, scripts implicites inline, variables/await inutiles. Aucun échec de typage/lint.
- `pnpm lint` modifie les fichiers ; pour l'audit seul `lint:ci`/binaire ESLint a été utilisé.

## 14. Security / Form Findings

- **Contact :** schéma Zod, honeypot et échappement HTML présents (`src/actions/submit-contact.ts`). Aucun quota ou limitation de fréquence visible ; honeypot seul n'arrête pas les abus. `from: site@neurovex.com` doit correspondre au domaine vérifié chez Resend ; tester en recette sans exposer la clé. L'interface utilise JS/Astro action ; le parcours sans JS n'a pas été validé.
- **API héritées :** `chat.ts` prend `messages` de `request.json()` puis accède à `messages[messages.length-1].parts` sans validation structurée ni limite ; renvoie parfois `error.message`. `youtube-subtitle.ts` renvoie le détail d'exception au client. `episode-analysis.ts` appelle un fournisseur payant. Exposition et coûts à traiter par un senior.
- **Secrets :** schéma Astro les définit côté serveur ; aucune valeur de clé reproduite. La clé PostHog côté client est un identifiant public, pas un secret. Vérifier la configuration de production et les permissions des intégrations.
- **Liens externes :** plusieurs ont `noopener noreferrer`; audit exhaustif des liens éditoriaux à faire lors du crawl. Pas de preuve de faille XSS dans le formulaire contact.

## 15. Missing or Unfinished Features

**À décider puis traiter :** ancienne surface podcast/chat/brand/links ; outils éditoriaux et endpoints associés ; anciens actifs. **Manque pertinent :** informations légales et vie privée, une preuve de réalisation réelle, qualification du devis, validation de livraison du formulaire, stratégie analytics/confidentialité. **Déjà présent :** FAQ, process, blog, coordonnées, bilingue, succès/erreur contact, 404. **Optionnel :** pages service séparées, équipe, carrières, secteurs, technologies et PWA, uniquement si contenu vérifié et utilité commerciale.

## 16. Recommended Improvements

### Required before production

Contrôler exposition des routes/actions héritées ; résoudre le build OG ; vérifier formulaire réel et domaine Resend ; rendre le menu mobile accessible ; publier pages juridiques validées ; confirmer la base légale et les réglages PostHog ; contrôler témoignages et branding ; effectuer recette FR/EN et responsive.

### Recommended after launch

Ajouter 1–2 cas clients documentés, parcours devis qualifiant, métadonnées locales et `hreflang`, optimiser GIF/vidéos, rendre le RSS propre, mesurer conversions.

### Optional / future

Pages dédiées par service, équipe, secteurs, carrières, manifest/PWA selon stratégie commerciale. Ne pas créer de faux cas ni de fausse équipe.

## 17. MASTER BACKLOG

Efforts indicatifs : XS <1 h ; S 1–3 h ; M demi-journée ; L ~1 jour ; XL plusieurs jours. P0 = risque critique ; P1 = fort ; P2 = moyen ; P3 = polish.

| ID      | Task                                                              | Problem                                       | Files/Pages                                               | Priority | Effort | Assignment      | Dependencies                 |
| ------- | ----------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------- | -------- | ------ | --------------- | ---------------------------- |
| NVX-001 | Décider et protéger/retirer les API et actions héritées           | Coûts et abus possibles                       | `src/pages/api`, `src/actions`, `/podcast/new`            | P0       | XL     | SENIOR          | Décision produit             |
| NVX-002 | Rendre le build OG indépendant du réseau                          | Build local échoué                            | `src/lib/load-fonts.ts`, OG route                         | P1       | M      | INTERN + REVIEW | Aucune                       |
| NVX-003 | Décider destination des routes GeeksBlaBla puis rediriger/retirer | Branding public incohérent                    | `/links`, `/brand`, `/podcast`, `/chat`                   | P1       | XL     | SENIOR          | Inventaire liens entrants    |
| NVX-004 | Rendre le menu mobile utilisable clavier/lecteur d'écran          | Checkbox cachée                               | `src/components/header.astro`                             | P1       | M      | INTERN + REVIEW | Aucune                       |
| NVX-005 | Montrer CTA principal sur mobile                                  | Conversion affaiblie                          | `src/components/home/hero.astro`                          | P1       | S      | INTERN          | Aucune                       |
| NVX-006 | Tester Resend de bout en bout et corriger la configuration        | Livraison non vérifiée                        | `submit-contact.ts`, `.env.example`, `/contact`           | P1       | M      | INTERN + REVIEW | Environnement recette        |
| NVX-007 | Valider provenance et attribution des témoignages                 | Preuve non vérifiée                           | `testimonials/data.json`                                  | P1       | M      | SENIOR          | Accord clients               |
| NVX-008 | Fournir contenu légal et privacy approuvés                        | Pages absentes, PostHog actif                 | `src/pages`, `posthog.astro`                              | P1       | XL     | SENIOR          | Conseil juridique            |
| NVX-009 | Créer preuve commerciale réelle et lien depuis services/accueil   | Portfolio absent                              | `src/components/home`, nouvelles routes                   | P1       | XL     | INTERN + REVIEW | Cas et autorisations fournis |
| NVX-010 | Adapter CTA/formulaire au devis qualifié                          | Contact générique                             | `/contact`, `contact-card.astro`                          | P2       | L      | INTERN + REVIEW | Critères commerciaux         |
| NVX-011 | Affiner titres/descriptions, OG, `hreflang`                       | Métadonnées génériques                        | `layout.astro`, pages FR/EN                               | P2       | L      | INTERN + REVIEW | Décision routes              |
| NVX-012 | Corriger hiérarchie H1 desktop accueil                            | H1 caché                                      | `home/hero.astro`                                         | P2       | S      | INTERN          | Aucune                       |
| NVX-013 | Optimiser GIF héros et chargement des vidéos                      | 6,5 Mo eager + autoplay                       | `home/hero.astro`, `services.astro`, `project-item.astro` | P2       | L      | INTERN + REVIEW | QA visuelle                  |
| NVX-014 | Ajouter annonce accessible des états du formulaire                | Messages non annoncés                         | `contact-card.astro`                                      | P2       | S      | INTERN          | Aucune                       |
| NVX-015 | Ajouter focus visible au sélecteur de langue                      | Outline supprimé                              | `lang-switch.astro`                                       | P2       | XS     | INTERN          | Aucune                       |
| NVX-016 | Auditer taille/quotas et réponses des API conservées              | Validation et erreurs fragiles                | `src/pages/api`                                           | P1       | XL     | SENIOR          | NVX-001                      |
| NVX-017 | Nettoyer RSS par langue et brouillon                              | Collection brute                              | `rss.xml.js`                                              | P2       | M      | INTERN + REVIEW | Aucune                       |
| NVX-018 | Vérifier et documenter déploiement cible                          | Vercel + Wrangler coexistent                  | `astro.config.mjs`, `wrangler.jsonc`, scripts             | P2       | M      | SENIOR          | Choix hébergeur              |
| NVX-019 | Résoudre hints Astro ciblés                                       | 9 indications                                 | fichiers listés §2/13                                     | P3       | M      | INTERN          | NVX-003                      |
| NVX-020 | Faire recette routes/liens/responsive/SEO                         | Pas de preuve navigateur                      | routes publiques FR/EN                                    | P1       | XL     | INTERN + REVIEW | NVX-002, 003                 |
| NVX-021 | Confirmer politique PostHog et consentement applicable            | Tracking production sans UI privacy repérée   | `posthog.astro`, `layout.astro`                           | P1       | L      | SENIOR          | NVX-008                      |
| NVX-022 | Décider du sort de l'équipe et des mocks hérités                  | Données ancien site                           | `team/`, `gallery-mock-data.json`                         | P2       | M      | SENIOR          | NVX-003                      |
| NVX-023 | Ajouter un fallback sans JS ou vérifier contrainte JS du contact  | Soumission uniquement interceptée côté client | `contact-card.astro`                                      | P2       | M      | INTERN + REVIEW | NVX-006                      |
| NVX-024 | Vérifier cohérence FR/EN et corriger textes/ancres                | Routes dupliquées et traduction               | `src/pages/en`, `src/i18n/ui.ts`                          | P2       | L      | INTERN          | NVX-020                      |

## 18. 3-WEEK INTERN PLAN

Plan conditionnel : senior règle/décide NVX-001/003/007/008/016/018/021/022 hors charge stagiaire. Si les contenus ou l'environnement de recette ne sont pas disponibles, remplacer la journée concernée par une tâche suivante indépendante ; ne pas inventer de références.

### Week 1 — Foundation & visible issues

- **Day 1 — NVX-020 (inventaire de recette), NVX-024 (repérage).** Livrable : matrice FR/EN, captures 320/768/1440. Validation : chaque route publique listée, défauts reproductibles.
- **Day 2 — NVX-004.** Livrable : menu clavier accessible. Validation : Tab, Entrée/Espace, fermeture, état annoncé, mobile.
- **Day 3 — NVX-005, NVX-012.** Livrable : CTA visibles mobile et `h1` cohérent. Validation : parcours accueil → contact à 320/375 px et hiérarchie d'en-têtes.
- **Day 4 — NVX-015, NVX-014, NVX-023 (analyse).** Livrable : focus/annonces et note sur fonctionnement sans JS. Validation : lecteur d'écran/Tab et soumission simulée.
- **Day 5 — NVX-002.** Livrable : génération OG sans dépendance réseau. Validation : build hors réseau, revue senior.

### Week 2 — Product quality & business experience

- **Day 6 — NVX-006.** Livrable : preuve de livraison en recette FR/EN et cas d'erreur. Validation : réception confirmée, aucune clé dans logs/rapport ; revue senior.
- **Day 7 — NVX-011 (inventaire titres/descriptions).** Livrable : matrice métadonnées par page. Validation : titres distincts et canoniques inspectés.
- **Day 8 — NVX-011 (implémentation).** Livrable : méta/alternates/OG corrigés. Validation : HTML construit et revue senior.
- **Day 9 — NVX-017.** Livrable : flux limité aux contenus publiés avec liens corrects. Validation : inspection XML FR/EN.
- **Day 10 — NVX-010 (si critères fournis), sinon NVX-024.** Livrable : champs de qualification ou corrections de traduction. Validation : parcours devis sans friction, revue senior si formulaire modifié.

### Week 3 — Production readiness

- **Day 11 — NVX-013 (héros).** Livrable : média optimisé. Validation : poids réseau réduit et rendu mobile/desktop équivalent.
- **Day 12 — NVX-013 (vidéos/services).** Livrable : chargement adapté et mouvement réduit. Validation : réseau/motion/interaction contrôlés.
- **Day 13 — NVX-009, uniquement avec cas client validé ; sinon NVX-024.** Livrable : une référence authentique ou revue éditoriale bilingue. Validation : faits/source/autorisation signés par senior.
- **Day 14 — NVX-019 et NVX-020.** Livrable : hints applicables résolus et recette finale. Validation : `astro check`, ESLint, build, parcours routes.
- **Day 15 — NVX-020, documentation de passage de relais.** Livrable : tableau des anomalies restantes, captures, résultats et risques. Validation : senior signe les points P0/P1 ; aucun lancement autonome par le stagiaire.

## 19. FINAL RELEASE CHECKLIST

- [ ] P0 API/actions héritées protégées, retirées ou explicitement assumées
- [ ] Build propre et reproductible ; `astro check`, ESLint, scripts pertinents passent
- [ ] Routes FR/EN, 404, pagination, RSS et redirections testés sur hébergeur choisi
- [ ] Menu/CTA/formulaire testés au clavier et sur 320/375/768/1024/1440/1920 px, zoom 200 %
- [ ] Contenus et traductions relus ; références clients et témoignages autorisés
- [ ] Titres, descriptions, canonique, OG, `hreflang`, sitemap, robots et liens contrôlés
- [ ] Images/vidéos mesurées, mouvement réduit respecté, pas d'erreur console bloquante
- [ ] Soumission Resend livrée et erreur testée sans divulgation de données
- [ ] PostHog, confidentialité, cookies et mentions légales approuvés
- [ ] Variables de production configurées côté serveur ; quotas/limites des services coûteux
- [ ] Déploiement/rollback et suivi des erreurs documentés

## 20. TOP 10 NEXT ACTIONS

1. Faire décider par un senior du sort des routes/actions/API podcast et IA (NVX-001/003).
2. Rendre le build OG indépendant de Google Fonts (NVX-002).
3. Valider la livraison réelle du formulaire Resend (NVX-006).
4. Corriger l'ouverture du menu mobile au clavier (NVX-004).
5. Montrer le CTA de contact sur mobile (NVX-005).
6. Obtenir des contenus légaux et une décision PostHog (NVX-008/021).
7. Vérifier authenticité et autorisation des témoignages (NVX-007).
8. Fournir au moins un cas client réel avant de créer un portfolio (NVX-009).
9. Optimiser le GIF de 6,5 Mo et le chargement des vidéos (NVX-013).
10. Exécuter une recette complète FR/EN sur le déploiement cible (NVX-020).
