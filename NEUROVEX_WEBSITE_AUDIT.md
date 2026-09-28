# Neurovex Technologies website audit

**Audited:** 25 September 2026. **Primary target:** the public site at [neurovex.ma](https://neurovex.ma/). **Secondary target:** this local Astro workspace. The public site is a French, Next.js single-page studio site; the workspace is a separate Astro site about office IT, equipment and telecommunications. Recommendations below describe the **public site** unless marked “workspace.” This distinction matters before any implementation or deployment.

**Evidence and limits.** I inspected the public homepage, its expanded navigation, visible sections, DOM headings, metadata, schema, canonical and links; inspected local routes and content; and compared official agency sites and search documentation. The public navigation links point to homepage anchors, not separate pages. Direct requests for `/services`, `/contact`, `/en`, `robots.txt`, and sitemap URLs were inaccessible through the available browser/search tools, so their HTTP status and contents are **unverified**, not proven absent. No Lighthouse, CrUX, Search Console, analytics, lead data or mobile viewport measurement was available. Search intent conclusions are qualitative, based on observed competing pages, not volume estimates.

## A. Executive summary

The live site already has a distinctive visual system, a clear Marrakech location, a concise five-step process, direct email/phone access, and honest labeling of its four portfolio images as **demos, not Neurovex work**. The largest commercial problem is that the page demonstrates **no verified client delivery**: the “Sélection visuelle” area uses third-party demo imagery, while every service is an accordion on one URL. A prospect can admire the design but cannot assess a real challenge, scope, team, delivery or outcome. The poetic H1, “L’idée prend une autre dimension,” also delays the basic answer to what Neurovex builds.

**First move:** confirm whether Neurovex is primarily a digital product studio or an office IT/telecom supplier. The public site and this repository make conflicting promises. Then remove the demo work from any portfolio framing, publish the first verifiable project or clearly labeled internal build, and make the primary action a short project inquiry.

## B. Current website map

| Public URL/section | Current purpose | Finding |
|---|---|---|
| `/` hero | Positioning and introduction | One visible H1; service explanation appears below the artistic headline. |
| `/#services` | Five expertise accordions | Web/platforms, mobile, digital products, interface design, consulting/strategy; no independent service pages linked from navigation. |
| `/#work` | “Sélection visuelle” | Four clearly labeled demo visuals: FIND, DaoWay, Zelt, SCA. They are not Neurovex projects. |
| `/#about` | Point of view | Philosophy and principles, little verifiable team/company detail. |
| `/#process` | How work happens | Discover, define, design, build, launch. |
| `/#contact` | Lead entry | Email links, phone and Marrakech address; no on-site qualification form observed. |
| Footer | Location and basic contact | Address, phone, top link and copyright; limited utility. |

**Not discovered in public navigation:** individual service, case study, team, blog, legal, privacy, terms, pricing, French/English/Arabic alternative pages. This is a discovery statement, not proof that no unlinked URL exists. Public navigation uses anchors only. The local Astro workspace, by contrast, contains `/services`, `/about`, `/contact`, `/blog`, `/en/...`, podcast and other routes, but its offering and canonical base (`https://neurovex.com/`) conflict with the live positioning.

## C. What already works

- The public visual language is memorable: restrained cream background, large type, strong whitespace and an interactive sculptural motif.
- The intro sentence explicitly mentions web platforms, mobile apps and digital products; it supplies the clarity missing from the H1.
- The demo disclosure is unusually honest. Keep that honesty when replacing the visuals.
- The five-step process and location are already visible; both can be made more concrete without rebuilding the whole design.
- Public metadata includes one canonical, Open Graph image/title/description, and Organization, WebSite and Service JSON-LD. These are foundations to refine, not rebuild.
- Public email, phone and postal address are visible. The local workspace now uses `contact@neurovex.ma` too.

## D. Problems, with actions

| Page / section | Problem and why it matters | Recommended change | Priority |
|---|---|---|---|
| Public homepage / hero | “L’idée prend une autre dimension” communicates style before offer, audience and outcome. Buyers must read lower to learn what is sold. | Lead with the explicit web/mobile/product offer and Marrakech context; use the current artistic line as a supporting brand phrase. | High |
| Public homepage / hero CTAs | “Explorer le studio” goes to the demo portfolio; “Parlons de votre projet” opens email. Neither provides a strong proof-led next step. | Primary: “Parler de votre projet” to a project inquiry page/section. Secondary: “Voir nos réalisations” once genuine work exists. | High |
| Public homepage / `#work` | Third-party demo projects occupy the visual portfolio slot. Even with disclosure, this can cause mistaken attribution and erodes confidence when opened. | Replace with authorized real work or one clearly labeled internal product with actual screenshots and scope. Until then call the section “Explorations” and move it below capabilities. | Critical |
| Public homepage / `#services` | Five broad accordions describe categories but not deliverables, fit, constraints, proof or outcomes. They are hard to link to for search and sales. | Add overview plus focused landing pages only for proven offers. Each should name deliverables, who it serves, process, relevant evidence, FAQ and CTA. | High |
| Public homepage / `#about` | “La technologie s’efface. L’expérience reste” is a point of view, but does not identify accountable people or operating model. | Add actual founder/team names, roles, photos or credible bios if approved for publication; explain direct client contact and project ownership. | High |
| Public homepage / `#contact` | Mailto is quick but cannot collect enough context consistently; it can fail if the visitor has no configured email app. | Keep email/phone, add a small on-site inquiry form and an expected reply window only if the team can meet it. | High |
| Public homepage / footer | No discovered work/services/legal/privacy links; the footer is mostly decorative for task-oriented visitors. | Use a compact four-column footer: Explore, Company, Contact, Legal. Link only published pages. | Medium |
| Public homepage / SEO | Generic title “Agence digitale” and artistic H1 underspecify the commercial service and local market. One URL cannot cover several distinct intents well. | Specific title/H1, then a few substantive service pages. Avoid city/keyword variants with duplicated text. | High |
| Public homepage / semantic H1 | The interactive control contributes “Changer la dimension de la sculpture” and “01 / Cliquez” to extracted H1 text. Search and assistive parsing become noisy. | Keep the control outside the H1’s accessible text; test heading name and screen reader order. | Medium |
| Public site / performance | GSAP/Three.js interaction and visual effects may be costly on mobile; actual scores are unknown. | Measure real LCP, INP and CLS, JS bytes, media requests and CPU time before cutting effects. Reduce or defer only the assets that dominate traces. | Medium |
| Workspace / deployment | `src/config.ts` still points canonicals to `neurovex.com`; copy describes office IT/telecom; routes and build framework differ from the live site. Deploying it over the public site would change the business proposition. | Decide the source of truth, domain and business scope. Either migrate the live studio design into a dedicated codebase or deliberately rebrand the Astro site. Do not merge both offers casually. | Critical |

## E. Missing elements

| Missing element | Why Neurovex needs it | Location | Priority |
|---|---|---|---|
| One verifiable project or internal product story | Proves execution beyond concept imagery | Home teaser + `/work/...` | Critical |
| Named accountable people | Makes an unfamiliar agency credible | `/about` + short home strip | High |
| Project inquiry with confirmation | Captures and routes qualified leads reliably | `/contact` | High |
| Focused service detail | Answers scope/fit questions and supports search | `/services/...` | High |
| Clear engagement model | Explains discovery, approvals, handover and support | Service pages + process | Medium |
| Legal notice and privacy policy | Clarifies operator and data handling, especially once form/analytics are used | Footer | High |
| Credible technology proof | Shows actual implementation capability | Case studies + selective capability block | Medium |
| Measurement | Reveals which page/CTA produces qualified leads | Analytics/Search Console/CRM | Medium |

## F. Recommended services architecture

Keep one studio promise: **design and engineering for digital products**. Start with three commercial pillars that match live copy: **web platforms**, **mobile apps**, and **product design/technical discovery**. “Digital products” should be an umbrella category, not a near-duplicate fourth service. Make bespoke software, dashboards and integrations explicit under web platforms if the team has delivered them. Add AI and automation only after Neurovex can show a real implementation, security approach, and maintenance capability. Do not add generic growth marketing, social media, branding, commerce, cloud, SEO or every technology logo simply to appear full service.

Recommended first URLs: `/services/developpement-web`, `/services/applications-mobiles`, `/services/design-produit`. Consider `/services/logiciels-sur-mesure` when it has distinct examples and buyer intent; consider `/services/ia-automatisation` only with proof. Each service page needs: audience and problem, concrete deliverables, boundaries, work stages, technologies actually used, real example, FAQ from sales conversations, and one project CTA. A list of technologies alone is not a service page.

## G. Homepage architecture

1. **Hero:** concrete offer + who it helps + Marrakech and delivery reach; one primary inquiry CTA. Preserve the art as secondary visual identity.
2. **Proof strip:** one or two real project thumbnails, project types and client names only with permission; if none yet, explain a shipped internal product instead.
3. **Three capabilities:** web platforms, mobile, product design/discovery; each links to a detail page.
4. **Selected work:** challenge, deliverable and result/learning, with full case study links. No imported demos presented in this slot.
5. **How Neurovex works:** keep the five stages, add outputs and approval points for discovery, prototype, release and support.
6. **People and technical approach:** accountable lead and a concise, evidence-backed stack. The live “this site is built with” line proves only the website, not client delivery.
7. **Final CTA:** short project prompt plus email/phone; repeat only the same primary action.

Add testimonials and client logos only after written permission and identity verification. Avoid a large FAQ until there are real pre-sales questions.

## H. Navigation

**Desktop and mobile:** Accueil · Services · Réalisations · Studio · Contact, with “Parler de votre projet” as a clearly styled CTA if space allows. Under Services, show the three published pillars. Under Réalisations, show only actual work or internal products. The current full-screen menu is visually strong but hides basic destination labels behind “Menu”; a visible desktop link row would improve scanning. Mobile can retain the full-screen menu, with focus trap, Escape, meaningful close button and visible primary CTA verified in a real mobile audit.

## I. Portfolio and case studies

Use `/work` and `/work/<project>` for authorized client work or owned products. First publish even one credible example. Template: client/context and consent status → challenge → Neurovex role → constraints → strategy → design/architecture → actual interface/code visuals → technologies → launch/support → result. Mark unverified metrics “to collect”; never infer revenue or conversion from screenshots. If confidentiality prevents naming, write an anonymized case with client approval and a precise role/scope. Internal experiments belong in a separate, explicitly labeled “Lab” area. Do not reuse the current third-party demos as case studies.

## J. Conversion funnel

**Traffic → homepage/service → real proof → project CTA → short form/email → qualified conversation.** Current leaks: broad entrance message; service details trapped in accordions; work section is demos; CTAs rely on mailto; no structured lead context. Choose “Parler de votre projet” as the primary CTA. Form: name, work email, company (optional), service/problem selector, short project description; phone optional. Ask budget/timing only if they materially help triage and explain their optional status. Confirmation should give next steps and actual response expectation. Track CTA clicks, form start, submit, qualified lead and won project; do not optimize solely for raw form count.

## K. SEO and local search

**Verified on public homepage:** title, meta description, canonical `/`, OG image, `fr_FR`, Organization/WebSite/Service JSON-LD. **Unverified:** sitemap, robots, Google Business Profile, index coverage, Core Web Vitals, mobile scores. Verify these in Search Console and direct HTTP checks from the deployment environment. Do not claim missing files from tool access failures.

Qualitative SERP review shows Marrakech competitors with dedicated web/mobile development pages, so “développement web Marrakech” and “application mobile Marrakech” are plausible first commercial intents; [HauteDev](https://www.hautedev.com/agence-developpement-web) and [SYO WEB](https://syo-web.com/developpement-web) provide concrete examples. Validate demand and current queries in Search Console before expanding. Distinct pages for “logiciel sur mesure Maroc” or “AI development” need both evidence of capability and differentiated content. Publish service pages with unique title/H1/description/canonical, internal links from homepage and work, and descriptive project image alt text. Add true FR/EN alternate URLs and reciprocal `hreflang` only when fully translated pages exist; Arabic should follow only when content and RTL quality are ready. [Google's localized-page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions) supports this. [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) recommends canonical URLs and Search Console submission.

Keep Organization and WebSite schema. Add Service to visible service pages and BreadcrumbList only where breadcrumbs exist. Use Person only for publicly named staff. A local business subtype and full address should reflect the real legal/operating entity and public contact details. FAQPage markup is low priority; [Google limits FAQ rich results mainly to authoritative government and health sites](https://developers.google.com/search/blog/2023/08/howto-faq-changes). Do not add ratings, reviews or client claims that cannot be substantiated. Confirm Google Business Profile ownership and keep business name, address and phone consistent with the website; location pages are unnecessary unless distinct staffed locations exist.

For performance, collect Lighthouse plus field data by device. Prioritize the largest actual issue in each trace. [Google's Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals) defines LCP, INP and CLS thresholds; this audit does **not** assert current scores. Test reduced motion, keyboard paths, menu focus, image loading and the interactive H1. Audit visual media bytes and defer nonessential 3D/animation work on mobile if measurements justify it.

## L. UI/UX recommendations

Keep the editorial typography and whitespace. Make the first screen answer what Neurovex builds before the sculptural interaction. Use project visuals as proof rather than visual decoration. Provide obvious desktop navigation, generous button targets and strong keyboard focus. Check body contrast in pale sections, reduced-motion behavior, headings and menu/accordion semantics. Restrain animation to transitions that help orientation; avoid making core copy or CTA wait on entrance effects. The tech stack should be a short explanation of choices made in real projects, not a logo wall.

## M. Replacement copy (French)

| Location | Current → problem | Proposed |
|---|---|---|
| Hero H1 | “L’idée prend une autre dimension.” → evocative but unclear | **“Des plateformes web et applications mobiles conçues pour vos enjeux métier.”** |
| Hero supporting line | “...produits numériques qui font avancer vos idées.” → generic outcome | “De la définition du besoin à la mise en ligne, Neurovex réunit design produit et développement. Basés à Marrakech, nous travaillons avec des équipes qui ont besoin d’un produit utile, clair et maintenable.” |
| Hero CTA | “Explorer le studio” → lands on demos | “Parler de votre projet” (primary); “Voir nos réalisations” only after real work is published. |
| Services title | “De l’idée à l’usage.” → does not identify offer | “Web, mobile et design produit : les compétences pour lancer et faire évoluer votre produit.” |
| Web service | “Sites et plateformes pensés pour vos utilisateurs...” → no deliverable | “Sites métier, applications web et plateformes sur mesure. Nous cadrons les parcours, développons les fonctions prioritaires et préparons la maintenance.” |
| Work title | “La forme. Le fond.” → demos may read as portfolio | Until genuine work exists: “Explorations visuelles” + prominent “Concepts de démonstration, pas des projets clients.” |
| About | “La technologie s’efface. L’expérience reste.” → philosophy alone | “Une équipe à Marrakech qui prend en charge le cadrage, le design et le développement de votre produit.” Add actual names/roles. |
| Final CTA | “Une idée en tête ?” → broad | “Vous avez un projet web ou mobile à cadrer ? Décrivez votre besoin; nous vous répondrons avec les prochaines étapes.” |

These are proposed claims; confirm scope and delivery model before publication.

## N. Quick wins

1. Decide which codebase and business proposition controls `neurovex.ma`; fix the Astro workspace's `neurovex.com` canonical before any deployment.
2. Rewrite the live H1, title and hero support to state the offer; leave the current visual style intact.
3. Re-label/move demo imagery so no visitor can mistake it for completed work.
4. Make the primary CTA consistent and point it to a usable lead path with email fallback.
5. Add relevant navigation/footer links as the corresponding pages become real.
6. Verify robots/sitemap/index coverage in Search Console and gather baseline analytics/performance.

## O. High-impact work

- Publish the first two permissioned case studies with real screenshots and exact Neurovex role.
- Build three service pages with distinct buyer problems and proof.
- Add a named team/leadership page and a privacy/legal footer.
- Instrument lead quality by source and service, then revise copy based on qualified inquiries.
- Audit mobile and animation performance with real device and field measurements.

**Content strategy:** Start with a small set of buyer decision articles tied to proven services: how to scope a Marrakech/remote web platform, web app versus off-the-shelf software, mobile MVP scope and maintenance, or UX handoff to development. Each should answer procurement questions and link to a relevant service and case study. Do not publish AI/automation thought leadership until Neurovex can show actual delivery and limitations. Avoid general tech news, which attracts readers unlikely to buy.

## P. Proposed sitemap

```text
/
├── services/
│   ├── developpement-web/
│   ├── applications-mobiles/
│   └── design-produit/
├── work/
│   └── <verified-project>/
├── studio/
├── contact/
├── insights/                    (only after an editorial owner exists)
├── mentions-legales/
└── confidentialite/
```

Add `/en/...` only for completed translations; add AI, software or automation paths only after scope and proof are verified. Retain homepage anchors for navigation within `/`, but use real pages for service and work depth.

## Implementation roadmap

| Phase | Deliverables | Acceptance test |
|---|---|---|
| 0 — Source of truth | Confirm digital-studio versus IT/telecom positioning, live repository, domain/canonical and deployment ownership. | One approved offering and one deployment path; no accidental overwrite. |
| 1 — Critical | Clear hero and title, honest work framing, consistent project CTA, form/email path, legal/privacy basics. | A new visitor can name offer and next action in five seconds; no demo appears to be client work. |
| 2 — Services | Three detailed, evidence-backed pages and navigation. | Each page identifies buyer, deliverables, process, scope, proof and CTA. |
| 3 — Proof | Real or explicitly internal case studies, named team, optional permissioned testimonials. | Every claim and visual has owner approval and source. |
| 4 — SEO | Search Console baseline, verified sitemap/robots, internal linking, local NAP, intentional FR/EN pages. | Canonicals/indexability validated; commercial pages receive relevant impressions and qualified leads. |
| 5 — Experience | Measured performance/accessibility improvements and restrained visual polish. | Mobile and field metrics improve without reducing comprehension or conversions. |

## Benchmark evidence

- [Work & Co](https://www.work.co/) connects a specific digital-product proposition to visible recent work and practice areas.
- [Netguru](https://www.netguru.com/) links capabilities to case studies and named outcomes; its breadth reflects a much larger firm and should not be copied wholesale.
- [thoughtbot](https://thoughtbot.com/) and [Ramotion](https://www.ramotion.com/) provide useful examples of service/work separation and agency storytelling.
- Local [HauteDev](https://www.hautedev.com/) and [SYO WEB](https://syo-web.com/) show the level of Marrakech service-page specificity Neurovex competes against in search. Their claims are theirs, not evidence of Neurovex capability.

**Final priority test:** implement a recommendation only if it improves qualified lead generation, buyer understanding, verified trust, delivery proof or commercially relevant search visibility.
