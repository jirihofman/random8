# AI Agent Instructions for Random8

This document provides guidelines for AI agents working on the Random8 project.

## Project Overview

Random8 is a plain static HTML/CSS/JavaScript application that generates random values including:
- Names
- Email addresses
- Passwords
- Phone numbers in CZ, US, UK, and IN formats
- Numbers with 4, 8, and 12 digit lengths
- Dates and timestamps
- Complete personas
- Pet names
- Keys and UUIDs

The runtime site is intentionally limited to:
- `index.html`
- `app.js`
- `styles.css`

## Development Workflow

### Prerequisites
- Node.js 18+
- npm
- Python 3 for the local static server

### Setup
```bash
npm install
```

### Development
```bash
npm run dev
```

Open http://localhost:4322.

### Build
```bash
npm run build
```

The build copies `index.html`, `app.js`, `styles.css`, and `public/` into `dist/`.

### Preview
```bash
npm run preview
```

## Testing

### Running Tests
```bash
npm run test
npm run test:ui
```

The Playwright configuration starts the static server on http://localhost:4322. Stop any existing process on that port before running tests.

### Test Structure
- `tests/sanity.spec.js` checks that the main sections, button, and tooltips exist.
- `tests/generate-button.spec.js` validates generated value formats and button behavior.

### Manual Validation
After UI or generation changes:
1. Navigate to http://localhost:4322.
2. Click the "Random8" button.
3. Verify all sections populate: Names, Emails, Numbers, Passwords, Phone numbers, Date & Time, Persona, Pet names, Keys.
4. Click an input and verify the copied notification appears.

## CI/CD Pipeline

The GitHub Actions workflow at `.github/workflows/playwright-e2e.yml` runs on every push:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies with `npm ci`
4. Install Playwright Chromium
5. Build the static site
6. Run Playwright tests

## Key Files

- `index.html` - Page structure
- `app.js` - Random generation, DOM updates, copy behavior, and embedded name data
- `styles.css` - Site styling
- `tests/sanity.spec.js` - Basic sanity tests
- `tests/generate-button.spec.js` - Comprehensive format validation tests
- `playwright.config.js` - Playwright test configuration
- `.github/workflows/playwright-e2e.yml` - CI workflow

## Data Sources

The first-name and last-name datasets are embedded directly in `app.js` so the browser runtime remains a single JavaScript file with no JSON fetches or framework bundling.

## Common Tasks for AI Agents

### When Adding New Features
1. Preserve the plain static architecture.
2. Update tests if changing generated formats or UI selectors.
3. Run `npm run build`.
4. Run `npm run test`.
5. Manually validate browser behavior for UI changes.

### When Fixing Bugs
1. Add or update a focused failing test when practical.
2. Fix the bug with minimal changes.
3. Verify the focused test and full suite pass.
4. Manually verify in the browser when behavior is user-facing.

### When Refactoring
1. Keep the same generated formats unless the task asks otherwise.
2. Preserve selectors used by Playwright tests.
3. Avoid reintroducing framework dependencies.

## Code Quality

- No linting tools are configured.
- Keep changes small and readable.
- Use browser APIs directly; do not add a framework or bundler.
- Keep the site static with no backend/database dependencies.

## Troubleshooting

- Port conflict: check `ss -ltnp 'sport = :4322'`.
- Missing browser: run `npx playwright install chromium`.
- Build issues: check Node.js version compatibility.

## Security Considerations

- Random generation uses `crypto.getRandomValues` and `crypto.randomUUID` when available.
- No sensitive data is stored or transmitted.
- The site has no backend runtime.
