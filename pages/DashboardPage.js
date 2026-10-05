const { baseUrl } = require('../config/env');
class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
    this.reportTab = page.getByRole('tab', { name: 'Yearly Report' });
    this.monthly = page.getByLabel('Monthly SIP');
    this.rate = page.getByLabel('Expected return');
    this.years = page.getByLabel('Investment period');
    this.stepup = page.getByLabel('Annual step-up');
    this.invested = page.getByTestId('kpi-invested');
    this.returns = page.getByTestId('kpi-returns');
    this.maturity = page.getByTestId('kpi-maturity');
    this.donut = page.getByRole('img', { name: /donut/i });
    this.bars = page.getByRole('img', { name: /bar chart/i });
    this.barItems = page.getByTestId('bar');
    this.filter = page.getByLabel('Show');
    this.reportRows = page.getByRole('table', { name: 'Yearly breakdown' }).locator('tbody tr');
  }
  async open() { await this.page.goto(baseUrl); }
  async fill(m, r, y, s = 0) {
    for (const [loc, v] of [[this.monthly, m], [this.rate, r], [this.years, y], [this.stepup, s]]) await loc.fill(String(v));
  }
  error(field) { return this.page.getByTestId(`err-${field}`); }
  async sliceValue(name) { return Number(await this.page.getByTestId(`slice-${name}`).getAttribute('data-value')); }
}
module.exports = DashboardPage;
