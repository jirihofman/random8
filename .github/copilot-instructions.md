# Random8 - Random Data Generator
Random8 is an Astro-based web application with React components that generates random values including names, emails, passwords, phone numbers, dates, and complete personas. Built for developers who need quick access to random test data.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- Bootstrap and build the repository:
  - `npm install` -- takes ~16 seconds. Works reliably.
  - `npm run build` -- takes ~3 seconds. VERY FAST build process.
- Development workflow:
  - `npm run dev` -- starts development server on http://localhost:4321 in ~1 second
  - `npm run preview` -- serves built static files on http://localhost:4321
- Testing:
  - **CRITICAL**: Stop development server before running tests with `Ctrl+C`
  - `npm run test` -- runs Playwright E2E tests, takes ~2 seconds
  - `npm run test:ui` -- runs Playwright tests with UI mode
  - Tests require dev server to NOT be running (config: reuseExistingServer: !process.env.CI)

## Validation
- ALWAYS manually test the application after making changes:
  1. Navigate to http://localhost:4321 in browser
  2. Click the main "Random8" button to generate new random data
  3. Verify all sections populate with data: Names, Emails, Numbers, Passwords, Phone numbers, Date & Time, Persona, Pet names, Keys
  4. Test click-to-copy functionality by clicking any input field
  5. Verify "Copied!" notification appears with the copied value
- NO linting or formatting tools are configured - manual code review is required
- ALWAYS run `npm run build` before committing to ensure build succeeds
- ALWAYS run the full test suite with `npm run test` before committing
- **Application Screenshot Reference**: https://github.com/user-attachments/assets/f06ee953-d079-46c4-8496-fb40985a0826

## Common Tasks
The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Structure
```
/home/runner/work/random8/random8/
├── .github/
│   └── workflows/
│       └── playwright-e2e.yml
├── src/
│   ├── components/
│   │   ├── RandomGenerator.tsx  # Main React component with all logic
│   │   └── Notes.tsx
│   ├── layouts/
│   │   └── Layout.astro        # Base layout template
│   ├── pages/
│   │   ├── index.astro         # Main page
│   │   └── robots.txt.ts
│   └── styles/
├── tests/
│   └── sanity.spec.js          # E2E tests for UI validation
├── public/                     # Static assets
├── first-names.json            # 4958 first names data source
├── names.json                  # 21986 last names data source
├── package.json
├── astro.config.mjs           # Astro configuration
└── playwright.config.js       # Test configuration
```

### Key Technologies
- **Astro v5.13.7** - Static site generator with React integration
- **React 19.1.0** - UI components (RandomGenerator.tsx)
- **Vercel Adapter** - Deployment configuration (output: 'static')
- **Playwright** - E2E testing framework
- **Node.js 18+** - Runtime requirement (see CI configuration)

### Package.json Scripts
```json
{
  "dev": "astro dev",           // Development server
  "build": "astro build",       // Production build
  "start": "astro start",       // Start built app (not commonly used)
  "preview": "astro preview",   // Preview built static files
  "test": "playwright test",    // Run E2E tests
  "test:ui": "playwright test --ui"  // Interactive test mode
}
```

### Application Features Validated
- **Random Data Generation**: Names, emails, numbers, passwords, phone numbers (CZ/US/UK/IN), dates/timestamps, personas, pet names, keys/UUIDs
- **Click-to-Copy**: All input fields copy their content to clipboard when clicked
- **Visual Feedback**: "Copied!" notifications with copied value display
- **Responsive Design**: Works across different screen sizes
- **Fast Performance**: Static site with minimal JavaScript bundle

### Build Output (npm run build)
```
building client (vite) 
dist/_astro/index.RH_Wq4ov.js              7.88 kB │ gzip:  3.05 kB
dist/_astro/client.D2WMwoKK.js           179.41 kB │ gzip: 56.61 kB
dist/_astro/RandomGenerator.lA2YP8Ht.js  293.56 kB │ gzip: 90.83 kB
✓ built in 973ms
✓ Completed in 1.95s
```

### CI/CD Pipeline (.github/workflows/playwright-e2e.yml)
- Runs on every push
- Steps: checkout → setup Node 18 → npm ci → install chromium → build → test
- Uses ubuntu-latest runner
- Retries: 2 (in CI), workers: 1 (in CI)

## Important Notes
- **NO LINTING TOOLS**: No ESLint, Prettier, or other code formatting tools configured
- **Static Site**: No backend/database dependencies required
- **Test Dependencies**: Tests expect clean state - stop dev server before testing
- **Data Sources**: Names come from JSON files (first-names.json: 4958 entries, names.json: 21986 entries)
- **External Services**: References 1secmail.com, randomkeygen.com, and github.com/dominictarr/random-name in credits
- **UUID Version**: Uses UUID v4 (random) - documented in application UI

## Troubleshooting
- **"Port already in use" error**: Stop existing dev server with Ctrl+C before starting new one
- **Test failures**: Ensure dev server is stopped before running `npm run test`
- **Build issues**: Very rare due to fast build - check Node.js version compatibility (requires 18+)
- **Missing browser error**: Run `npx playwright install chromium` for test dependencies