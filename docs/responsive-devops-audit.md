# Responsive, UI, and DevOps Re-audit

## Scope

This re-audit covers the full responsive range from 360px to 1440px, document-level overflow, hero composition, career-banner overlap, navigation, carousel behavior, dialogs, API routes, build reliability, security headers, and production smoke tests.

## Corrected findings

The earlier responsive patch contained two incorrect visual assumptions:

1. The desktop Career section is intentionally `200px` high. Its device artwork is `355px` high and must extend approximately `155px` upward into the Media & Press area. Applying `overflow: hidden` to `.career-section` clipped the phone, person, and two orbit controls.
2. The mobile hero reference uses a wide `1398px` image crop positioned at `left: -447px`. Replacing this with a normal full-frame image changed the focal composition. The wide image is valid when it remains inside a bounded `.hero-city-frame`.

The mobile horizontal overflow was real, but it should be fixed by bounding decorations and constraining the document’s x-axis—not by clipping intentional vertical artwork.

## Corrective implementation

- Restored `overflow: visible` on the desktop Career section.
- Preserved horizontal containment at `html`, `body`, and `main` using `overflow-x: clip`, with a hidden fallback for older browsers.
- Added `overflow-y: visible` to `main` so intentional cross-section artwork can render.
- Kept the mobile Career layout self-contained and bounded the maroon panel to `left: 0; right: 0; width: 100%`.
- Added tablet-specific Career scaling and right anchoring for 768–1099px viewports.
- Restored the Figma-derived mobile hero crop: `1398px × 874px`, positioned at `left: -447px`, inside the clipped content frame ending before the 105px control rail.
- Updated the source audit so it rejects the previous faulty contracts.

## Browser-render measurements

The corrected production build was rendered through Chromium at these viewports:

| Viewport | Document client width | Document scroll width | Page-level overflow |
|---:|---:|---:|---|
| 360 × 800 | 360px | 360px | None |
| 390 × 844 | 390px | 390px | None |
| 402 × 874 | 402px | 402px | None |
| 768 × 1024 | 768px | 768px | None |
| 1024 × 768 | 1024px | 1024px | None |
| 1280 × 800 | 1280px | 1280px | None |
| 1440 × 900 | 1440px | 1440px | None |

The Media & Press track remains an intentional internal horizontal scroller.

### Career artwork geometry

| Viewport | Section height | Rendered device size | Device x-boundary | Vertical behavior |
|---:|---:|---:|---|---|
| 1440 | 200px | 385 × 355px | Inside viewport | Extends 155px upward |
| 1024 | 200px | 346.5 × 319.5px | Inside viewport | Extends 119.5px upward |
| 768 | 200px | 284.9 × 262.7px | Inside viewport | Extends 62.7px upward |
| 390 | 515px | 277 × 355px | Inside viewport | Contained within section |
| 360 | 515px | 277 × 355px | Inside viewport | Contained within section |

All three Career orbit controls remained visible in the browser-render audit at every tested viewport.

## Operational browser audit

The following checks passed on desktop 1440, desktop 1024, tablet 768, mobile 390, and mobile 360:

- Homepage HTTP 200.
- No page-level horizontal overflow.
- All 22 local design assets loaded in the audit fixture.
- At least six fixture news articles rendered.
- `/api/news` returned HTTP 200 with `source: fixture`.
- `/api/health` returned HTTP 200 with `status: ok`.
- Navigation opened and locked body scrolling.
- Ten primary navigation categories rendered.
- Desktop submenu activation and keyboard movement worked.
- Navigation search returned results.
- Escape closed navigation and restored focus.
- Anniversary dialog opened and closed using Escape.
- Carousel moved through button or keyboard input.
- Career artwork stayed within horizontal viewport boundaries.
- All Career orbit controls remained visible.
- Internal anchors resolved.
- Mobile hero used the restored wide crop inside its bounded frame.
- No uncaught page errors, console errors, or failed local requests.

## Automated quality gates

- Figma asset integrity: PASS, 22/22.
- ESLint: PASS.
- TypeScript: PASS.
- Next.js production build: PASS.
- Source and security contracts: PASS, 20/20.
- Fixture, health, and missing-key server smoke tests: PASS, 3/3.
- Production dependency audit: 0 vulnerabilities.

## Production acceptance checks

After deployment, confirm with the real design assets:

1. The Career phone, hand, person, and all three orbit controls extend into the Media & Press area on desktop without clipping.
2. The Career artwork remains inside the viewport at 768px and 1024px.
3. The mobile Career maroon panel ends exactly at the viewport edges with no sideways page movement.
4. The mobile hero focal composition matches the supplied reference and is not flattened or stretched.
5. `/api/news` reports `source: guardian` with at least six articles.
6. `/api/health` reports `status: ok` without exposing configuration secrets.
7. Browser Console and Network show no critical error or failed local asset.
