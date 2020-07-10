//MongoDB Models
const Category = require('../db/models/category');
const User = require('../db/models/user');

//Require Testing Tools
const server = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');

//Import MongoDB-connecting functions
const { getMongoDB } = require('../db');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

//Set up Chai
const expect = chai.expect;
chai.use(chaiHttp);

//Mock documents used for testing 
let testUser1;
let testUser2;
let testCategory; 

before(async () =>{
  //Connect to in-memory mongodb
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  getMongoDB(mongoUri);

  //Populate the in memory database
  try {
    testUser1 = new User({ email: 'lobster1@gmile.com' });
    await testUser1.save(); 

    testUser2 = new User({ email: 'lobster2@gmile.com' });
    await testUser2.save(); 

    testCategory = new Category({ title: 'Paris Trip', userId: testUser1._id });
    await testCategory.save();
  } catch (error) {
    expect(error).to.be.null;
  }
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

it('Before: There should be two users and one category in the database', async () => {
  try {
    const categoryCount = await Category.countDocuments({});
    expect(categoryCount).to.equal(1);
    const documentCount = await User.countDocuments();
    expect(documentCount).to.equal(2);
  } catch (error) {
    expect(error).to.be.null;
  }
});

describe('categoryRouter', function () {
  describe('/createCategory', function () {
    it('add a second category to Category by user1', (done) => {
      chai
        .request(server)
        .post('/category/createCategory')
        .send({
          userId: testUser1._id,
          title: 'Test Title', 
        })
        .end( async function (error, response) {
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          try {
            const categories = await Category.find({});
            expect(categories.length).to.equal(2);
            expect(categories[0].title).to.equal('Paris Trip');
            expect(categories[1].title).to.equal('Test Title');
            done();
          } catch (error) {
            expect(error).to.be.null;
          }
        });
    });
  });

  describe('/getCategories', function () {
    it('should send error status when no userId is provided in the request', (done) => {
      chai
        .request(server)
        .get('/category/getCategories')
        .end((error, response) => {
          expect(response).to.not.have.status(200);
          expect(response.body).to.be.empty;
          done();
        });
    });
    // TODO: make this into a test suite and check more cases
    it('should return a JSON array with all categories associated with the given userId', (done) => {
      chai
        .request(server)
        .get('/category/getCategories/' + testUser1._id)
        .set('content-type', 'application/json')
        .send({
          userId: testUser1._id,
        }) //TODO: get rid of body, keeping for reference for future tests
        // TODO: Add tests for when err is not null
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.lengthOf(2);
          expect(response.body[0].title).equals(testCategory.title);
          done();
        });
    });
    //TODO: ADD TESTS FOR ALL OTHER CATEGORY ROUTERS
  });
});
