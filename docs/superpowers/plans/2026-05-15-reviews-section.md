# Reviews Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 5-slide Client Reviews section to `index.html`, placed after `#cases`, using a split layout (photo left / scrollable text right) with arrow + dot navigation.

**Architecture:** All code lives in the single `index.html` file — CSS in the inline `<style>` block, HTML between the Cases `</section>` and the Mid-page CTA `<div>`, JavaScript inside the existing `initApp()` function. The slider follows the identical IIFE pattern already used for the Cases slider.

**Tech Stack:** Vanilla HTML/CSS/JS. No build tools. Dev server: `npx serve -p 3333 .`

---

## File Map

| File | Change |
|---|---|
| `index.html` | Insert CSS block before `</style>` (line 1364) |
| `index.html` | Insert `<section id="reviews">` after line 1701 (`</section>` of `#cases`) |
| `index.html` | Insert reviews slider JS inside `initApp()` after the Cases slider IIFE (line ~2367) |

Photos already in place — `отзывы/Porsche 911 GT3.webp`, `отзывы/BMW M4.webp`, `отзывы/Nissan Patrol.webp`, `отзывы/Toyota Supra.webp`, `отзывы/Nissan 370Z.webp`.

---

### Task 1: CSS — Reviews section styles

**File:** `index.html` — inline `<style>` block

- [ ] **Step 1: Start the dev server** (keep it running for all tasks)

```bash
npx serve -p 3333 .
```

Open `http://localhost:3333` in the browser.

- [ ] **Step 2: Insert the CSS block** immediately before the closing `</style>` tag (line 1364, just before `  </style>`)

Add the following as a new block after the last existing CSS rule (`.faq-a-wrap.open` / `.faq-a p`):

```css
    /* ─── 10. REVIEWS ──────────────────────────── */
    .reviews-header { margin-bottom: 36px; }

    .rev-outer { position: relative; overflow: hidden; }
    .rev-track {
      display: flex;
      transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
    }

    .rev-slide {
      min-width: 100%;
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      border: 1px solid var(--border);
      border-radius: var(--rxl);
      overflow: hidden;
      min-height: 440px;
    }

    .rev-photo {
      position: relative;
      background: var(--bg-media);
      overflow: hidden;
    }
    .rev-photo img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }
    .rev-photo::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to right,
        rgba(5,5,5,0) 0%,
        rgba(5,5,5,0.18) 70%,
        rgba(5,5,5,0.52) 100%
      );
      pointer-events: none;
    }
    .rev-car-tag {
      position: absolute;
      top: 18px;
      left: 18px;
      z-index: 2;
      padding: 5px 14px;
      background: rgba(0,0,0,0.64);
      border: 1px solid rgba(196,164,93,0.32);
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.10em;
      text-transform: uppercase;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .rev-text {
      background: var(--bg-panel);
      padding: 40px 38px 36px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .rev-quote-mark {
      font-family: var(--font-serif);
      font-size: 72px;
      line-height: 0.7;
      color: rgba(196,164,93,0.18);
      margin-bottom: 18px;
      flex-shrink: 0;
      user-select: none;
    }
    .rev-style-tag {
      display: inline-block;
      align-self: flex-start;
      padding: 4px 12px;
      background: var(--gold-d2);
      border: 1px solid rgba(196,164,93,0.28);
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 20px;
      flex-shrink: 0;
    }
    .rev-body-wrap {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(196,164,93,0.22) transparent;
      mask-image: linear-gradient(to bottom, black 72%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 72%, transparent 100%);
      padding-right: 6px;
    }
    .rev-body-wrap::-webkit-scrollbar { width: 3px; }
    .rev-body-wrap::-webkit-scrollbar-track { background: transparent; }
    .rev-body-wrap::-webkit-scrollbar-thumb { background: rgba(196,164,93,0.22); border-radius: 2px; }
    .rev-body {
      font-size: 15px;
      color: var(--sub);
      line-height: 1.85;
      font-style: italic;
    }
    .rev-scroll-hint {
      flex-shrink: 0;
      margin-top: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: rgba(196,164,93,0.50);
    }

    .rev-controls {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 28px;
    }
    .rev-arrow {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--t);
      flex-shrink: 0;
    }
    .rev-arrow:hover { border-color: var(--gold); background: var(--gold-d2); color: var(--gold); }
    .rev-dots { display: flex; gap: 8px; align-items: center; }
    .rdot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      border: none;
      cursor: pointer;
      transition: background var(--t), transform var(--t);
    }
    .rdot.active { background: var(--gold); transform: scale(1.5); }
    .rev-counter {
      margin-left: auto;
      font-size: 13px;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }
    .rev-counter strong { color: var(--sub); font-weight: 600; }

    @media (max-width: 767px) {
      .rev-slide { grid-template-columns: 1fr; min-height: auto; }
      .rev-photo { height: 220px; }
      .rev-photo::after {
        background: linear-gradient(to bottom, rgba(5,5,5,0) 50%, rgba(5,5,5,0.52) 100%);
      }
      .rev-body-wrap { mask-image: none; -webkit-mask-image: none; overflow-y: visible; }
      .rev-text { padding: 28px 24px 28px; }
      .rev-scroll-hint { display: none; }
    }
```

