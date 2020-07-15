
// MongoDB Models
const Category = require('../../db/models/category');
const User = require('../../db/models/user');
const Item = require('../../db/models/item')
  
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

module.exports =  function categorySuite() {
 
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

  describe('mongo memory db set up', () => {
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
  });
  
  /**
   * Item Router Tests
   */
}
