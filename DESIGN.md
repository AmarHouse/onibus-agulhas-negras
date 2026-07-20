---
name: "Ônibus Agulhas Negras"
description: "Bus schedule PWA for Região das Agulhas Negras — teal-and-amber utility UI with restrained neutral palette"
colors:
  primary: "#0d9488"
  primary-dark: "#0f766e"
  primary-light: "#ccfbf1"
  accent: "#f59e0b"
  neutral-bg: "#f2f5f0"
  surface: "#ffffff"
  surface2: "#f0f4ee"
  ink: "#141a14"
  ink-secondary: "#3d4d3d"
  ink-muted: "#4a5a4a"
  border: "#d8e0d6"
  success: "#15803d"
  warning: "#b45309"
  error: "#dc2626"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "10px"
  md: "16px"
spacing:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "20px"
components:
  button-primary:
    backgroundColor: "#0b7a6f"
    textColor: "#ffffff"
    rounded: "20px"
    padding: "7px 16px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "#0b7a6f"
    textColor: "#ffffff"
    rounded: "20px"
  button-primary-active:
    backgroundColor: "#0b7a6f"
    textColor: "#ffffff"
  line-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px 14px"
  badge:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary}"
    rounded: "6px"
    padding: "3px 10px"
  modal-content:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md} {rounded.md} 0 0"
  gps-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
---

# Design System: Ônibus Agulhas Negras

## 1. Overview

**Creative North Star: "The Bus Stop Board — digital, not decorative."**

This is a tool for bus schedules in the Região das Agulhas Negras. The design exists to disappear into the task: find the next bus, get the time, leave. Every visual decision serves speed, clarity, and trust — never decoration.

The interface is restrained by principle. One sans-serif family at a tight 1.125× scale. A restrained teal-and-amber palette that evokes the Atlantic forest (Mata Atlântica) of the region without being literal. A flat, shadow-light surface language that loads instantly on spotty 3G connections.

This system explicitly rejects: gradient headers (now solid), glassmorphism, decorative animations, heavy corporate colors, redundant card chrome, uppercase tracked eyebrows, and any element that competes with the schedule data. The content — line codes, departure times, city names — is the protagonist.

**Key Characteristics:**
- Utility-first: the user's task is everything
- One type family, tight scale, no display faces
- Restrained color: teal primary + amber accent + cool green-shifted neutrals
- Flat surfaces, minimal shadows, subtle depth only where functional
- Mobile-first PWA with offline capability
- No decorative motion, no onboarding choreography

## 2. Colors

The palette is restrained with one committed color shift. Nature-inspired teal and amber anchor a cool-green neutral system that avoids both the corporate blue and the warm beige defaults.

