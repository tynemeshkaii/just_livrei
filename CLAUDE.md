# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing page for **Just Graphics** — a premium car decal studio in Dubai (live domain: `just-graphics.art`). The marketing site is a single file, `index.html` (~5400 lines, no build tools, no frameworks, no package.json). A separate Cloudflare Worker in `worker/` handles lead submission + Meta CAPI. `privacy.html` is a standalone styled privacy policy page.

## Dev Server

```bash
npx serve -p 3333 .
```

Then open `http://localhost:3333`. Configured in `.claude/launch.json`.

## Git Helper

`Makefile` wraps the commit/push flow:

```bash
make push              # stage all, commit "update", push to main
make push m="message"  # custom commit message
make status            # git status
```

## Architecture — index.html

Everything (HTML, CSS, JS) is inline in `index.html`. Top-to-bottom:

1. `<head>` — meta, **Meta Pixel** (id `1759815045191457`) bootstrap + `external_id` from `localStorage` (`jg_extid`), Open Graph / Twitter cards, JSON-LD (`<script type="application/ld+json">`), font preloads (Inter + Playfair Display), LCP image preload, DNS prefetch
2. Single inline `<style>` (lines ~105–3176, ~3000 lines). Sections delimited by `/* ─── N. NAME ─── */` comments — Tokens, Reset, Container, Scroll reveal, Section, Buttons, then numbered: 1 NAV, 1b BURGER MENU, 2 HERO, 4 DETAILS CARDS, 5 WHY CHOOSE US, 6 GALLERY SLIDER, 7 CASES, 8 PROCESS, 9 FOOTER, plus Floating WhatsApp, Mid-page CTA, Standalone lead form, Sticky mobile CTA bar, FAQ, 10 REVIEWS
3. SVG sprite — `<svg style="display:none">` with `<symbol>` defs: `#i-wa`, `#i-ig`, `#i-fb`, `#i-left`, `#i-right`, `#i-compare`
4. HTML sections in DOM order: Nav (`.nav`) + mobile menu panel (`.menu-panel`) → Hero → Cases → Gallery → Reviews → Details → Why Us → CTA lead form (`#get-quote`) → FAQ → Process → Footer → catalog modal + floating WhatsApp + sticky mobile CTA
5. Two `<script>` tags: head Pixel bootstrap (step 1), and the main app script at the bottom

## Key CSS Conventions

- **Design tokens** in `:root` — always use variables, never raw hex/values in components
- **Font stack**: `--font` (Inter, sans) and `--font-serif` (Playfair Display, serif)
- **Gold gradient**: `var(--gold-grad)` = `linear-gradient(135deg, #C9A84C → #F0D98A → #C9A84C)`; applied via `background-clip: text` on `<em>` tags and decorative numbers
- **Scroll reveal**: `[data-animate]` + `.visible` class toggled by IntersectionObserver; stagger groups use `.stagger` + `.visible`
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` for scroll animations; `--t: 0.25s ease` for micro-interactions
- **Card texture**: `detail-card::before` and `choose-card::before` use pseudo-elements for shimmer/texture. Their children need `position: relative; z-index: 1` to sit above

## JavaScript Modules

Navbar scroll + scroll progress and the burger menu are bound **immediately**. Everything else lives in `initApp()`, run via `requestIdleCallback` (fallback `setTimeout(200ms)`). Modules (in order):

- **UTM params** — captured from URL, sent with leads
- **Meta cookies helper** — reads `fbc` / `fbp` cookies for CAPI match quality
- **Number counters** — animated stats
- **Scroll reveal** — IntersectionObserver for `[data-animate]` and `.stagger`
- **Gallery filter tabs + slider** — `#g-track` horizontal scroll; `#g-prev`/`#g-next` arrows call `scrollBy`, step = card width + 14px gap; per-view count is responsive (3/2/1)
- **Catalog modal** — `#catalog-modal` full catalog with filters, focus trap; opened by `#g-viewall`; contains an inline lead form panel
- **Cases slider** — `translateX` carousel, IntersectionObserver-gated auto-play (pauses off-screen), touch swipe
- **Reviews slider** — carousel with expand/collapse review panel, keyboard nav, touch swipe
- **Before/After compare** — mouse + touch drag sets `clip-path: inset(...)` on `.compare__after`; one-time hint nudge on viewport entry
- **FAQ accordion** — `aria-expanded` + `max-height` transition on `.faq-a-wrap`
- **Page lead form** + **Gallery standalone lead form** — POST to the Worker (see below)
- **Sticky mobile CTA bar**
- **Data-event Pixel helper** — fires Meta events with `eventID` (for pixel/CAPI dedup) and `external_id`

## Lead Submission — Cloudflare Worker (`worker/`)

`worker/src/index.js` (deployed as `just-graphics-leads`, fronted at `https://leads.just-graphics.art/submit`). The site POSTs JSON; the Worker:

- **`event: 'WhatsAppClick'`** → fires Meta CAPI `Contact` event only
- **Lead payload** (`name`, `phone`, `car`, `livery`, `source`, `utm`, plus `fbc`/`fbp`/`externalId`/`eventID`) → in parallel (`Promise.allSettled`): creates a **Bitrix24 CRM lead** (`crm.lead.add`, maps UTM fields) and fires Meta CAPI `Lead`. `name`+`phone` required.
- Meta CAPI: hashes `ph`/`fn`/`external_id` with SHA-256, passes through `fbc`/`fbp`/`event_id` for pixel dedup, sends to Graph API v21.0.

Config in `worker/wrangler.toml` — `[vars]` `PIXEL_ID` + `BITRIX_URL`; `META_CAPI_TOKEN` is a secret (`wrangler secret put META_CAPI_TOKEN`). CORS is locked to `https://just-graphics.art`. Deploy with `wrangler deploy` from `worker/`.

## Images

All images are WebP only — PNG/JPG originals were deleted. Many files use spaces and Cyrillic in names (e.g. `Ferrari после.webp`) — **always quote paths** in shell commands. Image folders: root before/after pairs (`*до.webp` / `*после.webp`), `gallery/` (numbered `1.webp`…), `отзывы/` (review car photos).

LCP image (`Ferrari после.webp`) has `fetchpriority="high" loading="eager"`. All others use `loading="lazy" decoding="async"`.

## Note on AGENTS.md

`AGENTS.md` is a Codex-targeted copy of an older version of this file and is partially stale (mentions `.Codex/launch.json`, "~900 lines" CSS). Treat **this file** as the source of truth; update `AGENTS.md` to match if you change project structure.
