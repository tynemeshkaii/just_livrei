# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project

Single-file landing page for **Just Graphics** — a premium car decal studio in Dubai. The entire site lives in `index.html`. No build tools, no frameworks, no package.json.

## Dev Server

```bash
npx serve -p 3333 .
```

Then open `http://localhost:3333`. Configured in `.Codex/launch.json`.

## Architecture

Everything — HTML, CSS, and JS — is in one file (`index.html`). Structure:

1. `<head>` — meta, non-render-blocking font preloads (Inter + Playfair Display via `rel="preload" as="style" onload=...`), LCP image preload, DNS prefetch
2. Inline `<style>` — all CSS (~900 lines). Sections are delimited by `/* ─── N. NAME ─── */` comments
3. SVG sprite — `<svg style="display:none">` with `<symbol>` definitions (icons: `#i-wa`, `#i-ig`, `#i-fb`, `#i-left`, `#i-right`, `#i-compare`)
4. HTML sections in order: Nav → Hero → Statement → Details → Why Choose Us → Cases → Gallery → FAQ → Process → Footer → Floating WhatsApp button
5. `<script>` at bottom — deferred via `requestIdleCallback` (fallback: `setTimeout(200ms)`). Navbar scroll is the only immediately-bound listener

## Key CSS Conventions

- **Design tokens** in `:root` — always use variables, never raw hex/values in components
- **Font stack**: `--font` (Inter, sans) and `--font-serif` (Playfair Display, serif)
- **Gold gradient**: `var(--gold-grad)` = `linear-gradient(135deg, #C9A84C → #F0D98A → #C9A84C)`; applied via `background-clip: text` on `<em>` tags and decorative numbers
- **Scroll reveal**: `[data-animate]` + `.visible` class toggled by IntersectionObserver; stagger groups use `.stagger` + `.visible`
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` for scroll animations; `--t: 0.25s ease` for micro-interactions
- **Card texture**: `detail-card::before` and `choose-card::before` use pseudo-elements for shimmer/texture. Their children need `position: relative; z-index: 1` to sit above

## Images

All images are WebP only — the PNG/JPG originals were deleted. Files use spaces in names (e.g. `Ferrari после.webp`) — always quote paths in any shell commands.

LCP image (`Ferrari после.webp`) has `fetchpriority="high" loading="eager"`. All others use `loading="lazy" decoding="async"`.

## JavaScript Modules

All JS is inline, inside `initApp()` called via `requestIdleCallback`:
- **Navbar**: scroll listener bound immediately (outside `initApp`)
- **Gallery slider**: horizontal CSS scroll-snap; arrow buttons call `scrollBy`
- **Cases slider**: CSS `translateX` carousel with IntersectionObserver-gated auto-play (pauses when off-screen)
- **Before/After compare**: mouse + touch drag sets `clip-path: inset(...)` on the `.compare__after` element; hint animation runs once on first viewport entry
- **FAQ accordion**: `aria-expanded` + `max-height` transition on `.faq-a-wrap`
