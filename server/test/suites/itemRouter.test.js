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
  });

  //TODO: Populate mock documents used for testing 
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

  item3 = new Item({
    sourceLink: 'www.google.com',
    userId: testUser2._id,
    highlight: 'some message',
    comment: 'another comment',
  })

  testCategory1.items = [item1._id, item2._id];
  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  /**
   * Item Router Tests
   */
  describe('/addItem', () => {
    after(async () => {
      await Item.deleteMany({});
    });

    it('add a new item by user1', (done) => {
      const highlightWords = 'highlighted words for this test';
      chai
        .request(server)
        .post('/item/addItem')
        .send({
          sourceLink: 'www.googe.com',
          userId: testUser1._id,
          highlight: highlightWords,
        })
        .set('content-type', 'application/json')
        .end(async (error, response) => {
          expect(response).to.have.status(200);
          const items = await Item.find({});
          expect(items).to.have.lengthOf(1);
          expect(items[0].highlight).equals(highlightWords);
          done();
        });
    });
  });

  describe('/getItems/:userId', () => {
    before(async () => {
      await item1.save();
      await item2.save();
      await item3.save();
    });
    
    it('/getItems/:userId SetUp test: 3 items in Itemdb', async () => {
      const documentCount = await Item.countDocuments();
      expect(documentCount).equals(3);
    });

    it('get all items by user1, should return 2 items', (done) => {
      chai 
        .request(server)
        .get('/item/getItems/' + testUser1._id)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.lengthOf(2);
          expect(response.body[0]._id.toString()).equals(item1._id.toString());
          expect(response.body[1]._id.toString()).equals(item2._id.toString());
          done();
        });
    });

    it('get all items by user2, should return 1 item', (done) => {
      chai
        .request(server)
        .get('/item/getItems/' + testUser2._id)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.lengthOf(1);
          expect(response.body[0]._id.toString()).equals(item3._id.toString());
          done();
        });
    });

    it('request userId does not have items, respond with empty body', (done) =>{
      chai 
        .request(server)
        .get('/item/getItems/' + testCategory1._id)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.empty;
          done();
        });
    });
  });
  // TODO: Item Router Tests in next PR
};
