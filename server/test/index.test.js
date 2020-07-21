const categoryRouterTests = require('./suites/categoryRouter.test');
const itemRouterTests = require('./suites/itemRouter.test');

describe('Server API Tests', function() {
  describe('categoryRouter tests', categoryRouterTests.bind(this));
  describe('itemRouter tests', itemRouterTests.bind(this));
});
