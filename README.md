# DevTrail — Milestone 1: Foundation

## Setup
```bash
npm install
npm run dev
```

## Where your existing shadcn/ui components go
Drop your 44 components' `.jsx` files into `src/components/ui/`. This project's
`components.json` uses the same default shadcn conventions (`@/components/ui`,
`@/lib/utils`, CSS-variable theming), so they should resolve as-is. Two of
them — `button.jsx` and `dropdown-menu.jsx` — already exist here as
placeholders so the theme switcher has something to render; overwrite them
with your real copies if you have them, nothing else depends on which
version wins as long as the exported names match.

## Theme system
- Light/dark/system, toggled via the switcher in the top-right of the
  foundation screen (`src/components/common/ThemeToggle.jsx`).
- All colors are CSS variables in `src/index.css` — light mode uses a
  saturated indigo/teal/amber palette, dark mode uses calmer versions of the
  same hues. Change values there, not per-component, to retheme.
- Preference persists to `localStorage` and is applied before first paint via
  the inline script in `index.html` (no flash of the wrong theme).

## What's intentionally not here yet
Routing, auth, and real feature pages land in later milestones. `App.jsx` is
a throwaway screen that only proves the foundation renders correctly.
