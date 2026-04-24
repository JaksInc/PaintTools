# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PaintTools is a client-side Progressive Web App (PWA) for paint color calculations. It has no build system, no dependencies, and no test framework — it is vanilla HTML/CSS/JavaScript deployed directly to Firebase Hosting.

## Deployment

There is no build step. The `public/` directory is the deployable artifact.

- **Merge to `main`** → GitHub Actions auto-deploys to Firebase Hosting live channel (`coloredpuppy-main` project)
- **Pull request** → GitHub Actions creates a preview deployment channel
- Manual deploy: `firebase deploy` (requires Firebase CLI and auth)

## Architecture

### Shared initialization (`public/common.js`)

All pages load `common.js` as their first `<script>` tag. It runs as an IIFE and:

1. Injects head metadata, stylesheet, icons, and PWA manifest links via `addHeadElements()`
2. Registers the service worker for offline support
3. On `DOMContentLoaded`: populates all `<select class="selectedColor">` dropdowns from the `COLORS` array and builds the bottom nav bar

Two functions are exposed as globals for page scripts to call:
- `window.createFormulas(containerSelector, includePercentage?)` — reads the formula input grid from the DOM and returns an array of formula objects: `{ colorantName: [ounces, drops] }` or `{ colorantName: [ounces, drops, percentage] }`
- `window.displayResults(formula)` — writes a formula object into the `#resultsTable` DOM structure (rows: `#resultColorNames`, `#resultOunces`, `#resultDrops`)

### Page structure pattern

Each tool page follows the same structure:
- `<script src="common.js">` in `<head>` (no defer/async — runs immediately)
- A `#colorsContainer` div holding one or more `.color` divs, each containing `.formulaRow` divs
- Each `.formulaRow` has: `<select class="selectedColor">`, `<input class="ounces">`, `<input class="drops">`, and optionally `<input class="percentage">`
- A `#resultsTable` with rows `#resultColorNames`, `#resultOunces`, `#resultDrops`
- An inline `<script>` at the bottom with page-specific calculation logic

Results update live: each page listens to both `input` and `change` events on `#colorsContainer` (and any other relevant selectors), plus a button click, all triggering the same calculation function.

### Measurement system

**384 drops = 1 ounce.** All math converts to total drops, computes, then converts back:
```js
totalDrops = (ounces * 384) + drops
ounces = Math.floor(totalDrops / 384)
drops = totalDrops % 384
```

### The three tools

| Tool | File | What it does |
|------|------|-------------|
| Scaler | `scaler.html` | Multiplies each colorant by a per-colorant percentage. Uses `createFormulas(..., true)` to include the percentage column. |
| Combiner | `combiner.html` | Merges two formulas by halving each and summing. Carries drops overflow into ounces when drops ≥ 384. |
| Resizer | `resizer.html` | Scales a formula from one batch size to another (8 oz / Quart / Gallon / 5 Gallon) using `scaleFactor = newSize / originalSize`. |
| Differ | `differ.html` | Compares two formulas. Shared colorants show the signed A−B difference (positive = A has more); colorants only in one formula appear labelled "A only" or "B only". Uses a 4-row results table (`resultColorNames`, `resultLabel`, `resultOunces`, `resultDrops`) with a custom `displayDiffs` function instead of the shared `displayResults`. |

### Service worker (`public/sw.js`)

Caches a fixed asset list at install time. Update the `version` constant when the cached asset list changes, so users get the new cache.

### Colors

The 16 available colorants are defined only in `common.js`: `AXL, BL, CL, DL, EL, FL, IL, JL, KXL, LL, RL, RUL, TL, VL, VUL, YL`. Adding a new colorant means updating this array.

## Conventions

- No linting, formatting, or type-checking tools — the codebase is plain JavaScript
- Page-specific logic lives entirely in the inline `<script>` at the bottom of each HTML file; no separate `.js` files per page
- Shared logic that would be needed by more than one page belongs in `common.js`
- `Select color` is the sentinel default option value; calculation loops skip entries where `colorant === 'Select color'`
