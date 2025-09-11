# Random8
Random8 is an Astro React web application that generates random data including names, emails, passwords, phone numbers, UUIDs, dates, and complete user personas. The application provides instant copy-to-clipboard functionality and is designed for developers who need random test data.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- Bootstrap and run the application:
  - `npm install --omit=dev` -- installs core dependencies. Takes ~5 seconds.
  - `npm run build` -- builds production application with Astro. Takes ~15 seconds. NEVER CANCEL.
  - `npm run start` -- starts production server via Astro on port 4321. Ready in ~500ms.
- Development workflow:
  - `npm install --omit=dev` -- for core dependencies only
  - `npm run dev` -- starts Astro development server on port 4321. Ready in ~800ms.
- Playwright end-to-end testing:
  - `npm install` -- installs all dependencies including Playwright browser binaries
  - `npm run test` -- runs Playwright tests against localhost:4321
  - `npm run test:ui` -- runs Playwright tests with interactive UI mode
  - Alternative: Use GitHub Actions for e2e testing (see .github/workflows/)

## Build Process and Timing
- **npm install --omit=dev**: 5 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- **npm run build**: 15 seconds with Astro static build. NEVER CANCEL. Set timeout to 60+ seconds.
- **npm run start**: Production server ready in 500ms on port 4321
- **npm run dev**: Development server ready in 800ms on port 4321 with Astro dev server

## Validation
- Always manually test the application functionality after making changes:
  1. Navigate to the running application (localhost:4321 for both dev and production)
  2. Click the main "Random8" button to generate random data
  3. Verify all sections populate: Names, Emails, Numbers, Passwords, Phone numbers, Date & Time, Persona, Pet names, Keys
  4. Test copy functionality by clicking any input field - should show "Copied!" notification
  5. Generate new data multiple times to ensure randomization works
- The application should display data for Czech Republic (🇨🇿), United States (🇺🇸), United Kingdom (🇬🇧), and India (🇮🇳) phone numbers
- Persona section includes disposable email from 1secmail.org with "check email" functionality

## Known Issues and Workarounds
- **Playwright browser installation**: May take additional time on first install to download browser binaries
  - Workaround: Use `npm install --omit=dev` to install only production dependencies
  - Full install with `npm install` includes Playwright browsers for testing
- **ESLint configuration**: No lint script configured in package.json
  - Astro includes basic linting but requires manual ESLint setup for custom rules

## Application Architecture
- **Framework**: Astro 5.13.7 with React 19.1.0 integration and Vercel adapter
- **Key Dependencies**: @astrojs/react, lodash, uuid, node-petname, notiflix
- **Structure**:
  - `/src/pages/index.astro` -- Main application page with Astro component and React integration
  - `/src/components/` -- React components for the application logic
  - `/src/layouts/` -- Astro layout components
  - `/src/styles/` -- CSS modules and global styles
  - `/first-names.json` -- 4,958 first names for random generation
  - `/names.json` -- 21,986 last names for random generation
  - `/tests/` -- Playwright test specifications
  - `/astro.config.mjs` -- Astro configuration with React integration and Vercel adapter
  - `/playwright.config.js` -- Playwright testing configuration

## Data Sources
- First names: 4,958 entries from first-names.json
- Last names: 21,986 entries from names.json  
- Email providers: googlemail.com, gmail.com, hotmail.com
- Disposable email: 1secmail.org (for personas)
- Phone number formats: CZ (+420), US (+1), UK (+44), IN (+91)
- UUID: Version 4 (random) using uuid library
- Pet names: Generated using node-petname library

## Astro-Specific Features
- **Static Site Generation**: Application builds as static files for optimal performance
- **React Integration**: React components work seamlessly within Astro pages
- **Island Architecture**: JavaScript is only loaded for interactive components
- **Vercel Adapter**: Configured for deployment on Vercel platform
- **Development Server**: Hot module replacement and fast refresh in development mode
- **Build Output**: Optimized static files in `dist/` directory after build

## Common Commands Output
### Repository root structure
```
.
├── .github/                 # GitHub Actions workflows
├── astro.config.mjs        # Astro configuration file
├── src/                    # Source code directory
│   ├── pages/              # Astro pages
│   │   ├── index.astro     # Main application page
│   │   └── robots.txt.ts   # SEO robots file
│   ├── components/         # React components
│   ├── layouts/            # Astro layout components
│   └── styles/             # CSS modules and styles
├── tests/                  # Playwright test files
│   └── sanity.spec.js     # Main test specification
├── playwright.config.js    # Playwright configuration
├── public/                # Static assets
├── first-names.json       # 4,958 first names
├── names.json            # 21,986 last names
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build", 
    "start": "astro start",
    "preview": "astro preview",
    "test": "playwright test",
    "test:ui": "playwright test --ui"
  }
}
```

## Testing Scenarios
1. **Basic functionality**: Click Random8 button → all fields populate with random data
2. **Copy functionality**: Click any text field → "Copied!" notification appears  
3. **Data variety**: Generate multiple times → different random values each time
4. **Persona integration**: Verify persona name matches disposable email prefix
5. **Phone number formats**: Verify international format for all 4 countries
6. **UUID validity**: Verify UUID v4 format (8-4-4-4-12 hexadecimal digits)
7. **Performance**: Page loads and data generation should be instantaneous
8. **Playwright testing**: Run `npm run test` to execute automated test suite
9. **Interactive testing**: Use `npm run test:ui` for visual test debugging