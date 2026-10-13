# Silicon Valley GBC — independent redesign concept

A new, local, static Astro/TypeScript website. No connection to WordPress and no deployment performed. The official business identity is preserved; the footer clearly identifies the independent concept.

## Run locally

Requires Node 22.12+ or a supported newer release.

```powershell
npm ci
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run dev
```

Open the URL Astro prints. Production preview: `npm run build`, then `npm run preview`.

## Completed pages

22 HTML pages: home, about, service overview, ten service detail pages, project collection, three project/reference detail pages, process, testimonials, service areas, contact, and privacy. Sitemap and robots endpoints are also generated. Every internal navigation link points to the new site.

Service detail routes: general-contracting, custom-home-construction, kitchen-remodeling, bathroom-remodeling, whole-home-remodeling, roofing, historic-renovation, home-additions, adu-construction, commercial-construction.

## Design and interactions

- Unaltered official PNG in the desktop header, mobile menu, footer, and short opening sequence. The original logo has a light contrasting surface.
- GSAP first-visit drafting-line preloader, masked headline, image scale/parallax, scroll-controlled image masks, progressive process lines, menu choreography, and footer movement.
- Lenis on desktop with fine-pointer input, synchronized to GSAP; native scrolling on touch and reduced-motion devices. Astro ClientRouter handles local transitions. Animation contexts, event listeners, ticker subscriptions, and scene resources are cleaned on navigation.
- Lazy-loaded Three.js perspective scene: real box geometry, edge geometry, grid, directional lighting, material progression, scroll-linked build stages, keyboard-accessible build slider, and pointer rotation. Rendering occurs on change, avoiding a permanent animation loop. Mobile, reduced motion, and WebGL failure retain a labeled static reference.
- Comparison range supports keyboard, mouse, and touch. It compares monochrome and color versions of the **same photograph**, and is explicitly a visual demonstration.
- Testimonial slider has explicit previous/next controls and live announcements. No autoplay.
- Contact form has accessible errors and produces a preview plus a `mailto:` link. It never claims delivery. No backend, analytics, or lead storage exists.

## Verification

```powershell
npm run build
npm run audit
node scripts/browser-check.mjs
```

Browser checks use installed Microsoft Edge through Playwright. Override `PREVIEW_URL` if preview uses a different port (default in the check script is 4322). Screenshots and the machine-readable report are in `qa/`. Tests check routes, image failures, overflow, mobile menu, Three.js, comparison, reviews, invalid and valid form behavior, reduced motion, and browser errors.

## GitHub Pages subpath

```powershell
$env:BASE_PATH='/silicon-valley/'
$env:SITE_URL='https://jay-rtl.github.io'
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run build
npm run audit
npm run preview
```

Open the printed preview URL plus `/silicon-valley/`. All assets, routes, and sitemap entries respect the configured base. The output is `dist/`. For a root site, clear `BASE_PATH` and set `SITE_URL` appropriately.

After explicit publishing authorization, upload `dist/` as a GitHub Pages artifact and deploy it with `actions/deploy-pages`, or commit **its contents** to a Pages publishing branch with an empty `.nojekyll` file. Configure Pages to use the selected Actions workflow or branch. The included GitHub Actions workflow builds, audits, and deploys pushes to main. GitHub Pages must use GitHub Actions as its source.

## Limits and production integration

Read [PROJECT-NOTES.md](PROJECT-NOTES.md) for exact sources and content provenance. License information is a published claim, not a live CSLB verification. No awards, statistics, new certifications, or review ratings were invented.

Photography from the original site has unverified project provenance and is labeled as reference imagery. The portfolio is an inspiration collection with real local detail pages, not a claim to completed company projects. Review excerpts are attributed to their source and not independently authenticated. Confirm company permission and photography rights before public commercial use.

The unsolicited concept intentionally uses `noindex, nofollow` and `robots.txt` disallow. A company-approved launch should revise these, establish the canonical domain, approve the privacy notice, and verify business facts.

Production form delivery requires a server-side endpoint or approved form provider, server validation, spam/rate protection, email credentials held on the server, a privacy/retention policy, and honest delivery/failure handling. Replace the draft action only after that integration is configured and tested.
