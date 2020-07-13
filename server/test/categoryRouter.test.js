// MongoDB Models
const Category = require('../db/models/category');
const User = require('../db/models/user');

// Require Testing Tools
const server = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');

// Import MongoDB-connecting functions
const { getMongoDB } = require('../db');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Set up Chai
const expect = chai.expect;
chai.use(chaiHttp);

// Mock documents used for testing
let testUser1;
let testUser2;
let testCategory1;
let testCategory2;

before(async () => {
  // Connect to in-memory mongodb
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  getMongoDB(mongoUri);

  // Populate the in memory database
  try {
    testUser1 = new User({ email: 'lobster1@gmile.com' });
    await testUser1.save();

    testUser2 = new User({ email: 'lobster2@gmile.com' });
    await testUser2.save();

    testCategory1 = new Category({
      title: 'User1 Category1',
      userId: testUser1._id,
    });
    await testCategory1.save();

    testCategory2 = new Category({
      title: 'User2 Category1',
      userId: testUser2._id,
    });
    await testCategory2.save();

    // TODO: Add Items to DB for further testing
  } catch (error) {
    expect(error).to.be.null;
  }
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

it('Before: There should be two users and two categories in the database', async () => {
  try {
    const categoryCount = await Category.countDocuments({});
    expect(categoryCount).to.equal(2);
    const userCount = await User.countDocuments();
    expect(userCount).to.equal(2);
  } catch (error) {
    expect(error).to.be.null;
  }
});

describe('categoryRouter', () => {
  describe('/createCategory', function () {
    it('add a second category to Category for user2', (done) => {
      chai
        .request(server)
        .post('/category/createCategory')
        .send({
          userId: testUser2._id,
          title: 'User2 Category2',
        })
        .set('content-type', 'application/json')
        .end(async function (error, response) {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          try {
            const categories = await Category.find({});
            expect(categories.length).to.equal(3);
            expect(categories[0].title).equals(testCategory1.title);
            expect(categories[1].title).equals(testCategory2.title);
            expect(categories[2].title).equals('User2 Category2');
            done();
          } catch (error) {
            expect(error).to.be.null;
          }
        });
    });
  });

  describe('/getCategories', () => {
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
          expect(response.body[0].title).equals('User2 Category1');
          expect(response.body[1].title).equals('User2 Category2');
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

  describe('/deleteCategory', () => {
    it('delete testCategory1 by testUser1 should leave 2 categories left, both by testUser2', (done) => {
      chai
        .request(server)
        .delete('/category/deleteCategory')
        .send({ categoryId: testCategory1._id })
        .set('content-type', 'application/json')
        .end(async (error, response) => {
          expect(response).to.have.status(200);
          const deletedDocument = await Category.findById(testCategory1._id);
          expect(deletedDocument).to.be.null;
          const categories = await Category.find({});
          expect(categories.length).to.equal(2);
          expect(categories[0].title).equals(testCategory2.title);
          expect(categories[1].title).equals('User2 Category2');
          // TODO: Test the deletion of this category in items categoryIds list
          done();
        });
    });
  });
  // TODO: ADD TESTS FOR ALL OTHER ROUTERS
});
