// MongoDB Models
const Category = require('../../db/models/category');
const User = require('../../db/models/user');
const Item = require('../../db/models/item');

// Require Testing Tools
const server = require('../../index');
const chai = require('chai');
const chaiHttp = require('chai-http');

// Import MongoDB-connecting functions
const { getMongoDB } = require('../../db');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Set up Chai
const expect = chai.expect;
chai.use(chaiHttp);

// Mock documents used for testing
let item1;
let item2;
let testUser1;
let testUser2;
let testCategory1;
let testCategory2;

module.exports = function categorySuite() {
  before(async () => {
    // Connect to in-memory mongodb
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    getMongoDB(mongoUri);

    // Populate the in memory database
    testUser1 = new User({ email: 'lobster1@gmile.com' });
    await testUser1.save();

    testUser2 = new User({ email: 'lobster2@gmile.com' });
    await testUser2.save();

    testCategory1 = new Category({
      title: 'User1 Category1',
      userId: testUser1._id,
    });

    testCategory2 = new Category({
      title: 'User2 Category1',
      userId: testUser2._id,
    });

    item1 = new Item({
      sourceLink: 'www.googe.com',
      placesId: 'something',
      userId: testUser1._id,
      highlight: 'highlight words',
      comment: 'sample comments',
      categoryIds: [testCategory1._id],
    });

    item2 = new Item({
      sourceLink: 'www.googe.com',
      placesId: 'something else',
      userId: testUser1._id,
      highlight: 'other highlighted words',
      comment: 'another sample comment',
      categoryIds: [testCategory1._id],
    });

    testCategory1.items = [item1._id, item2._id];
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * Item Router Tests
   */
  // TODO: Item Router Tests in next PR
};
