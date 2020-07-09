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
let testUser;
let testCategory; 

before(async function () {
  //Connect to in-memory mongodb
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  getMongoDB(mongoUri);

  //Populate the in memory database
  try {
    testUser = new User({ email: 'lobster-ice-cream-lover@gmile.com' });
    await testUser.save(testUser); 

    testCategory = new Category({ title: 'Paris Trip', userId: testUser._id });
    await testCategory.save(testCategory);
  } catch (error) {
    expect(error).to.be.null;
  }
});

after(async function () {
  await mongoose.disconnect();
  await mongoServer.stop();
});

it('There should be one user and one category in the database', async function () {
  try {
    const categoryCount = await Category.countDocuments({});
    expect(categoryCount).to.equal(1);
    const documentCount = await User.countDocuments();
    expect(documentCount).to.equal(1);
  } catch (err) {
    expect(err).to.be.null;
  }
});

describe('categoryRouter', function () {
  describe('/getCategories', function () {
    it('should throw error when no userId is provided in the request', async function () {
      chai
        .request(server)
        .get('/category/getCategories')
        .end(function (err, res) {
          expect(res).to.have.status(404);
          expect(res.body).to.be.empty;
        });
    });
    // TODO: make this into a test suite and check more cases
    it('should return a JSON array with all categories associated with the given userId', async function () {
      chai
        .request(server)
        .get('/category/getCategories/' + testUser._id)
        .set('content-type', 'application/json')
        .send({
          userId: testUser._id,
        }) //TODO: get rid of body, keeping for reference for future tests
        // TODO: Add tests for when err is not null
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].title).equals(testCategory.title);
        });
    });
    //TODO: ADD TESTS FOR ALL OTHER CATEGORY ROUTERS
  });
});
