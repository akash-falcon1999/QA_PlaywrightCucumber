# WealthRamp – Playwright + Cucumber QA Framework (Assessment Section A)

**WealthRamp** is a SIP (mutual-fund) wealth planner: dashboard KPIs, a donut chart (invested vs returns), a yearly-growth bar chart, and a filterable yearly report, with input validation and optional annual step-up.

## Setup & run
```bash
npm install && npx playwright install chromium
cp .env.example .env
npm start                 # app on http://localhost:3000 (keep running in a 2nd terminal)
npm test                  # all UI + API tests (excludes the self-heal demo)
npm run test:ui | test:api
npm run test:selfheal     # EXPECTED to fail – broken locators on purpose
npm run sql               # runs SQL scenarios on SQLite, writes sql/results.txt
```
Reports: `reports/cucumber-report.html`, `reports/cucumber-report.json`, screenshots in `reports/screenshots/`.

## Architecture
```
app/index.html      the web app (vanilla JS, inline SVG charts, no CDN)
server.js           tiny static server
config/env.js       env config (.env): BASE_URL, API_BASE_URL, HEADLESS – no hardcoded URLs
features/*.feature  Gherkin: dashboard, API, self-heal demo
features/steps/    step definitions
features/support/  world + hooks (browser lifecycle, screenshots on every scenario)
pages/             Page Object Model (role/label/data-testid locators only)
utils/sip.js       independent closed-form oracle: FV = P·((1+i)^n−1)/i·(1+i)
sql/               schema, scenario queries, run_sql.py, results.txt
docs/AI_SELF_HEALING.md
```
Design choices: the oracle is a closed-form formula, deliberately different from the app's month-by-month loop, so the test is truly independent. Chart tests read `data-*` attributes and assert bar balances are positive and strictly increasing.

## A3 – JSONPlaceholder note
JSONPlaceholder is a *fake* API: it does not validate input and returns `201` echoing almost any payload (including missing `userId`). The tests therefore assert what is verifiable – **never a 5xx**, and either a 4xx or a faithful 201 echo – and the behaviour is documented rather than pretending it returns 400.

## A4 – SQL
`sql/schema.sql` (tables + sample data), `sql/scenario1_round_trips.sql` (self-join, 24h window, ±10%), `sql/scenario2_streaks.sql` (gaps-and-islands with window functions; Rohit is correctly excluded because 29 runs breaks his streak). Output: `sql/results.txt`.

## Test results
- API (5 scenarios): **passed** – see `reports/`.
- UI: ⚠️ **run `npm test` on your machine and commit the refreshed `reports/` folder** (my sandbox could not download the browser). Math oracle vs app logic was verified (₹23,23,391 for 10,000/12%/10y).

## AI Assistant(here mostly Github Copilot and a little Claude) reflection  
- **How I used it:** 
 **Framework Scaffolding: Started by describing the desired Playwright + Cucumber BDD framework in plain language. The AI scaffolded the initial directory layout, separating features, step definitions, and Page Object Model (POM) files, alongside environment configuration files to avoid hardcoded URLs.  
 **Test Scenario & Step Definition Generation: Used the AI to draft gherkin feature files and map them to Playwright step definitions, particularly for complex component interactions like handling range sliders and calendar widgets.
 **Debugging & Complex Querying: Utilized the AI to brainstorm and refine complex SQL window functions for the IPL player performance streak scenario and the 24-hour round-trip transaction analysis.   Self-Healing Locator Strategy: Collaborated with the AI to design a conceptual approach and proof-of-concept for handling brittle or broken locators via self-healing mechanisms.2. What Worked Well
- **What worked:** Rapid Boilerplate & Setup: Generating the initial configuration files, Playwright setup, and Cucumber configuration saved a significant amount of manual setup time.

**Accelerating Unfamiliar APIs: The AI proved helpful in quickly suggesting methods for interacting with complex DOM elements, such as extracting numerical values from chart tooltips and handling dynamic iframe/canvas elements.

- **What did not / what I corrected:**
**Hallucinated Selectors and APIs: The AI occasionally suggested outdated or non-existent Playwright locators or incorrect method signatures (e.g., misusing specific assertion matchers). These had to be corrected by cross-referencing official Playwright documentation.
**Brittle Locator Suggestions: Initially, the AI proposed positional CSS or XPath selectors based on parent-child DOM positions. These were actively overwritten in favor of resilient, dynamic locators (data-testid, role, or text-based locators) per framework guidelines.   
**Subtle Logic & Calculation Bugs: For math-heavy validations (such as verifying EMI calculation logic against the UI display), the AI's initial formula implementation had minor rounding and compounding discrepancies. Human oversight was mandatory to ensure independent mathematical accuracy before asserting it against the application.
