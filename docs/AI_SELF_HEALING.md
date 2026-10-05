# AI Self-Healing Locators

## The 5 intentionally broken locators (`pages/BrokenLocators.js`, run with `npm run test:selfheal`)
| # | Broken locator | Why it is brittle/wrong | Correct fix |
|---|---|---|---|
| 1 | `div.grid > div:nth-child(3) > div.kpi-value` | positional + renamed class | `getByTestId('kpi-maturity')` |
| 2 | `#monthly-sip-input` | stale id | `getByLabel('Monthly SIP')` |
| 3 | `getByRole('button',{name:'Reports'})` | wrong role and text | `getByRole('tab',{name:'Yearly Report'})` |
| 4 | `//svg[2]/rect[1]` | positional XPath | `getByTestId('bar').first()` |
| 5 | `getByTestId('year-filter')` | non-existent testid | `getByLabel('Show')` |

## Pipeline
1. **Detection** – a Cucumber `After` hook catches `TimeoutError`/strict-mode failures on locator actions and records: step text, failing locator string, URL, screenshot.
2. **Context capture** – on failure, grab (a) the accessibility-tree snapshot (`page.accessibility.snapshot()` / `locator('body').ariaSnapshot()`), (b) a trimmed DOM (scripts/styles removed, ≤ 15 KB), (c) the page-object source line.
3. **Prompt** (low temperature, JSON-only output):
   > You repair Playwright locators. Intent: "<step text / locator variable name>". Broken: `<locator>`. Below is the ARIA snapshot and trimmed DOM. Return JSON: `{"candidates":[{"locator":"page.getByRole(...)","strategy":"role|label|testid|text","confidence":0-1,"reason":""}]}`. Rules: prefer role > label > data-testid > text; NEVER positional CSS/XPath or nth-child; the locator must match exactly one element.
4. **Validation before applying** (nothing is auto-merged blindly):
   - evaluate each candidate on the live page: must resolve to **exactly 1** element, visible;
   - element role/accessible name/tag must be compatible with the original intent (a "button" fix must not land on a link);
   - re-run the failing step with the candidate; the original assertion must pass;
   - reject candidates with a banned pattern (`nth-child`, `//`, `>` chains, generated class names).
5. **Apply** – write the winning locator to a *proposed patch* (git branch + PR with before/after screenshot and confidence). A human approves; low confidence (<0.8) never auto-applies. Log every heal to `reports/healing-log.json` to spot recurring drift (usually means a missing `data-testid`).

## POC sketch
```js
// utils/heal.js (sketch)
async function heal(page, brokenLocator, intent) {
  const aria = await page.locator('body').ariaSnapshot();
  const reply = await callClaude({ intent, brokenLocator, aria }); // JSON only
  for (const c of reply.candidates.sort((a,b)=>b.confidence-a.confidence)) {
    const loc = eval(c.locator.replace(/^page/, 'page'));           // use a safe parser in real code
    if (await loc.count() === 1 && await loc.isVisible()) return c; // validate, then propose a patch
  }
  return null;
}
```
