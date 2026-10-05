const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(30000);
class World { constructor({ attach }) { this.attach = attach; } }
setWorldConstructor(World);