### Primary — Teal
- **Teal** (#0d9488 / `--color-primary`): Interactive accents — active buttons, hover states, focus indicators, city tab active state.
- **Deep Teal** (#0f766e / `--color-primary-dark`, `--header-bg`): Header background, active badge backgrounds. Used where higher contrast with white is needed.
- **Mint** (#ccfbf1 / `--color-primary-light`, `--badge-bg`): Badge and code-chip backgrounds. Soft tint against white surfaces.

### Accent — Amber
- **Amber** (#f59e0b / `--accent`): High-emphasis highlights — GPS next-bus indicator, "PRÓXIMO" label, departure badges, stateful accents.

### Neutral — Cool Green
- **Off-white** (#f2f5f0 / `--bg`): Body background. A hint of green chroma away from pure white.
- **White** (#ffffff / `--surface`): Card and surface backgrounds.
- **Light Green** (#f0f4ee / `--surface2`): Secondary surfaces — hover states, operator badges.
- **Near-black** (#141a14 / `--text`): Body text, max readability.
- **Deep Green-Gray** (#3d4d3d / `--text2`): Secondary text — labels, metadata, GPS status.
- **Muted Green-Gray** (#4a5a4a / `--text3`): Tertiary text — footnotes, preview items, low-emphasis content.
- **Pale Green-Gray** (#d8e0d6 / `--border`): Borders, dividers, card strokes.

### Semantic
- **Green** (#15803d / `--color-success`): Success states.
- **Amber-Dark** (#b45309 / `--color-warning`): Warning states, offline indicator.
- **Red** (#dc2626 / `--color-error`, `--now-badge`): Error states, "AGORA" badge.

### The One Color Rule
**The Primary Rule.** The teal primary is used on ≤10% of any given screen. It appears on the header, active buttons, and badges — nothing else. Its rarity is what makes it read as intentional.

## 3. Typography

**Font Stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` — system fonts only. No custom typefaces, no loading delay, no FOUT.

**Character:** Clean, neutral, pragmatic. This is the same stack used by every modern OS. It reads as familiar and trustworthy — exactly what a schedule tool needs. The family carries body text, navigation labels, data, and small UI elements without a second face.

### Hierarchy

- **Display** (700, 1.5rem, 1.2, -0.02em): The app title in the header. Used exactly once.
- **Title** (600, 1.125rem, 1.2): Section headings, modal titles.
- **Body** (400, 1rem, 1.4): Primary reading — line names, GPS text, empty states. 65–75ch max.
- **Label** (500, 0.875rem, 1.4, 0.05em uppercase on version label only): Buttons, tabs, most small UI elements.
- **Caption** (500, 0.75rem, 1.4): Schedule times, footnotes, preview items, timestamps, operator badges.

### Named Rules

**The One Family Rule.** A single sans-serif carries the entire interface. No serif display, no mono for data, no pairing. Switching families would create the wrong kind of friction — the user shouldn't think about typography at all.

**The Tight Scale Rule.** Steps at 1.125× ratio (0.75 → 0.875 → 1.0 → 1.125 → 1.5 → 2.0). No clamps, no fluid sizing. Product UIs at consistent DPI don't need responsive type.

**The Balance Rule.** `h1` uses `text-wrap: balance` for even line breaks. Long prose uses `text-wrap: pretty` to reduce orphans.

## 4. Elevation

Flat with subtle functional depth. The system conveys hierarchy through tonal surface variation (`--surface` → `--surface2`) rather than shadows. Cards get a minimal `0 2px 8px rgba(0,0,0,0.08)` shadow for separation from the body background, but never cast deep shadows.

### Shadow Vocabulary
- **Card shadow** (`box-shadow: 0 2px 8px rgba(0,0,0,0.08)`): Default card elevation. Subtle, doesn't float.
- **Header shadow** (`box-shadow: 0 4px 20px rgba(0,0,0,0.15)`): Sticky header separation. Slightly deeper to anchor the chrome.
- **Small shadow** (`box-shadow: 0 1px 3px rgba(0,0,0,0.06)`): GPS bar only.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to scrolling (sticky header) or separation (cards from background). No decorative raised surfaces.

## 5. Components

### City Tabs
- **Style:** Pills with border stroke. Inactive = surface bg + border + text2. Active = dark teal bg + white text.
- **Shape:** 8px radius.
- **State:** Active tab gets solid background `#0b7a6f` / `#219e93` (dark mode) with white or black text.
- **Dark mode override:** Active bg brightens to `#219e93`, text goes black for contrast.

### Day Selector Buttons
- **Style:** Pills matching city tabs, `border-radius: 20px`.
- **Shape:** Fully rounded pill (`border-radius: 20px`).
- **State:** Same active/inactive treatment as city tabs. Hover = primary border and text.

### Line Card
- **Style:** White surface card with 1px border, 16px radius, 2px/8px shadow.
- **Content:** Code badge on the left, route name center (ellipsis overflow), arrow right. Schedule preview row below with 4 time chips.
- **State:** Hover = primary border. Active = scale(0.98) press feedback. Focus-visible = 2px primary outline.
- **Internal structure:** `.line-code` badge (mint bg + teal text, 6px radius), `.line-name` (1rem, 500, ellipsis), `.line-arrow` (text2, 0.875rem).

### Code Badge (`.line-code`)
- **Shape:** 6px radius, `padding: 3px 10px`.
- **Background:** `--badge-bg` (#ccfbf1 mint).
- **Text:** `--badge-text` (#0d9488 teal). Font weight bold, 0.875rem.

### Operator Badge
- **Style:** Secondary surface bg (`--surface2`), muted text, caption size.
- **Shape:** 4px radius.
- **Role:** Displayed as a small chip in the card header to identify the operating company.

### Search Input
- **Style:** Transparent input on semi-transparent white overlay (`rgba(255,255,255,0.15)`), 12px radius. White text. Placeholder at 60% opacity.
- **Focus:** Container background brightens to `rgba(255,255,255,0.22)`.
- **Clear:** Native `type="search"` clear button (most browsers) + JS `search` event handler.
- **Dark mode:** Transparent overlay on dark header, same pattern.

### GPS Bar
- **Style:** White surface + 1px border + small shadow. Flex layout with icon, text, and status.
- **State:** Active = accent border (`--accent` #amber) + warning-bg.
- **Role:** One tap to activate GPS, shows nearest stop name + distance + connected lines.

### Offline Bar
- **Style:** Warning bg (`--color-warning-bg` #fef3c7), warning text (`--color-warning` #b45309), caption size centered.
- **Behavior:** Hidden by default (`display: none`), shown when `navigator.onLine` is false. Listens for `online`/`offline` events.

### Modal (Bottom Sheet)
- **Style:** Fixed overlay with 50% black backdrop, frosted slide-up from bottom. Content surface with 16px top radius + vertical padding.
- **Shape:** Mobile = full-width bottom sheet (`border-radius: 16px 16px 0 0`). Desktop ≥640px = centered dialog (`border-radius: 16px`).
- **Close:** Top-right × button (surface2 bg, 36px circle, 1.125rem × symbol).
- **ARIA:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on title.
- **Focus trap:** Tab/Shift+Tab cycles within modal. Escape closes focus returns to triggering card.
- **Content sections:** Line title (bold, wrap), operator badge, info box, direction sections with schedule-time grid.

### Schedule Time Grid
- **Style:** Grid with `auto-fill, minmax(70px, 1fr)`, 6px gap, 8px radius cells.
- **Cells:** surface2 bg, 1px border, 0.875rem text, tabular-nums, medium weight.
- **Next departure:** Highlighted with amber border/accent (`--next-bg` + `--accent`), "AGORA" badge (red, positioned top-right).
- **No-schedules state:** Shows "Sem horários neste dia" in muted caption text.

### Empty State
- **Style:** Centered, 40px vertical padding, muted text color.
- **Content:** 🔍 emoji at 2rem + text at 1rem.
- **Variants:** "Nenhuma linha encontrada para [query]" (search), "Nenhuma linha disponível para este filtro" (no lines at all).

## 6. Do's and Don'ts

### Do:
- **Do** use the system font stack. No custom typefaces.
- **Do** keep the header to a solid dark teal. No gradient.
- **Do** use the teal primary on ≤10% of the screen. Its function is pointing, not painting.
- **Do** respect the 4.5:1 WCAG AA minimum contrast for all body text.
- **Do** show clear loading, empty, and error states for every interaction.
- **Do** maintain the flat-by-default elevation philosophy. Shadows are for separation, not decoration.
- **Do** use tabular-nums (`font-variant-numeric: tabular-nums`) for all departure times so digits don't shift.
- **Do** prefix all interactive elements with `:focus-visible` outlines.
- **Do** respect `prefers-reduced-motion` — all animations must have a safe instant fallback.
- **Do** Prefer inline and progressive disclosure over modals. Modals are the last resort.

### Don't:
- **Don't** use gradient text, glassmorphism, or blurred backgrounds as decoration. As per product: "Nada de animações decorativas, glassmorphism ou tipografia de display."
- **Don't** use side-stripe borders (colored `border-left` >1px as accent).
- **Don't** use uppercase tracked eyebrows above sections (the "ABOUT" / "PROCESS" AI trope).
- **Don't** use numbered section markers (01 · About / 02 · Process).
- **Don't** use display fonts or serif faces anywhere in the UI.
- **Don't** use heavy corporate colors (navy, dark blue, gray suit). As per product: "Não deve parecer app de banco."
- **Don't** nest cards. Cards are single-layer containers.
- **Don't** entertain decorative motion that doesn't convey state.
- **Don't** use identical card grids as the primary layout mechanism without variation.
- **Don't** put scheduling data behind modal-as-first-thought; show schedules inline by default.
