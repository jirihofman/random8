# AI Agent Instructions for Random8

This document provides guidelines for AI agents working on the Random8 project.

## Project Overview

Random8 is an Astro-based web application with React components that generates random values including:
- Names (first, middle, last)
- Email addresses
- Passwords (human-readable and complex)
- Phone numbers (CZ, US, UK, IN formats)
- Numbers (4, 8, 12 digit lengths)
- Dates & timestamps
- Complete personas
- Pet names
- Keys and UUIDs

## Development Workflow

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install  # Install dependencies (~16 seconds)
```

### Development
```bash
npm run dev  # Start development server on http://localhost:4321 (~1 second)
```

### Build
```bash
npm run build  # Production build (~3 seconds, VERY FAST)
```

### Preview
```bash
npm run preview  # Serve built static files on http://localhost:4321
```

## Testing

### Important: Stop Development Server Before Testing
**CRITICAL**: Always stop the development server with `Ctrl+C` before running tests. The Playwright configuration is set to `reuseExistingServer: !process.env.CI`, which means:
- **Locally (not in CI)**: Tests will reuse an existing server if one is running on port 4321
- **In CI**: Tests will always start a fresh server

While tests can reuse an existing server locally, it's best practice to stop any running dev server before testing to ensure a clean test environment and avoid potential port conflicts or state issues.

### Running Tests
```bash
npm run test     # Run all Playwright E2E tests (~2 seconds)
npm run test:ui  # Run tests with Playwright UI mode for debugging
```

### Test Structure
The project uses Playwright for end-to-end testing. Tests are located in the `tests/` directory:

- `tests/sanity.spec.js` - Basic sanity checks (sections exist, button works, tooltips)
- `tests/generate-button.spec.js` - Comprehensive validation of generated values

### What to Test When Making Changes

1. **Always run the full test suite** before committing:
   ```bash
   npm run test
   ```

2. **Manual validation** is required after changes:
   - Navigate to http://localhost:4321
   - Click the "Random8" button to generate new data
   - Verify all sections populate correctly:
     - Names (3 entries)
     - Emails (3 entries)
     - Numbers (9 entries in 3x3 grid)
     - Passwords (4 entries)
     - Phone numbers (4 entries: CZ, US, UK, IN)
     - Date & Time (8 entries)
     - Persona (name, UUID, email, phone, password)
     - Pet names (3 entries)
     - Keys (3 entries)
   - Test click-to-copy functionality
   - Verify "Copied!" notifications appear

3. **Format validation tests** ensure:
   - **Names**: At least 2 words (first + last), capitalized
   - **Emails**: Valid email format with @gmail.com, @googlemail.com, or @hotmail.com
   - **Passwords**: 
     - Password 1: 8 characters (human-readable)
     - Password 2: 12 characters (alphanumeric)
     - Password 3: 16 characters (with special characters)
     - Password 4: 32 characters
   - **Phone numbers**:
     - CZ: `+420 XXXXXXXXX` (9 digits)
     - US: `+1 XXX-XXX-XXXX`
     - UK: `+44XXXXXXXXXX` (10 digits)
     - IN: `+91 XXXXX XXXXX` (5+5 digits)
   - **Numbers**: 4, 8, or 12 digit lengths (digits only)
   - **Dates**: ISO format, locale format, timestamps, Date strings
   - **Persona UUID**: Valid UUID v4 format
   - **Pet names**: 
     - 2-word-XXXX (with 4-digit number)
     - 3-word-word (hyphen-separated)
     - 5_word_word_word_word (underscore-separated)
   - **Keys**: 
     - 16 character alphanumeric (2 keys)
     - UUID v4 format (1 key)

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration. The workflow (`.github/workflows/playwright-e2e.yml`) runs on every push:

1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Install Playwright browsers (chromium)
5. Build the Astro site (`npm run build`)
6. Run Playwright tests (`npm run test`)

The CI configuration:
- Runs on `ubuntu-latest`
- Uses 2 retries in CI
- Single worker in CI (parallel locally)
- Tests expect a clean state (no dev server running)

## Key Files

- `src/components/RandomGenerator.tsx` - Main React component with all generation logic
- `src/layouts/Layout.astro` - Base layout template
- `src/pages/index.astro` - Main page
- `tests/sanity.spec.js` - Basic sanity tests
- `tests/generate-button.spec.js` - Comprehensive format validation tests
- `playwright.config.js` - Playwright test configuration
- `.github/workflows/playwright-e2e.yml` - CI/CD workflow

## Data Sources

- `first-names.json` - 4,958 first names
- `names.json` - 21,986 last names

## Common Tasks for AI Agents

### When Adding New Features

1. **Explore the codebase first** to understand existing patterns
2. **Follow existing conventions** (no linting tools configured, so manual review required)
3. **Update tests** if changing generation logic:
   - Add new test cases to `tests/generate-button.spec.js`
   - Ensure format validation regex patterns are updated
4. **Always build** before committing: `npm run build`
5. **Always test** before committing: `npm run test`
6. **Manual validation** is mandatory for UI changes

### When Fixing Bugs

1. **Write a failing test first** that reproduces the bug
2. **Fix the bug** with minimal changes
3. **Verify the test passes** and all other tests still pass
4. **Manually verify** the fix in the browser

### When Refactoring

1. **Ensure all tests pass** before refactoring
2. **Make incremental changes** and test after each change
3. **Don't change working functionality** unless necessary
4. **All tests must still pass** after refactoring

## Code Quality

- **No linting tools** are configured (no ESLint, Prettier)
- Manual code review and adherence to existing patterns is required
- Follow the existing code style in `src/components/RandomGenerator.tsx`
- Keep the static site architecture (no backend/database)

## Performance Notes

- Static site with minimal JavaScript bundle
- Very fast build process (~3 seconds)
- Fast test execution (~2 seconds)
- Development server starts in ~1 second

## Troubleshooting

- **"Port already in use" error**: Stop existing dev server with `Ctrl+C`
- **Test failures**: Ensure dev server is stopped before running `npm run test`
- **Build issues**: Check Node.js version (requires 18+)
- **Missing browser error**: Run `npx playwright install chromium`

## Security Considerations

- All random generation uses secure random number generation where applicable
- No sensitive data is stored or transmitted
- Static site with no backend means minimal attack surface
- UUID generation uses v4 (random) for maximum entropy

## Best Practices for AI Agents

1. **Always stop the dev server before running tests** to avoid conflicts
2. **Test comprehensively** - use both automated tests and manual validation
3. **Make minimal changes** - don't refactor unnecessarily
4. **Follow existing patterns** - consistency over personal preference
5. **Document significant changes** in commit messages
6. **Validate in CI** - ensure GitHub Actions workflow passes
7. **Check formats** - use the comprehensive tests as a reference for expected formats
