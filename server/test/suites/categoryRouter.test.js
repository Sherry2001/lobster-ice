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
let testCategory3;

module.exports = function categorySuite() {
  before(async () => {
    // Connect to in-memory mongodb
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    getMongoDB(mongoUri);

    // Prepare mock documents
    testUser1 = new User({ email: 'lobster1@gmile.com' });
    testUser2 = new User({ email: 'lobster2@gmile.com' });

    testCategory1 = new Category({
      title: 'User1 Category1',
      userId: testUser1._id,
    });

    testCategory2 = new Category({
      title: 'User2 Category1',
      userId: testUser2._id,
    });

    testCategory3 = new Category({
      title: 'User2 Category2',
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
   * Category Router Tests
   */
  describe('/createCategory', function () {
    after(async () => {
      await Category.remove({});
    });

    it('add a new category by user2', (done) => {
      chai
        .request(server)
        .post('/category/createCategory')
        .send({
          userId: testUser2._id,
          title: 'User2 New Category',
        })
        .set('content-type', 'application/json')
        .end(async function (error, response) {
          expect(response).to.have.status(200);
          try {
            const categories = await Category.find({});
            expect(categories).to.have.lengthOf(1);
            expect(categories[0].title).equals('User2 New Category');
            done();
          } catch (error) {
            expect(error).to.be.null;
          }
        });
    });
  });

  describe('/getCategories', () => {
    before(async () => {
      await testCategory1.save();
      await testCategory2.save();
      await testCategory3.save();
    });
    after(async () => {
      await Category.remove({});
    });

    it('error status and no response when no userId is provided in the request', (done) => {
      chai
        .request(server)
        .get('/category/getCategories')
        .end((error, response) => {
          expect(response).to.not.have.status(200);
          expect(response.body).to.be.empty;
          done();
        });
    });

    it('valid request- response body is JSON array of all categories (1) of testUser1', (done) => {
      chai
        .request(server)
        .get('/category/getCategories/' + testUser1._id)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.lengthOf(1);
          expect(response.body[0].title).equals(testCategory1.title);
          done();
        });
    });

    it('valid request- response body is JSON array of all categories (2) of testUser2', (done) => {
      chai
        .request(server)
        .get('/category/getCategories/' + testUser2._id)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.lengthOf(2);
          expect(response.body[0].title).equals(testCategory2.title);
          expect(response.body[1].title).equals(testCategory3.title);
          done();
        });
    });

    it('request userId invalid or doesnt have documents- response body is empty', (done) => {
      chai
        .request(server)
        .get('/category/getCategories/' + 'randomUserId')
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.empty;
          done();
        });
    });
  });
};
