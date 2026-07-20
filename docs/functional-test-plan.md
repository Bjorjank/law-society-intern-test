# Functional Test Plan

Record each result as PASS, FAIL, or BLOCKED. For any failure, capture the viewport, browser, exact action, console error, and screenshot.

## 1. Preflight

```powershell
node -v
npm -v
npm run verify
npm audit --omit=dev
git status --short
```

Expected: all commands pass; working tree is clean after committed changes.

## 2. Desktop navigation — 1440 × 900

1. Open the hamburger. Confirm the drawer enters from the right and the page remains dimmed/blurred on the left.
2. Move the pointer through every primary category. Confirm the active gold underline and secondary links change.
3. Click `Lawyers`, `Public`, `Admissions`, and `Careers`. Confirm the drawer stays open and each submenu changes.
4. Use the mouse wheel over the drawer. Confirm the drawer can scroll without moving the background page.
5. Search `privacy`, `career`, and `lawyer`. Confirm results and group labels are relevant.
6. Clear search. Press Arrow Down/Up and Home/End in the primary list.
7. Press Arrow Right into the submenu, then Arrow Left back to the active category.
8. Use Tab and Shift+Tab until focus wraps inside the dialog.
9. Close with Escape; repeat with the X button and backdrop.
10. Confirm focus returns to the hamburger and page scrolling is restored.

## 3. Short desktop/tablet navigation — 1024 × 768

1. Open the menu.
2. Scroll to `Advertise`; no item may be clipped or unreachable.
3. Select a category near the bottom and confirm its submenu remains reachable.
4. Resize between 1024 and 768px while open. Confirm no stuck overlay or horizontal overflow.
5. Close and reopen. Confirm the menu starts from the expected initial state.

## 4. Mobile navigation — 402 × 874 and 390 × 844

1. Open the full-screen menu.
2. Scroll through all ten categories.
3. Search and open a result.
4. Confirm Escape, close button, and backdrop behavior where applicable.
5. Confirm the background cannot scroll while the menu is open.
6. Rotate the device/emulator and confirm the menu remains usable.

## 5. Homepage controls

1. `Scroll down` reaches Statutory Functions.
2. Logo returns to the top.
3. `Find Lawyer` opens the expected destination.
4. Every statutory card and `Read more` has a real destination.
5. Anniversary play opens the informational dialog; Tab is trapped; Escape/backdrop/X close it.
6. Legal-support rows and career CTA navigate.
7. Social and footer links navigate without dead hash links.

## 6. News carousel — fixture mode

Set:

```env
NEWS_USE_FIXTURE=true
GUARDIAN_API_KEY=
```

1. Reload under Slow 3G and confirm skeletons appear.
2. Confirm six articles render.
3. Confirm 3/2/1 visible cards at desktop/tablet/mobile.
4. Use previous/next buttons and keyboard arrows.
5. Confirm previous is disabled at the start and next is disabled at the end.
6. Confirm autoplay pauses during hover and keyboard focus.
7. Switch browser tabs while hovered/focused; returning must not incorrectly resume until all pause conditions clear.
8. Enable reduced motion; autoplay must remain disabled.
9. Simulate a broken thumbnail in DevTools; local fallback must appear once.

## 7. News failure and live API

Missing-key test:

```env
NEWS_USE_FIXTURE=false
GUARDIAN_API_KEY=
```

Expected: `/api/news` returns 503; homepage shows friendly error and retry.

Live test:

```env
NEWS_USE_FIXTURE=false
GUARDIAN_API_KEY=<stored locally>
```

Expected: `/api/news` returns 200, `source` is `guardian`, and at least six normalized articles exist. Never paste or commit the key.

## 8. Browser and console

Run the matrix in current Chrome/Edge and one additional browser when available. During every flow:

- Console has no uncaught error or React warning.
- Network has no unexpected 4xx/5xx except the deliberate missing-key test.
- No mixed-content request occurs.
- No layout shift causes controls to move out from under the pointer.
- No keyboard focus indicator is hidden behind the viewport edge.

## 9. Production verification

Repeat sections 2, 3, 4, 6, and 7 against the deployed URL. Verify that the deployment environment uses live Guardian configuration and contains no fixture-only behavior unless explicitly documented.
## Horizontal overflow and hero validation

Run these checks at `360 × 800`, `390 × 844`, `402 × 874`, `768 × 1024`, `1024 × 768`, and `1440 × 900`:

- `document.documentElement.scrollWidth` must equal `document.documentElement.clientWidth` outside the Media & Press carousel.
- Swiping horizontally on blank page areas must not move the document.
- The Media & Press track must remain horizontally swipeable on mobile.
- The hero background must preserve its aspect ratio and crop inside the content area without stretching.
- The career banner, anniversary ribbon, and tablet Road to 2027 years must not create page-level overflow.
- `/api/health` must return HTTP 200, `status: ok`, and no secret values.


## 10. Career overlap regression test

At `1440 × 900` and `1024 × 768`:

- The Career section itself remains 200px high.
- The phone/person artwork extends upward into Media & Press.
- All three circular orbit controls are visible.
- The artwork does not extend beyond the viewport’s left or right edge.
- The footer begins immediately after the 200px Career banner.

At `768 × 1024`:

- The device is scaled and anchored to the bottom-right.
- Career copy remains readable and does not collide with the device.
- All three orbit controls remain visible.

At `360 × 800`, `390 × 844`, and `402 × 874`:

- The device stays inside the 515px Career section.
- The maroon panel spans exactly the viewport width.
- The document cannot be swiped horizontally.

## 11. Mobile hero regression test

At `360`, `390`, and `402px` widths:

- The hero control rail remains 105px wide.
- The background image uses the wide Figma-derived crop inside the remaining content frame.
- The city and Lady Justice composition is cropped, not stretched.
- The wide image must not increase `document.documentElement.scrollWidth`.
