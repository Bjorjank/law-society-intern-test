# Acceptance Checklist

## Automated gate

- [ ] `npm run verify` passes.
- [ ] `npm audit --omit=dev` reports zero production vulnerabilities.
- [ ] `git status --short` is clean.
- [ ] `.env.local`, API keys, tokens, cookies, and credentials are absent from Git.

## Visual

- [ ] Exact Figma assets exist in `public/figma` and `npm run figma:verify` passes.
- [ ] Desktop hero uses Lady Justice, skyline, maroon geometry, logo, social links, and 128px right rail.
- [ ] Mobile hero uses the 105px right rail and reference composition.
- [ ] Statutory cards are 4-up desktop and 2 × 2 mobile.
- [ ] Anniversary, Road to 2027, Legal Support, Media & Press, Career, and Footer match their references.
- [ ] Oswald and Montserrat are applied consistently.
- [ ] No horizontal page overflow exists at 1440, 1024, 402, or 390px.

## Navigation

- [ ] Desktop drawer leaves the blurred homepage visible on the left.
- [ ] At 1024 × 768, the drawer scrolls from `About Us` through `Advertise`.
- [ ] Hover, focus, and click update the desktop secondary submenu.
- [ ] Clicking a desktop category with children does not close the drawer.
- [ ] Mobile navigation is full-screen and vertically usable.
- [ ] Search returns matching destinations and Enter opens the first result.
- [ ] Arrow Up/Down, Home/End, Arrow Right, and Arrow Left work as documented.
- [ ] Tab and Shift+Tab remain inside the dialog.
- [ ] Close button, backdrop, and Escape close the dialog.
- [ ] Body scroll locks while open and restores afterward.
- [ ] Focus returns to the hamburger after close.

## News API and carousel

- [ ] Fixture mode returns at least six articles.
- [ ] Live mode reports `source: guardian`.
- [ ] Missing key with fixture disabled returns HTTP 503.
- [ ] Image, date, title, description, and external link render.
- [ ] Loading skeleton, friendly error, and retry operate.
- [ ] 3 cards desktop, 2 tablet, 1 mobile.
- [ ] Buttons and keyboard arrows move the carousel.
- [ ] Autoplay pauses independently for hover, focus, hidden tab, and reduced motion.
- [ ] Broken images use the local fallback once without a retry loop.

## Other controls

- [ ] `Find Lawyer`, statutory cards, legal-support rows, career CTA, social links, footer links, and press links are not dead `#` links.
- [ ] Anniversary play opens a dialog, Escape/backdrop/close work, focus is contained, and focus restores.
- [ ] External links that open a new tab use `noopener noreferrer` where applicable.

## Repository and deployment

- [ ] Public repository has a truthful multi-commit history.
- [ ] README contains setup, environment, verification, deployment, and limitations.
- [ ] Production `/` returns HTTP 200.
- [ ] Production `/api/news` returns HTTP 200 and `source: guardian`.
- [ ] Production navigation and carousel pass the same browser matrix.
