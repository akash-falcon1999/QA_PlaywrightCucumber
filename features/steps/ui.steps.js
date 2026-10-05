const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { expect: pw } = require('playwright/test');
const { futureValue, parseInr } = require('../../utils/sip');

Given('I open the WealthRamp app', async function () { await this.dashboard.open(); });
When('I plan a SIP of {int} at {float} percent for {int} years', async function (m, r, y) { await this.dashboard.fill(m, r, y); });
When('I enter {int} as the monthly SIP', async function (v) { await this.dashboard.monthly.fill(String(v)); });
When('I open the yearly report and show the first 5 years', async function () {
  await this.dashboard.reportTab.click(); await this.dashboard.filter.selectOption('5');
});
Then('the dashboard shows invested, returns and maturity values', async function () {
  for (const l of [this.dashboard.invested, this.dashboard.returns, this.dashboard.maturity]) await pw(l).toHaveText(/₹[\d,]+/);
});
Then('the donut and bar charts are visible', async function () {
  await pw(this.dashboard.donut).toBeVisible(); await pw(this.dashboard.bars).toBeVisible();
});
Then('the maturity value equals the formula result within 1 rupee', async function () {
  const [m, r, y] = [await this.dashboard.monthly.inputValue(), await this.dashboard.rate.inputValue(), await this.dashboard.years.inputValue()].map(Number);
  const actual = parseInr(await this.dashboard.maturity.innerText());
  expect(Math.abs(actual - futureValue(m, r, y))).to.be.at.most(1);
  const inv = parseInr(await this.dashboard.invested.innerText());
  expect(inv).to.equal(m * y * 12);
});
Then('both donut slices are greater than zero', async function () {
  expect(await this.dashboard.sliceValue('invested')).to.be.greaterThan(0);
  expect(await this.dashboard.sliceValue('returns')).to.be.greaterThan(0);
});
Then('the bar chart has {int} bars with strictly increasing balances', async function (n) {
  await pw(this.dashboard.barItems).toHaveCount(n);
  const v = await this.dashboard.barItems.evaluateAll(els => els.map(e => Number(e.dataset.balance)));
  v.forEach((x, i) => { expect(x).to.be.greaterThan(0); if (i) expect(x).to.be.greaterThan(v[i - 1]); });
});
Then('the report has {int} rows', async function (n) { await pw(this.dashboard.reportRows).toHaveCount(n); });
Then('I see the validation error {string}', async function (msg) { await pw(this.dashboard.error('monthly')).toHaveText(msg); });
