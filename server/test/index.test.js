const categoryRouterTests = require('./suites/categoryRouter.test');
const itemRouterTests = require('./suites/itemRouter.test');

describe('Subject', function() {
  describe('categoryRouter tests', categoryRouterTests.bind(this));
  describe('itemRouter tests', itemRouterTests.bind(this));
});
