const { Then } = require('@cucumber/cucumber');
const broken = require('../../pages/BrokenLocators');
Then('the broken locators cannot be resolved', async function () {
  const L = broken(this.page);
  for (const [name, loc] of Object.entries(L)) await loc.waitFor({ timeout: 1500 }).catch(e => { e.message = `[${name}] ` + e.message.split('\n')[0]; throw e; });
});
