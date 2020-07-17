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

// TODO: Mock documents used for testing

module.exports = function categorySuite() {
  before(async () => {
    // Connect to in-memory mongodb
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    getMongoDB(mongoUri);
  });

  //TODO: Populate mock documents used for testing 
  
  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * Item Router Tests
   */
  // TODO: Item Router Tests in next PR
};
