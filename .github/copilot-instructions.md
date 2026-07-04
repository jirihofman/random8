# Random8 - Random Data Generator
Random8 is a plain static HTML/CSS/JavaScript application that generates random values including names, emails, passwords, phone numbers, dates, and complete personas. It is built for developers who need quick access to random test data.

Always reference these instructions first and fall back to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- Bootstrap and build the repository:
  - `npm install`
  - `npm run build`
- Development workflow:
  - `npm run dev` -- starts a plain static server on http://localhost:4322
  - `npm run preview` -- uses the same static server command
- Testing:
  - Stop any development server already using port 4321 before running tests.
  - `npm run test` -- runs Playwright E2E tests.
  - `npm run test:ui` -- runs Playwright tests with UI mode.

## Validation
- ALWAYS manually test the application after making changes:
  1. Navigate to http://localhost:4322 in a browser.
  2. Click the main "Random8" button to generate new random data.
  3. Verify all sections populate with data: Names, Emails, Numbers, Passwords, Phone numbers, Date & Time, Persona, Pet names, Keys.
  4. Test click-to-copy functionality by clicking any input field.
  5. Verify a "Copied!" notification appears with the copied value.
- NO linting or formatting tools are configured; manual code review is required.
- ALWAYS run `npm run build` before committing to ensure static files copy into `dist`.
- ALWAYS run the full test suite with `npm run test` before committing.
- Application screenshot reference: https://github.com/user-attachments/assets/f06ee953-d079-46c4-8496-fb40985a0826

## Repository Structure
```
/home/runner/work/random8/random8/
├── .github/
│   └── workflows/
│       └── playwright-e2e.yml
├── index.html                  # Main page
├── app.js                      # Browser behavior and embedded name data
├── styles.css                  # Site styling
├── public/                     # Static assets
├── tests/                      # Playwright E2E tests
├── package.json
└── playwright.config.js
```

## Key Technologies
- Plain HTML/CSS/JavaScript. No framework runtime or build framework.
- Playwright for E2E testing.
- Node.js 18+ for npm scripts and Playwright.

## Package Scripts
```json
{
  "dev": "python3 -m http.server 4322",
  "build": "node -e \"...\"",
  "start": "npm run dev",
  "preview": "npm run dev",
  "test": "playwright test",
  "test:ui": "playwright test --ui"
}
```

## Application Features Validated
- Random data generation: names, emails, numbers, passwords, phone numbers (CZ/US/UK/IN), dates/timestamps, personas, pet names, keys/UUIDs.
- Click-to-copy: all input fields copy their content to clipboard when clicked.
- Visual feedback: "Copied!" notifications with copied value display.
- Responsive design: works across different screen sizes.

## Build Output
`npm run build` creates `dist/` and copies `index.html`, `app.js`, `styles.css`, and `public/`.

## CI/CD Pipeline
- Runs on every push.
- Steps: checkout -> setup Node 18 -> npm ci -> install chromium -> build -> test.
- Uses ubuntu-latest runner.
- Retries: 2 in CI, workers: 1 in CI.

## Important Notes
- Static site: no backend/database dependencies or framework runtime required.
- Data sources: first and last names are embedded in `app.js` to keep the runtime to a single JavaScript file.
- External services: references 1secmail.com, randomkeygen.com, and github.com/dominictarr/random-name in credits.
- UUID version: uses UUID v4 random values.

## Troubleshooting
- "Port already in use": stop the existing server before starting a new one.
- Test failures: ensure no unrelated server is occupying port 4321 before running `npm run test`.
- Build issues: check Node.js version compatibility.
- Missing browser error: run `npx playwright install chromium`.
