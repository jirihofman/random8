# Random8
Random8 is a Next.js React web application that generates random data including names, emails, passwords, phone numbers, UUIDs, dates, and complete user personas. The application provides instant copy-to-clipboard functionality and is designed for developers who need random test data.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- Bootstrap and run the application:
  - `npm install --omit=dev` -- installs core dependencies. Takes ~5 seconds.
  - `npm run build` -- builds production application. Takes ~20 seconds. NEVER CANCEL.
  - `npm start` -- starts production server on port 2999. Ready in ~350ms.
- Development workflow:
  - `npm install --omit=dev` -- for core dependencies only
  - `npm run dev` -- starts development server with Turbopack on port 3000. Ready in ~700ms.
- Cypress end-to-end testing:
  - `npm install` -- fails due to network restrictions downloading Cypress binary from download.cypress.io
  - Alternative: Use GitHub Actions for e2e testing (see .github/workflows/cypress-e2e.yml)
  - CI runs: `npm run build && npm start` then Cypress tests against localhost:2999

## Build Process and Timing
- **npm install --omit=dev**: 5 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- **npm run build**: 20 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- **npm start**: Production server ready in 350ms on port 2999
- **npm run dev**: Development server ready in 700ms on port 3000 with Turbopack

## Validation
- Always manually test the application functionality after making changes:
  1. Navigate to the running application (localhost:3000 for dev, localhost:2999 for production)
  2. Click the main "Random8" button to generate random data
  3. Verify all sections populate: Names, Emails, Numbers, Passwords, Phone numbers, Date & Time, Persona, Pet names, Keys
  4. Test copy functionality by clicking any input field - should show "Copied!" notification
  5. Generate new data multiple times to ensure randomization works
- The application should display data for Czech Republic (🇨🇿), United States (🇺🇸), United Kingdom (🇬🇧), and India (🇮🇳) phone numbers
- Persona section includes disposable email from 1secmail.org with "check email" functionality

## Known Issues and Workarounds
- **Cypress installation fails** due to network restrictions accessing download.cypress.io
  - Workaround: Use `npm install --omit=dev` to install only production dependencies
  - E2E testing runs successfully in GitHub Actions CI environment
- **ESLint configuration**: No lint script configured in package.json
  - Next.js includes eslint-config-next as dev dependency but requires manual setup
  - `npx next lint` prompts for configuration (Strict/Base/Cancel)

## Application Architecture
- **Framework**: Next.js 15.2.4 with React 19.1.0 and Turbopack
- **Key Dependencies**: lodash, uuid, node-petname, notiflix
- **Structure**:
  - `/app/page.jsx` -- Main application component with all random generation logic
  - `/components/notes.jsx` -- Notes, tips, and credits component
  - `/first-names.json` -- 4,958 first names for random generation
  - `/names.json` -- 21,986 last names for random generation
  - `/styles/` -- CSS modules for styling
  - `/cypress/` -- E2E test specifications

## Data Sources
- First names: 4,958 entries from first-names.json
- Last names: 21,986 entries from names.json  
- Email providers: googlemail.com, gmail.com, hotmail.com
- Disposable email: 1secmail.org (for personas)
- Phone number formats: CZ (+420), US (+1), UK (+44), IN (+91)
- UUID: Version 4 (random) using uuid library
- Pet names: Generated using node-petname library

## Common Commands Output
### Repository root structure
```
.
├── .github/                 # GitHub Actions workflows
├── app/                     # Next.js app directory
│   ├── layout.jsx          # Root layout component
│   ├── page.jsx            # Main application page
│   └── robots.txt          # SEO robots file
├── components/             # React components
│   └── notes.jsx          # Notes and credits component
├── cypress/               # E2E test files
│   ├── e2e/
│   │   └── sanity.spec.js # Main test specification
│   ├── plugins/
│   └── support/
├── public/                # Static assets
├── styles/                # CSS modules
├── cypress.config.js      # Cypress configuration
├── first-names.json      # 4,958 first names
├── names.json           # 21,986 last names
├── package.json         # Dependencies and scripts
└── README.md           # Project documentation
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build", 
    "start": "next start -p 2999"
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