- [ ] **Step 3: Verify CSS loaded** — refresh the browser. No visible change yet (the HTML doesn't exist), but DevTools → Elements → `<style>` should contain `.rev-slide`. Confirm no parse errors in the console.

---

### Task 2: HTML — Reviews section markup

**File:** `index.html` — between the `</section>` of `#cases` (line 1701) and the `<!-- 6.5. MID-PAGE CTA -->` comment (line 1704)

- [ ] **Step 4: Insert the section HTML** between lines 1701 and 1704 (after `</section>` of Cases, before `<!-- 6.5. MID-PAGE CTA -->`):

```html

<!-- ══════════════════════════════════════════
     7.5. REVIEWS
══════════════════════════════════════════ -->
<section class="section section--surface" id="reviews" aria-labelledby="reviews-title">
  <div class="wrap">
    <div class="reviews-header">
      <p class="s-eyebrow" data-animate>Client Reviews</p>
      <h2 class="s-title" id="reviews-title" data-animate data-animate-delay="1">Cars that became <em>iconic</em></h2>
      <p class="s-sub" data-animate data-animate-delay="2">Real stories from real people — and real cars.</p>
    </div>

    <div class="rev-outer" role="region" aria-label="Client reviews" aria-roledescription="carousel" data-animate data-animate-delay="3">
      <div class="rev-track" id="rev-track">

        <!-- Review 1: Porsche 911 GT3 -->
        <article class="rev-slide" role="group" aria-roledescription="slide" aria-label="Review 1 of 5: Porsche 911 GT3">
          <div class="rev-photo">
            <img src="отзывы/Porsche 911 GT3.webp" alt="Porsche 911 GT3 with custom racing livery by Just Graphics" loading="eager" decoding="async">
            <span class="rev-car-tag">Porsche 911 GT3</span>
          </div>
          <div class="rev-text">
            <div class="rev-quote-mark" aria-hidden="true">"</div>
            <span class="rev-style-tag">Track / Racing</span>
            <div class="rev-body-wrap" tabindex="0">
              <p class="rev-body">I didn't want a standard track livery with a number on the door and a couple of logos. The GT3 is a serious car in its own right, and I wanted to add some excitement without making it look childish.<br><br>The guys proposed not just a racing scheme, but a full-fledged visual identity: sharp lines, bold accents, graphics that follow the contours of the body.<br><br>What I liked most was that the car started to look like a design project, not just a set of stickers slapped on before a track day. In photos and videos, it now grabs your attention right away.</p>
            </div>
            <div class="rev-scroll-hint" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              scroll for full review
            </div>
          </div>
        </article>

        <!-- Review 2: BMW M4 -->
        <article class="rev-slide" role="group" aria-roledescription="slide" aria-label="Review 2 of 5: BMW M4">
          <div class="rev-photo">
            <img src="отзывы/BMW M4.webp" alt="BMW M4 with motorsport livery by Just Graphics" loading="lazy" decoding="async">
            <span class="rev-car-tag">BMW M4</span>
          </div>
          <div class="rev-text">
            <div class="rev-quote-mark" aria-hidden="true">"</div>
            <span class="rev-style-tag">Motorsport / Street</span>
            <div class="rev-body-wrap" tabindex="0">
              <p class="rev-body">I came in with a request: I wanted something in the spirit of M Motorsport, but not a boring standard livery. I wanted color, movement, and aggression — I wanted the M4 to look not just fast, but alive.<br><br>I really liked that the design isn't just stuck on top of the body, but seems to extend the car's lines.<br><br>What I liked: the car stands out even among other M models; it looks much more powerful in photos; it doesn't feel like cheap tuning.</p>
            </div>
            <div class="rev-scroll-hint" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              scroll for full review
            </div>
          </div>
        </article>

        <!-- Review 3: Nissan Patrol -->
        <article class="rev-slide" role="group" aria-roledescription="slide" aria-label="Review 3 of 5: Nissan Patrol">
          <div class="rev-photo">
            <img src="отзывы/Nissan Patrol.webp" alt="Nissan Patrol with off-road desert livery by Just Graphics" loading="lazy" decoding="async">
            <span class="rev-car-tag">Nissan Patrol</span>
          </div>
          <div class="rev-text">
            <div class="rev-quote-mark" aria-hidden="true">"</div>
            <span class="rev-style-tag">Off-Road / Desert</span>
            <div class="rev-body-wrap" tabindex="0">
              <p class="rev-body">My Patrol isn't just for show. It goes out into the desert, to meetups, and to off-road events, and I wanted it to look like it belongs there. Not just a big white SUV, but a desert build.<br><br>We added off-road graphics: aggressive side elements.<br><br>I liked that the design turned out masculine and functional-looking. The Patrol started to look wider, meaner, and more prepared.</p>
            </div>
            <div class="rev-scroll-hint" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              scroll for full review
            </div>
          </div>
        </article>

        <!-- Review 4: Toyota Supra -->
        <article class="rev-slide" role="group" aria-roledescription="slide" aria-label="Review 4 of 5: Toyota Supra">
          <div class="rev-photo">
            <img src="отзывы/Toyota Supra.webp" alt="Toyota Supra with JDM art livery by Just Graphics" loading="lazy" decoding="async">
            <span class="rev-car-tag">Toyota Supra</span>
          </div>
          <div class="rev-text">
            <div class="rev-quote-mark" aria-hidden="true">"</div>
            <span class="rev-style-tag">JDM / Art</span>
            <div class="rev-body-wrap" tabindex="0">
              <p class="rev-body">The Supra calls for a bold design. I didn't want just stripes or a number on the door — that would have been too predictable. I wanted something closer to JDM/drift culture: color, energy, sharp lines, so the car would look like a character from a video game or music video.<br><br>The guys created a very bold livery with bright graphic accents, sharp lines, and contrast along the sides. I especially liked that the design isn't symmetrical or boring — it moves with the car.<br><br>Before this, the Supra was beautiful but ordinary. After the livery, it became the center of attention.</p>
            </div>
            <div class="rev-scroll-hint" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              scroll for full review
            </div>
          </div>
        </article>

        <!-- Review 5: Nissan 370Z -->
        <article class="rev-slide" role="group" aria-roledescription="slide" aria-label="Review 5 of 5: Nissan 370Z">
          <div class="rev-photo">
            <img src="отзывы/Nissan 370Z.webp" alt="Nissan 370Z with drift-inspired livery by Just Graphics" loading="lazy" decoding="async">
            <span class="rev-car-tag">Nissan 370Z</span>
          </div>
          <div class="rev-text">
            <div class="rev-quote-mark" aria-hidden="true">"</div>
            <span class="rev-style-tag">Drift / Creative</span>
            <div class="rev-body-wrap" tabindex="0">
              <p class="rev-body">I wanted to make it bolder, but not in a "stick everything on" kind of way. I showed some references from the drift scene, where there's a lot of color, sharp elements, and chaos — but in a good way.<br><br>In the end, we created a bright, creative livery: side graphics, sharp shapes. The car started to look more aggressive.<br><br>I liked that the design turned out to be not just a racing design, but specifically mine. It has a vibe to it, not just a number and sponsor zones.</p>
            </div>
            <div class="rev-scroll-hint" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              scroll for full review
            </div>
          </div>
        </article>

      </div><!-- /rev-track -->
    </div><!-- /rev-outer -->

    <div class="rev-controls">
      <button class="rev-arrow" id="rev-prev" aria-label="Previous review">
        <svg width="18" height="18" aria-hidden="true"><use href="#i-left"/></svg>
      </button>
      <button class="rev-arrow" id="rev-next" aria-label="Next review">
        <svg width="18" height="18" aria-hidden="true"><use href="#i-right"/></svg>
      </button>
      <div class="rev-dots" role="tablist" aria-label="Review indicators">
        <button class="rdot active" data-idx="0" role="tab" aria-selected="true"  aria-label="Review 1" aria-pressed="true"></button>
        <button class="rdot"        data-idx="1" role="tab" aria-selected="false" aria-label="Review 2" aria-pressed="false"></button>
        <button class="rdot"        data-idx="2" role="tab" aria-selected="false" aria-label="Review 3" aria-pressed="false"></button>
        <button class="rdot"        data-idx="3" role="tab" aria-selected="false" aria-label="Review 4" aria-pressed="false"></button>
        <button class="rdot"        data-idx="4" role="tab" aria-selected="false" aria-label="Review 5" aria-pressed="false"></button>
      </div>
      <div class="rev-counter" aria-live="polite" aria-atomic="true"><strong id="rev-cur">1</strong> / 5</div>
    </div>

  </div>
</section>
```

- [ ] **Step 5: Verify the section renders** — refresh `http://localhost:3333`, scroll past the Cases section. You should see:
  - Section header: "CLIENT REVIEWS" eyebrow + "Cars that became *iconic*" title
  - First slide visible: Porsche 911 GT3 photo on the left, review text on the right
  - Arrow buttons and 5 dots below

  **Expected:** Slide is visible and styled. Arrows do nothing yet (JS not added). Photos load from `отзывы/`. Console — no 404 errors for images.

---

### Task 3: JS — Reviews slider logic

**File:** `index.html` — inside `initApp()`, after the closing `})();` of the Cases slider (around line 2367)

- [ ] **Step 6: Insert the reviews slider JS** immediately after the `})();` that closes the Cases slider IIFE (after the line containing `});` / `})();` for the cases block, before the `/* ── Before/After comparison slider ─── */` comment):

```js
  /* ── Reviews slider ─────────────────────── */
  (function () {
    const track = document.getElementById('rev-track');
    const dots  = document.querySelectorAll('.rdot');
    const prev  = document.getElementById('rev-prev');
    const next  = document.getElementById('rev-next');
    const total = dots.length;
    let cur = 0;

    function go(idx) {
      cur = (idx + total) % total;
      track.style.willChange = 'transform';
      track.style.transform = `translateX(-${cur * 100}%)`;
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === cur);
        d.setAttribute('aria-selected', i === cur ? 'true' : 'false');
        d.setAttribute('aria-pressed',  i === cur ? 'true' : 'false');
      });
      document.getElementById('rev-cur').textContent = cur + 1;
      track.addEventListener('transitionend', () => { track.style.willChange = 'auto'; }, { once: true });
    }

    prev.addEventListener('click', () => go(cur - 1));
    next.addEventListener('click', () => go(cur + 1));
    dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.idx)));

    /* Keyboard navigation */
    const region = track.closest('[role="region"]');
    region.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  go(cur - 1);
      if (e.key === 'ArrowRight') go(cur + 1);
    });

    /* Touch swipe */
    let tx0 = 0;
    region.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
    region.addEventListener('touchend',   e => {
      const diff = tx0 - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 44) go(cur + (diff > 0 ? 1 : -1));
    }, { passive: true });
  })();
```

- [ ] **Step 7: Verify slider navigation** — refresh `http://localhost:3333`, scroll to the Reviews section and test:
  - Click **→ arrow**: slides to BMW M4 (slide 2), counter shows "2 / 5", second dot turns gold
  - Click **→ arrow** again: slides to Nissan Patrol (slide 3)
  - Click **← arrow**: goes back to BMW M4
  - Click **← arrow** on slide 1: wraps around to Nissan 370Z (slide 5)
  - Click any **dot**: jumps directly to that slide
  - Verify the **counter** updates on every navigation

- [ ] **Step 8: Verify text scroll** — on the Porsche 911 GT3 slide, hover over the right text panel and scroll down. The review text should scroll within the panel while the slide itself stays in place. The gold gradient mask fades the bottom edge. The thin gold scrollbar should be visible on Webkit browsers.

- [ ] **Step 9: Verify scroll reveal** — hard-refresh, scroll down to the Reviews section from the top. The header elements (eyebrow, title, subtitle) and the slider should fade-in bottom-up as they enter the viewport (same animation as every other section on the page).

- [ ] **Step 10: Verify mobile layout** — in DevTools, toggle to a mobile viewport (≤ 767px wide). Each slide should stack: photo on top (220px tall), text panel below with no scroll constraint (all text visible). Arrows and dots remain below.

---

### Task 4: Final check and commit

- [ ] **Step 11: Cross-check the rest of the page** — scroll through the full page and confirm no regressions:
  - Cases slider still works (dots/arrows)
  - Gallery slider still works
  - FAQ accordion still works
  - Before/After compare drags correctly
  - No new console errors

- [ ] **Step 12: Commit**

```bash
git add index.html
git commit -m "feat: add client reviews slider section after Cases"
```
