# Law Society Web Intern Test

Responsive implementation of the supplied Law Society homepage mockup using Next.js, TypeScript, Tailwind CSS, local Figma assets, and the Guardian Open Platform.

## Implemented scope

- Desktop homepage based on the 1440 × 5602 Figma frame.
- Mobile homepage based on the 402 × 5602 Figma frame.
- Scrollable desktop mega-navigation and full-screen mobile navigation.
- Data-driven navigation categories, submenus, destination search, and real links.
- Responsive statutory-functions grid, anniversary feature, Road to 2027, Legal Support, Media & Press, career banner, and footer.
- Guardian-powered carousel with fixture mode, loading, error, retry, keyboard controls, autoplay, independent pause states, and 1/2/3-card behavior.
- Accessible dialogs with Escape handling, focus containment, body-scroll lock, focus restoration, and defensive close fallbacks.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4 plus project-specific responsive CSS
- Guardian Open Platform API

## Requirements

- Node.js 22 LTS recommended; minimum Node.js 20.9.
- npm 10 or 11.
- The 22 supplied design assets must exist in `public/figma`.

## Setup

```powershell
npm ci
npm run figma:verify
```

`figma:verify` is cross-platform and verifies that every required local design asset exists and is non-empty. Production does not fetch images from temporary Figma URLs.

### Configure news data

Create `.env.local` without exposing its contents:

```powershell
Copy-Item .env.example .env.local
```

For deterministic UI review:

```env
GUARDIAN_API_KEY=
NEWS_USE_FIXTURE=true
```

For live news:

```env
GUARDIAN_API_KEY=your_key_here
NEWS_USE_FIXTURE=false
```

`GUARDIAN_API_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_`, commit `.env.local`, or place the value in source code.

## Run locally

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Desktop navigation operation

- Mouse movement or focus over a primary category updates the secondary column.
- Clicking a primary category with children selects it without closing the desktop drawer.
- The drawer scrolls vertically on short desktop and tablet viewports.
- `Arrow Up` / `Arrow Down` move within a menu column.
- `Home` / `End` jump to the first or last item.
- `Arrow Right` moves from a primary category into its submenu.
- `Arrow Left` returns from the submenu to the active primary category.
- `Tab` remains contained inside the dialog.
- `Escape`, the close button, or the dimmed backdrop closes the menu and returns focus to the hamburger.
- Search filters all known navigation destinations; Enter opens the first result.

## Verification commands

```powershell
npm run check
npm run audit:source
npm run smoke:server
```

Run the complete local gate:

```powershell
npm run verify
```

`verify` performs:

1. Figma asset integrity check.
2. ESLint.
3. TypeScript validation.
4. Production build.
5. Static operational/security contract audit.
6. Production-server smoke tests for the homepage, fixture API, and missing-key API failure.

Dependency audit remains a separate network-backed check:

```powershell
npm audit --omit=dev
```

## Manual browser matrix

Use DevTools and complete `docs/functional-test-plan.md`:

- Desktop: 1440 × 900.
- Short desktop/tablet: 1024 × 768.
- Mobile: 402 × 874 and 390 × 844.

The 1024 × 768 test is mandatory because it verifies that the desktop drawer can scroll to `Advertise` and that active submenus remain reachable.

## API behavior

The browser requests `/api/news`. The route handler calls Guardian server-side, validates and normalizes the response, enforces a 10-second timeout, requires at least six articles, and returns a stable internal data contract. Fixture mode provides deterministic review. Missing configuration returns HTTP 503 with an actionable message; upstream failures remain contained inside Media & Press.

## Deployment

Vercel is recommended.

1. Commit the reviewed source and the local `public/figma` assets.
2. Push to a public GitHub repository.
3. Import the repository into Vercel.
4. Add `GUARDIAN_API_KEY` and set `NEWS_USE_FIXTURE=false`.
5. Redeploy.
6. Run the production checks in `docs/functional-test-plan.md` against both `/` and `/api/news`.

## Known limitations

- The Figma test case contains placeholder hero copy; it is retained for visual fidelity.
- The anniversary frame provides a play control and poster but no approved video file or URL. The control opens an accessible explanatory dialog instead of embedding invented media.
- Google Fonts use system fallbacks when font delivery is blocked.
