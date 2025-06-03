# TABLE OF CONTENTS
- [DEMO VIDEOS](#demo-videos)
- [SETUP](#setup)
- [RUNNING TESTS](#running-tests)
- [TEST REPORTS](#test-reports)
  - [Viewing Reports Locally](#viewing-reports-locally)
  - [Viewing Reports in CI](#viewing-reports-in-ci)
  - [Build Numbers and History](#build-numbers-and-history)

# DEMO VIDEOS
[Live Coding & Tech Demos](https://www.youtube.com/playlist?list=PLMYcjser4KJ39fYupgcr-0NuZyV_34PW3)

# SETUP
To set up your local development environment, follow these steps:
1. Clone this repository
2. Install [Node.js & npm](https://nodejs.org/) (LTS version recommended)
3. Run `npm install` in the project root folder to install dependencies
4. Run `npx playwright install` to install required browsers

# RUNNING TESTS

Run tests using the following npm scripts:

```bash
# Run Chat App tests in production environment
npm run chat:e2e:tests:prod

# Run tests in stage environment
npm run chat:e2e:tests:stage

# Run specific test file with UI mode
npx playwright test tests/example.spec.ts --ui

# Run tests in debug mode
DEBUG=pw:api npm run chat:e2e:tests:prod
```

# TEST REPORTS

## Viewing Reports Locally

After running tests, HTML reports are generated in the `playwright-report` directory. To view them:

```bash
# Open the last HTML report
npm run show:report

# Or directly with:
npx playwright show-report
```

## Viewing Reports in CI

Test reports from CI runs are automatically published to GitHub Pages. Reports are organized by test suite and build number.

### Accessing Reports

Base URL: `https://alexzavg.github.io/playwright_retreat/{SUITE_NAME}/{BUILD_NUMBER}`

Example suites:
- `CHAT_E2E_TESTS_PROD`
- `CHAT_E2E_TESTS_STAGE`
- `SOFTSERVE_BULLIES_TESTS_PROD`
- `BOOKRETREATS_E2E_TESTS_PROD`
- `BLOCKCHAIN_TESTS_PROD`
- `GMAIL_TESTS_PROD`
- `AUTHENTICATION_TESTS_PROD`

### Latest Build Reports

To view the most recent report for a suite, use:
```
https://alexzavg.github.io/playwright_retreat/{SUITE_NAME}/latest
```

Example: [Latest Chat E2E Prod Report](https://alexzavg.github.io/playwright_retreat/CHAT_E2E_TESTS_PROD/latest)

## Build Numbers and History

- Each CI run generates a new build number (auto-incremented)
- Reports are preserved with their build numbers for historical reference
- The `latest` directory always points to the most recent successful build
- Build history is maintained in the `gh-pages` branch of the repository

### Viewing Build History

1. Navigate to the Actions tab in GitHub
2. Select the workflow run you're interested in
3. Check the "Deploy to GitHub Pages" job for the published report URL

### Example Report URLs

- Latest production report for Chat E2E tests:
  `https://alexzavg.github.io/playwright_retreat/CHAT_E2E_TESTS_PROD/latest`
  
- Specific build number (e.g., build #42) for Stage environment:
  `https://alexzavg.github.io/playwright_retreat/CHAT_E2E_TESTS_STAGE/42`

## Troubleshooting Reports

- If a report fails to load, check the GitHub Actions workflow for any deployment errors
- Ensure the build completed successfully before trying to view the report
- Clear your browser cache if you're not seeing the latest report updates