const Category = require('../db/models/category');
const server = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { getMongoDB } = require('../db');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../db/models/user');

let exampleCategory;
let defaultUser;
let mongoServer;
const expect = chai.expect;
chai.use(chaiHttp);

function handleErr(err) {
  expect(err).to.be.null;
}

before(async function () {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  getMongoDB(mongoUri);
  defaultUser = new User({ email: 'lobster-ice-cream-lover@gmeil.com' });
  defaultUser.save(handleErr);
  exampleCategory = new Category({
    title: 'hello there',
    userId: defaultUser._id,
  });
  exampleCategory.save(handleErr);
});

after(async function () {
  await mongoose.disconnect();
  await mongoServer.stop();
});

it('There should be one user in the database', async function () {
  try {
    const category = await Category.find({});
  } catch (err) {
    expect(err).to.be.null;
  }
  const documentCount = await User.countDocuments();
  expect(documentCount).to.equal(1);
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
        .get('/category/getCategories/' + defaultUser._id)
        .set('content-type', 'application/json')
        .send({
          userId: defaultUser._id,
        }) //TODO: get rid of body, keeping for reference for future tests
        // TODO: Add tests for when err is not null
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].title).equals(exampleCategory.title);
        });
    });
    //TODO: ADD TESTS FOR ALL OTHER CATEGORY ROUTERS
  });
});
