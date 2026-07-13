# Changelog

## 0.3.0 — 2026-07-13

### Added

Fourteen new display components, extracted from the Zoho Desk Widget Builder and
generalized to data-driven props (each has a docs page):

- **Note** — toned callout (`tone`, `title`, `dismissible`, default per-tone glyph).
- **Stat** — KPI card (`label`, `value`, `sub`, `trend`, `value` slot for loading states).
- **EmptyState** — icon + title + description + `action` slot.
- **Meter** — progress meter (`value`, `max`, `unit`, `tone`, `showScale`, meter ARIA).
- **Timeline** — day-grouped event feed (`items` with title/time/icon/actor/details).
- **List** — rich rows (leading icon/avatar, title, subtitle meta, trailing
  badge/count/avatar/icon, `clickable` + `itemClick`, responsive narrow-width stacking,
  legacy label/value `fields` mode).
- **Thread** — expandable message thread (`messages`, internal expansion, `toggle` event).
- **Table** — sortable table (`columns`/`rows`, badge cells with tones, `clickableRows`
  + `rowClick`, keyboard-accessible sorting).
- **PropertyGrid** — label/value grid (`items`, `columns` 1|2, muted empty values).
- **SlaTimer** — live SLA countdown (`deadline`, `display` text|clock, 1s ticker,
  overdue styling).
- **Breadcrumb** — crumb trail (`items`, `navigate` event).
- **Rating** — read-only stars/thumbs/votes (`value`, `max`, `variant`).
- **Tags** — toned tag pills (`tags`, `tone`).
- **Chart** — 13 inline-SVG chart types (bar, column, stackedColumn, line, area, spline,
  pie, donut, gauge, funnel, heatmap, scorecard, sparkline) with single-series `data`
  or `labels`+`series`, tone/token-aware color resolution that never falls back to black,
  legend, and value labels.

## 0.2.0 — 2026-07-12

### Fixed

- **Text**: the `type` prop now actually colors text. The component emitted a malformed
  class (`.type-secondary`, with a literal dot) so no color rule ever matched, and the
  non-disabled color rules were missing entirely. The class is now `type-{type}` and
  every type (`primary`, `secondary`, `tertiary`, `brand`, `info`, `success`, `warning`,
  `danger`, `oninverse`) maps to its `--db-color-text-*` token.
- **Icon**: the `size` prop type now includes `'large'` (the size map always supported it).
- **Icons**: renamed the misspelled glyphs `Annoncement` → `IconAnnouncement` and
  `Configuaration` → `IconConfiguration`. The old export names still work as deprecated
  aliases and will be removed in a future release.

### Changed

- **Icons** now ship theme-ready: every glyph uses `fill="currentColor"` (was hardcoded
  `black`/`#010101`) and sizes at `1em` (was fixed `width="32" height="32"`), so a raw
  SVG string dropped into markup inherits the surrounding text color and font size.
  `<Icon>` behaves exactly as before (it already overrode color and size via CSS).
  If you relied on raw icon strings rendering at a fixed 32 px, size them via CSS or
  font-size.

### Added

- **Chip** `tone` prop: `'neutral' | 'info' | 'success' | 'warning' | 'danger'`
  (default `neutral`, the previous appearance). Tones use the semantic secondary
  background tokens with matching text color in both light and dark themes.
- **Icons**: new glyphs `IconStar`, `IconStarFilled` (ratings), and `IconDrag`
  (drag handle).
