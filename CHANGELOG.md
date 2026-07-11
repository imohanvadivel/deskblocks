# Changelog

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
