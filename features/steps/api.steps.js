const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const post = async (w, data) => { w.payload = data; w.res = await w.api.post('/posts', { data, headers: { 'Content-type': 'application/json; charset=UTF-8' } }); };
When('I POST a post with a title of {int} characters', async function (n) { await post(this, { title: 'A'.repeat(n), body: 'b', userId: 1 }); });
When('I POST a post with title {string}', async function (t) { await post(this, { title: t, body: 'b', userId: 1 }); });
When('I POST a post without a userId', async function () { await post(this, { title: 't', body: 'b' }); });
Then('the response status is not a server error', async function () { expect(this.res.status()).to.be.lessThan(500); });
Then('the response is either a client error or an echo of the payload', async function () {
  const s = this.res.status();
  if (s >= 400) { expect(s).to.be.lessThan(500); return; }
  expect(s).to.equal(201);
  const b = await this.res.json();
  expect(b).to.have.property('id');
  expect(b.title).to.equal(this.payload.title);
});
