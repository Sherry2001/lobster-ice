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
  if (err) {
    throw err;
  }
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
    handleErr(err);
    console.log(categories);
  });
  const cnt = await User.count();
  expect(cnt).to.equal(1);
});

describe('categoryRouter', function () {
  describe('/getCategories', function () {
    it('should return a response code of 200 when both the user and their category are present', async function () {
      chai
        .request(categoryRouter)
        .get('/getCategories')
        .set('content-type', 'application/json')
        .send({
          userId: defaultUser._id
        })
        .end(function (err, res) {
          if (err) throw err;
          expect(res).to.have.status(200);
        });
    });
  });
});
