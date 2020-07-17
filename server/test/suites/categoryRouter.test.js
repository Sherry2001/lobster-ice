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
      await Category.deleteMany({});
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

    it('/getCategories SetUp test: 3 categories in Category db', async () => {
      const documentCount = await Category.countDocuments();
      expect(documentCount).equals(3);
    })

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
          expect(response.body[0]._id.toString()).equals(testCategory1._id.toString());
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

  describe('/getCategoryItems/:categoryId', () => {
    before(async () => {
      await item1.save();
      await item2.save();
    });

    after(async () => {
      await Item.findByIdAndDelete(item2._id);
    })

    it('/getCategoryItems SetUp test: 3 categories in Category db, 2 items in Item db', async () => {
      const categoryCount = await Category.countDocuments();
      expect(categoryCount).equals(3);
      const itemCount = await Item.countDocuments();
      expect(itemCount).equals(2);
    })

    it('get items in testCategory1, should return response.body.items with 2 items', (done) => {
      chai
        .request(server)
        .get('/category/getCategoryItems/' + testCategory1._id)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.title).equals(testCategory1.title);
          expect(response.body.items).to.have.lengthOf(2);
          expect(response.body.items[0]._id.toString()).equals(item1._id.toString());
          expect(response.body.items[1]._id.toString()).equals(item2._id.toString());
          done();
        })
    });
    it('get items in testCategory2, should return empty items list', (done) => {
      chai
        .request(server)
        .get('/category/getCategoryItems/' + testCategory2._id)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.title).equals('User2 Category1');
          expect(response.body.items).to.be.empty;
          done();
        })
    });
    it('get items for invalid categoryId in request, should respond with error status', (done) => {
      chai
        .request(server)
        .get('/category/getCategoryItems/' + item1._id)
        .end((error, response) => {
          expect(response).to.not.have.status(200);
          expect(response.body).to.be.empty;
          done();
        })
    });
  });

  describe('/deleteCategory', () => {
    it('/deleteCategory SetUp test: 3 categories in Category db, 1 item in Item Db', async () => {
      const categoryCount = await Category.countDocuments();
      expect(categoryCount).equals(3);
      const itemCount = await Item.countDocuments();
      expect(itemCount).equals(1);
    })

    it('delete testCategory1 should leave 2 categories left and Item1s categoryIds empty', (done) => {
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
          expect(categories[1].title).equals(testCategory3.title);

          // Check testCategory1 deleted from item1's list
          const item = await Item.findById(item1._id);
          expect(item.categoryIds.length).equals(0);
          done();
        });
    });
    it('delete invalid categoryId, respond with error status', (done) => {
      chai
        .request(server)
        .delete('/category/deleteCategory')
        .send({ categoryId: item1._id })
        .set('content-type', 'application/json')
        .end(async (error, response) => {
          expect(response).to.not.have.status(200);
          done();
        });
    });
  });
};
