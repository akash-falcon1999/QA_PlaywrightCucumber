// INTENTIONALLY BROKEN locators for the AI self-healing exercise (see docs/AI_SELF_HEALING.md).
module.exports = (page) => ({
  maturity: page.locator('div.grid > div:nth-child(3) > div.kpi-value'),   // 1. positional + renamed class
  monthly:  page.locator('#monthly-sip-input'),                            // 2. stale id (real: #monthly)
  reportTab: page.getByRole('button', { name: 'Reports' }),                // 3. wrong role + text (real: tab "Yearly Report")
  firstBar: page.locator('//svg[2]/rect[1]'),                              // 4. positional XPath
  filter:   page.getByTestId('year-filter'),                               // 5. wrong testid (real: label "Show")
});
