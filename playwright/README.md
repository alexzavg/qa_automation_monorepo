# TABLE OF CONTENTS
- [DEMO VIDEO](#demo-video)
- [SETUP](#setup)
- [VIEW HTML REPORTS LOCALLY](#view-html-reports-locally)
- [VIEW HTML REPORTS IN CI](#view-html-reports-in-ci)

# DEMO VIDEOS
[Live Coding & Tech Demos](https://www.youtube.com/playlist?list=PLMYcjser4KJ39fYupgcr-0NuZyV_34PW3)

# SETUP
To set the foundation for the tests on your local env simply go through the following steps:
1. Clone this repo
2. Install [nodejs & npm](https://nodejs.org/en/) 
3. Run `npm run setup` in the project root folder
4. To run the Chat App tests run `npm run chat:e2e:tests:prod` (or other commands, please see `package.json` for available cmds)

## VIEW HTML REPORTS LOCALLY
HTML reports can be viewed in the `html_report` folder after running the tests.
Run `npm run show:report` to open the HTML report.

## VIEW HTML REPORTS IN CI
HTML reports are deployed to GitHub Pages and can be viewed at https://alexzavg.github.io/playwright_retreat/{suite}, e.g. 
- https://alexzavg.github.io/playwright_retreat/CHAT_E2E_TESTS_PROD
- https://alexzavg.github.io/playwright_retreat/SOFTSERVE_BULLIES_TESTS_PROD
- https://alexzavg.github.io/playwright_retreat/BOOKRETREATS_E2E_TESTS_PROD
- https://alexzavg.github.io/playwright_retreat/BLOCKCHAIN_TESTS_PROD
- https://alexzavg.github.io/playwright_retreat/GMAIL_TESTS_PROD
- https://alexzavg.github.io/playwright_retreat/AUTHENTICATION_TESTS_PROD

Same for stage env, just replace `PROD` prefix with `STAGE`.