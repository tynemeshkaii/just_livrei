# Reviews Section — Design Spec
_Just Graphics landing page · 2026-05-15_

## Summary

Add a **Client Reviews** section to `index.html` — a full-width slider with 5 testimonials. Each slide uses a split layout: car photo on the left, scrollable review text on the right. Placed immediately after the existing `#cases` section.

---

## Placement

**After** `</section>` closing tag of `#cases` (line ~1701), **before** the Gallery section.

Section alternates with `section--surface` background (same as Cases and Details) to maintain the existing dark/surface rhythm.

---

## Section Header

- **Eyebrow**: `CLIENT REVIEWS` (gold, uppercase, with gold line — uses existing `.s-eyebrow` class)
- **Title**: `Cars that became <em>iconic</em>` — `<em>` gets the gold gradient via existing `.s-title em` rule
- **Subtitle**: `Real stories from real people — and real cars.` — uses `.s-sub`
- All wrapped in `.reviews-header` with `margin-bottom: 36px`

---

## Slider Architecture

### Shell

```
.rev-outer        — overflow: hidden, clips the track
  .rev-track      — display: flex, transform: translateX(-N*100%) on slide change
    .rev-slide ×5 — min-width: 100%, the actual split card
```

### Each Slide (`.rev-slide`)

Two-column CSS grid:

| Left column (`.rev-photo`) | Right column (`.rev-text`) |
|---|---|
| ~55% width | ~45% width |
| Car photo as `position: absolute; inset: 0; object-fit: cover` | `background: var(--bg-panel)` (#10151d) |
| Gold pill tag with car model (top-left, z-index 2) | Large decorative `"` quote mark (72px, gold 18% opacity) |
| Gradient overlay on right edge (dark fade toward text panel) | Style tag pill (e.g. "Track / Racing") |
| Photo: `отзывы/[Car Model].webp` | Scrollable `.rev-body-wrap` with review text |
| | Gradient mask at bottom of scroll area |
| | Thin scroll hint indicator (↓ scroll for full review) |

**Minimum slide height**: `440px` desktop, auto on mobile (stacks vertically).

**Mobile breakpoint** (< 768px): grid becomes 1 column — photo on top (fixed ~220px height), text below (natural height, no scroll needed since text is fully visible).

### Photo overlay gradient

```css
background: linear-gradient(to right, rgba(5,5,5,0) 0%, rgba(5,5,5,0.18) 70%, rgba(5,5,5,0.52) 100%);
```

Blends photo softly into the text panel.

### Text panel scroll behaviour

- `overflow-y: auto` with `scrollbar-width: thin` and gold scrollbar thumb
- `mask-image: linear-gradient(to bottom, black 70%, transparent 100%)` fades out bottom
- Small scroll hint: gold `↓` icon + "scroll for full review" — visible only if content overflows

---

## The 5 Testimonials

| # | Car | Style Tag | Photo file |
|---|---|---|---|
| 1 | Porsche 911 GT3 | Track / Racing | `отзывы/Porsche 911 GT3.webp` |
| 2 | BMW M4 | Motorsport / Street | `отзывы/BMW M4.webp` |
| 3 | Nissan Patrol | Off-Road / Desert | `отзывы/Nissan Patrol.webp` |
| 4 | Toyota Supra | JDM / Art | `отзывы/Toyota Supra.webp` |
| 5 | Nissan 370Z | Drift / Creative | `отзывы/Nissan 370Z.webp` |

Full review texts are provided by the client in Russian and must be embedded in English (as supplied).

---

## Navigation Controls

Row below the slider (`margin-top: 28px`):

1. **Left arrow** — `.rev-arrow` button, 50×50px circle, same style as `.cases-arrow`
2. **Right arrow** — same
3. **Dot indicators** — `.rdot` × 5, active dot = gold + scale(1.5), same pattern as `.cdot`
4. **Counter** — `1 / 5` right-aligned, muted color

**No autoplay** — review text requires reading time.

---

## CSS

New section block in the inline `<style>`:

```css
/* ─── 10. REVIEWS ──────────────────────────── */
```

Class prefix: `rev-` to avoid collisions.

Token usage:
- `var(--bg-panel)` — text panel background
- `var(--gold)`, `var(--gold-d2)`, `var(--gold-grad)` — accents, style tag, quote mark
- `var(--border)`, `var(--bh)` — card border, arrow hover
- `var(--sub)` — review body text color
- `var(--t)` — micro-interaction transitions
- `var(--rlg)` — card border radius (16px)
- `var(--rxl)` — outer slide border radius (20px)

Scroll reveal: `.reviews-header` and `.rev-outer` get `data-animate` — picked up automatically by the existing `IntersectionObserver`.

---

## JavaScript

Inside `initApp()` (follows the exact same pattern as the Cases slider):

```js
// Rev slider
const revTrack = document.querySelector('.rev-track');
const revDots  = document.querySelectorAll('.rdot');
const revTotal = 5;
let revIdx = 0;

function revGo(n) {
  revIdx = (n + revTotal) % revTotal;
  revTrack.style.transform = `translateX(-${revIdx * 100}%)`;
  revDots.forEach((d, i) => d.classList.toggle('active', i === revIdx));
  document.getElementById('revCur').textContent = revIdx + 1;
}

document.getElementById('revPrev').addEventListener('click', () => revGo(revIdx - 1));
document.getElementById('revNext').addEventListener('click', () => revGo(revIdx + 1));
revDots.forEach((d, i) => d.addEventListener('click', () => revGo(i)));
```

---

## Image loading

- Slide 1 photo: `loading="eager"` (first visible slide)
- Slides 2–5 photos: `loading="lazy" decoding="async"`
- All paths must be quoted in HTML due to spaces in filenames (e.g. `src="отзывы/Porsche 911 GT3.webp"`)

---

## Accessibility

- `<section aria-labelledby="reviews-title">` wrapping the entire block
- Arrow buttons: `aria-label="Previous review"` / `aria-label="Next review"`
- Dots: `aria-label="Review N"` + `aria-pressed` toggled by JS
- Scroll area: `tabindex="0"` on `.rev-body-wrap` so keyboard users can scroll it

---

## Self-review

- No placeholders or TBDs remain
- Consistent with existing CSS token usage throughout
- Mobile behaviour specified (stacked column)
- Image lazy loading matches existing gallery pattern
- JS follows exact Cases slider pattern — minimal new code
- All text in English as required
