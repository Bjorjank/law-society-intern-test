# Law Society Web Intern Test

A responsive implementation of the supplied Law Society homepage mockup, built with Next.js, TypeScript, Tailwind CSS, local Figma assets, and the Guardian Open Platform API.

## Live Demo

https://law-society-intern-test.vercel.app/

## Overview

This project recreates the supplied Law Society homepage design for desktop and mobile while adding functional navigation, responsive content sections, accessible dialogs, and a live news carousel.

The implementation focuses on:

- Visual fidelity to the supplied Figma design
- Responsive behavior across desktop, tablet, and mobile
- Accessible keyboard and dialog interactions
- Server-side Guardian API integration
- Local production assets without temporary Figma URLs
- Reliable loading, error, retry, and fixture states

## Implemented Features

### Responsive layout

- Desktop homepage based on the `1440 × 5602` Figma frame
- Mobile homepage based on the `402 × 5602` Figma frame
- Responsive behavior for desktop, tablet, and mobile viewports
- Twenty-two local Figma assets stored in `public/figma`

### Navigation

- Scrollable desktop mega-menu
- Full-screen mobile navigation
- Data-driven primary navigation and submenus
- Search across available navigation destinations
- Mouse, focus, click, and keyboard interaction
- Focus trapping and focus restoration
- Escape, close-button, and backdrop dismissal
- Body-scroll locking while the navigation is open

### Homepage sections

- Hero section
- Statutory-functions grid
- 60th-anniversary feature
- Road to 2027 timeline
- Legal Support directory
- Media & Press carousel
- Career-support banner
- Responsive footer

### Guardian news carousel

- Guardian Open Platform integration
- Server-side API requests
- Fixture mode for deterministic review
- Loading, error, and retry states
- Previous and next controls
- Keyboard controls
- Autoplay with independent pause states
- Responsive card count:
  - 3 cards on desktop
  - 2 cards on tablet
  - 1 card on mobile
- Article links open the original Guardian website

### Accessibility

- Semantic interactive elements
- Keyboard-accessible navigation and carousel controls
- Accessible dialogs
- Focus containment
- Focus restoration
- Escape-key handling
- Body-scroll locking
- Defensive close fallbacks
- ARIA labels and state attributes

## Technology Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Guardian Open Platform API
- ESLint
- Node.js
- Vercel

## Requirements

- Node.js 20.9 or newer
- Node.js 22 LTS recommended
- npm 10 or 11
- All required design assets available in `public/figma`

## Local Setup

Install dependencies:

```bash
npm ci
```

Verify the local Figma assets:

```bash
npm run figma:verify
```

The verification command confirms that every required design asset exists and is not empty. Production does not depend on temporary Figma asset URLs.

## Environment Variables

Create `.env.local` from the provided example file.

### Windows PowerShell

```powershell
Copy-Item .env.example .env.local
```

### macOS or Linux

```bash
cp .env.example .env.local
```

### Fixture mode

Use fixture mode for deterministic local testing:

```env
GUARDIAN_API_KEY=
NEWS_USE_FIXTURE=true
```

### Live Guardian data

```env
GUARDIAN_API_KEY=your_guardian_api_key
NEWS_USE_FIXTURE=false
```

`GUARDIAN_API_KEY` is server-only.

Do not:

- Prefix it with `NEXT_PUBLIC_`
- Commit `.env.local`
- Place the key directly in source code
- Expose the key in client-side JavaScript

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

News API endpoint:

```text
http://localhost:3000/api/news
```

## Desktop Navigation Controls

The desktop navigation supports mouse, focus, click, and keyboard interaction.

- Hovering or focusing a primary category updates its submenu
- Clicking a primary category selects it without closing the drawer
- The drawer scrolls vertically on shorter desktop and tablet screens
- `Arrow Up` and `Arrow Down` move within the current menu column
- `Home` and `End` move to the first or last item
- `Arrow Right` moves into the active submenu
- `Arrow Left` returns to the active primary category
- `Tab` and `Shift + Tab` remain contained inside the dialog
- `Escape` closes the navigation
- The close button and dimmed backdrop also close the navigation
- Focus returns to the hamburger button after closing
- Search filters available navigation destinations
- `Enter` opens the first matching result

## API Behavior

The browser requests:

```text
/api/news
```

The route handler:

1. Reads the Guardian API key on the server
2. Requests recent Guardian content
3. Enforces a 10-second timeout
4. Validates the upstream response
5. Normalizes the data into an internal article format
6. Requires at least six usable articles
7. Returns a stable response contract to the client

Fixture mode provides deterministic content for development and review.

Missing configuration returns HTTP `503` with an actionable error message. Guardian or network failures remain contained inside the Media & Press section and do not break the rest of the homepage.

## Verification

Run the standard checks:

```bash
npm run check
npm run audit:source
npm run smoke:server
```

Run the complete verification pipeline:

```bash
npm run verify
```

The verification pipeline includes:

1. Figma asset integrity verification
2. ESLint
3. TypeScript validation
4. Production build
5. Static operational and security checks
6. Homepage server smoke tests
7. Fixture API behavior
8. Missing API-key failure behavior
9. Core DOM interaction checks

Run the production dependency audit separately:

```bash
npm audit --omit=dev
```

## Manual Browser Test Matrix

The complete manual checklist is available in:

```text
docs/functional-test-plan.md
```

Recommended viewport sizes:

| Device | Viewport |
|---|---:|
| Desktop | 1440 × 900 |
| Short desktop / tablet | 1024 × 768 |
| Mobile reference | 402 × 874 |
| Common mobile | 390 × 844 |

The `1024 × 768` test verifies that the desktop navigation drawer can scroll to the final menu items and that all active submenus remain reachable.

## Deployment

The application is deployed on Vercel:

https://law-society-intern-test.vercel.app/

Required Vercel environment variables:

```env
GUARDIAN_API_KEY=your_guardian_api_key
NEWS_USE_FIXTURE=false
```

After changing an environment variable, redeploy the project so the new value is applied.

Production verification should cover:

```text
/
/api/news
```

Expected production behavior:

- Homepage returns HTTP `200`
- News API returns HTTP `200`
- News source is `guardian`
- At least six articles are returned
- Local Figma assets load correctly
- Desktop and mobile navigation work correctly
- Carousel controls work correctly
- No horizontal overflow is present
- No critical browser-console errors are present

## Known Limitations

- The supplied Figma design contains placeholder hero copy, which is retained for visual fidelity
- The anniversary section contains a play control and poster, but no approved video file or URL was supplied; the control therefore opens an accessible explanatory dialog
- Google Fonts fall back to system fonts when external font delivery is blocked
- Navigation destinations are demonstration links based on the supplied test design and available public Law Society destinations

## Security Notes

- Guardian API requests run only on the server
- `.env.local` is excluded from Git
- The Guardian API key is not exposed through public environment variables
- Temporary Figma asset URLs are not used in production
- External article links point to the original Guardian website

## License

This project was created for a web-development technical assessment.

The supplied Law Society design, branding, and visual assets remain the property of their respective owners.
