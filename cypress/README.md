# Cypress Test Automation

This project provides a flexible testing framework using Cypress with support for multiple environments, applications, and test suites.

## Table of Contents
- [Setup](#setup)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Test Structure](#test-structure)
  - [Running Tests](#running-tests)

## Setup

1. **Prerequisites**
   - Node.js (v14+)
   - npm or yarn
   - Chrome or Chromium browser

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.stage` and `.env.prod`
   - Update the environment variables in each file as needed

## Configuration

### Environment Variables

#### Core Configuration
- `ENV`: The target environment (e.g., `stage`, `prod`). Defaults to `stage`.
- `APP_NAME`: The name of the application under test (e.g., `testApp`).
- `SUITE_NAME`: The type of tests to run (e.g., `e2e`, `api`). Defaults to `e2e`.

#### Custom Environment Variables
All variables prefixed with `CYPRESS_` in your `.env` files will be automatically loaded and made available in your tests via `Cypress.env()`.

Example `.env.stage`:
```
CYPRESS_BASE_URL=https://stage.example.com
CYPRESS_ENV_NAME=Staging
CYPRESS_API_KEY=your_api_key_here
```

### Test Structure
Tests are organized in the following directory structure:
```
cypress/
  tests/
    {appName}/         # e.g., testApp/
      {suiteName}/      # e.g., e2e/ or api/
        *.spec.ts      # Test files
```

### Running Tests

### Browser Configuration

**Important:** Always explicitly specify the browser using the `--browser` flag, even when using Chrome. This makes the test command's intent clear and prevents any ambiguity.

```bash
# Always specify the browser explicitly
--browser chrome    # Recommended: Explicitly specify Chrome
--browser firefox   # Requires Firefox to be installed
--browser edge      # Requires Edge to be installed
--browser electron  # Built-in headless browser
```

❌ **Don't** rely on default browser behavior  
✅ **Do** always specify `--browser` explicitly

### Available Scripts

#### 1. Interactive Test Runner (GUI Mode)

```bash
# Explicitly specify Chrome (recommended)
ENV=stage APP_NAME=testApp SUITE_NAME=e2e cypress open --e2e --browser chrome

# Run in Firefox
ENV=stage APP_NAME=testApp SUITE_NAME=e2e cypress open --e2e --browser firefox

# Run in Edge
ENV=stage APP_NAME=testApp SUITE_NAME=e2e cypress open --e2e --browser edge
```

#### 2. Headless Test Execution (CI/CD)

```bash
# Explicitly specify Chrome (recommended)
ENV=stage APP_NAME=testApp SUITE_NAME=e2e cypress run --e2e --browser chrome

# Run in Firefox
ENV=stage APP_NAME=testApp SUITE_NAME=e2e cypress run --e2e --browser firefox

# Run in headless mode (Electron)
ENV=stage APP_NAME=testApp SUITE_NAME=e2e cypress run --e2e --browser electron
```

#### 3. API Tests

```bash
# Explicitly specify Chrome for API tests
ENV=stage APP_NAME=testApp SUITE_NAME=api cypress run --e2e --browser chrome

# Run API tests in Firefox
ENV=stage APP_NAME=testApp SUITE_NAME=api cypress run --e2e --browser firefox
```

### Environment-Specific Runs

All examples above use the staging environment (`.env.stage`). For production:

```bash
# Production environment examples
npm run cy:run:testApp:e2e:prod
ENV=prod APP_NAME=testApp SUITE_NAME=e2e cypress run --e2e --browser firefox
```

#### Environment-Specific Configurations

- **Staging Environment**: Uses `.env.stage`
- **Production Environment**: Uses `.env.prod`

## How It Works

### 1. Environment Loading
- The framework loads environment variables from `.env.{ENV}` based on the `ENV` variable
- All `CYPRESS_` prefixed variables are automatically exposed to your tests

### 2. Test Discovery
- Tests are discovered based on the `APP_NAME` and `SUITE_NAME`
- The pattern `cypress/tests/{APP_NAME}/{SUITE_NAME}/**/*.spec.ts` is used to find test files

### 3. Browser Configuration
- **Always** use the `--browser` flag to explicitly specify the browser
- Even though Chrome is the default, explicitly specifying it makes the test command's intent clear
- Supported browsers: Chrome, Firefox, Edge, and Electron
- The browser must be installed on the system (except for Electron which is built-in)
- Example: `--browser chrome` for Chrome, `--browser firefox` for Firefox
- This practice helps prevent unexpected behavior and makes test commands self-documenting

### 4. Test Execution
- `cypress open` launches the interactive test runner
- `cypress run` runs tests headlessly (useful for CI/CD)

## Best Practices
1. Keep environment-specific configurations in their respective `.env` files
2. Use `Cypress.env()` to access environment variables in tests
3. Follow the directory structure for better organization
4. Add new test scripts to `package.json` following the existing naming convention

## Troubleshooting
- If tests fail to find the browser, ensure it's installed and the path is correct
- Check the browser console logs for any errors during test execution
- Verify environment variables are correctly set in the appropriate `.env` file
