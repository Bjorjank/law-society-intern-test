# Architecture

## System boundary

This is a frontend test implementation. It does not introduce authentication, a CMS, database, or general-purpose backend. The only server boundary is the Next.js route handler that proxies and normalizes Guardian news.

## Main decisions

- Next.js App Router and TypeScript provide a maintainable component and deployment model.
- Figma assets are local files under `public/figma`; runtime rendering never depends on temporary Figma asset URLs.
- Navigation content is defined once in `src/data/navigation.ts` and consumed by desktop, mobile, and search behavior.
- The mega-menu is an accessible modal dialog whose presentation changes by breakpoint, rather than separate divergent implementations.
- The desktop drawer uses `100dvh`, vertical overflow, overscroll containment, and a 900px reference minimum so short viewports remain usable without destroying the Figma proportions.
- Homepage sections use semantic components and document flow rather than reproducing the entire 5602px canvas with absolute positioning.
- The news API is isolated in `/api/news`; the UI consumes an internal `NewsArticle` contract instead of Guardian's raw response.
- Fixture mode separates deterministic visual QA from external-service availability.

## Navigation flow

Hamburger → dialog opens → body scroll locks → search receives focus → primary category is selected by pointer/focus/click → desktop submenu updates → link navigation or close → exit animation/fallback → body and trigger focus restore.

Failure protections:

- The dialog itself scrolls on short viewports.
- A close timeout prevents a missing `animationend` event from leaving the UI stuck.
- Focusable nodes are recalculated during each Tab event so search results and changing submenus remain inside the focus trap.
- Keyboard column movement is independent of pointer interaction.

## News data flow

Browser → `/api/news` → configuration gate → Guardian request with timeout → response validation and normalization → `NewsResponse` → carousel states.

Failure modes are contained inside Media & Press:

- Fixture mode returns deterministic articles.
- Missing key returns HTTP 503.
- Timeout, invalid payload, insufficient results, and upstream errors return controlled 502 responses.
- The carousel displays retry UI and defensive date/image fallbacks.

## Verification strategy

- `npm run check`: lint, type validation, production build.
- `npm run audit:source`: structural contracts for navigation, dialogs, carousel, API, internal anchors, secrets, and dead links.
- `npm run smoke:server`: starts the compiled application and verifies homepage and API behavior through HTTP.
- `npm run verify`: combines asset, source, build, and server checks.
- Manual browser checks remain required for visual accuracy, pointer behavior, focus order, responsive clipping, and real external navigation.

## Operational concerns

- Store only `GUARDIAN_API_KEY` in deployment secrets.
- Commit the local Figma assets; never commit `.env.local`.
- Run `npm run verify`, `npm audit --omit=dev`, and the browser matrix before submission and after deployment.
