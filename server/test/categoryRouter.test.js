// MongoDB Models
const Category = require('../db/models/category');
const User = require('../db/models/user');
const Item = require('../db/models/item')

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
let item1;
let item2;
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
    await item1.save();

    item2 = new Item({
      sourceLink: 'www.googe.com', 
      placesId: 'something else', 
      userId: testUser1._id, 
      highlight: 'other highlighted words',
      comment: 'another sample comment',
      categoryIds: [testCategory1._id],
    });
    await item2.save();

    testCategory1.items = [item1._id, item2._id];
    await testCategory1.save();
    await testCategory2.save();

  } catch (error) {
    expect(error).to.be.null;
  }
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

it('Before: two users and two categories in the database, item1 item2 belong to User1 Category1', async () => {
  try {
    const categoryCount = await Category.countDocuments({});
    expect(categoryCount).to.equal(2);

    const userCount = await User.countDocuments();
    expect(userCount).to.equal(2);

    const items = await Item.find({});
    for (const item of items) {
      expect(item.categoryIds[0].toString()).equals(testCategory1._id.toString());
    }
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
  
  describe('/getCategoryItems/:categoryId', () => {
    it('get items in testCategory1, should return response.body.items with 2 items', (done) => {
      chai
        .request(server)
        .get('/category/getCategoryItems/' + testCategory1._id)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.title).equals('User1 Category1');
          expect(response.body.items.length).equals(2);
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
        .get('/category/getCategoryItems/' + 'wrongId')
        .end((error, response) => {
          expect(response).to.not.have.status(200);
          expect(response.body).to.be.empty;
          done();
        })
    });
  });

  describe('/deleteCategory', () => {
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
          expect(categories[1].title).equals('User2 Category2');

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
        .send({ categoryId: 'invalidId' })
        .set('content-type', 'application/json')
        .end(async (error, response) => {
          expect(response).to.not.have.status(200);
          done();
        });
    });
  });
  // TODO: ADD TESTS FOR ALL OTHER ROUTERS
});
