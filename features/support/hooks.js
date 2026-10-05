const { AfterAll, Before, After, Status } = require('@cucumber/cucumber');
const { chromium, request } = require('playwright');
const env = require('../../config/env');
const DashboardPage = require('../../pages/DashboardPage');
let browser;
AfterAll(async () => { if (browser) await browser.close(); });
Before({ tags: '@ui or @selfheal-demo' }, async function () {
  browser = browser || await chromium.launch({ headless: env.headless, slowMo: env.slowMo });
  this.context = await browser.newContext(); this.page = await this.context.newPage();
  this.dashboard = new DashboardPage(this.page);
});
Before({ tags: '@api' }, async function () { this.api = await request.newContext({ baseURL: env.apiBaseUrl }); });
After(async function (scenario) {
  if (this.page) {
    const png = await this.page.screenshot({ fullPage: true });
    await this.attach(png, 'image/png');
    require('fs').mkdirSync('reports/screenshots', { recursive: true });
    const n = scenario.pickle.name.replace(/\W+/g, '_');
    require('fs').writeFileSync(`reports/screenshots/${scenario.result.status}_${n}.png`, png);
    await this.context.close();
  }
  if (this.api) await this.api.dispose();
});
