const Category = require('../db/models/category');
const categoryRouter = require('../api/categoryRouter');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { getDB } = require('../db');
const MongoClient = require('mongodb');
const MongoMemoryServer = require('mongodb-memory-server');
const mongoose = require('mongoose');

let exampleCategory;
let defaultUser;
let mongoServer;
let User;
const expect = chai.expect;
chai.use(chaiHttp);

function handleErr(err) {
  expect(err).to.be.null;
}

before(async function () {
  mongoServer = new MongoMemoryServer.default();
  const mongoUri = await mongoServer.getUri();
  getDB(mongoUri);
  User = require('../db/models/user');
  defaultUser = new User({ email: 'lobster-ice-cream-lover@gmeil.com' });
  defaultUser.save(handleErr);
  exampleCategory = new Category({ title: 'hello there', userId: defaultUser._id });
  exampleCategory.save(handleErr);
});

after(async function () {
  await mongoose.disconnect();
  await mongoServer.stop();
});

it('There should be one user in the database', async function () {
  await Category.find(function (err, categories) {
    expect(err).to.be.null;
    console.log(categories);
  });
  const cnt = await User.countDocuments();
  expect(cnt).to.equal(1);
});

describe('categoryRouter', function () {
  describe('/getCategories', function () {
    it('should return an empty list when no userId is provided in the request', async function () {
      chai
        .request(categoryRouter)
        .get('/getCategories')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.length(0);
        });
    });
    // TODO: make this into a test suite and check more cases
    it('should return a JSON array with all categories associated with the given userId', async function () {
      chai
        .request(categoryRouter)
        .get('/getCategories')
        .set('content-type', 'application/json')
        .send({
          userId: defaultUser._id
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.length(1);
          expect(res.body[0].title).equals(exampleCategory.title);
        });
    });
  });
});
