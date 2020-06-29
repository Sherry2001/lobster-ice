const chai = require("chai");
const chaiHttp = require("chai-http");
const Category = require("../db/models/category");
const MongoClient = require('mongodb');
const MongoMemoryServer = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require("../db/models/user");

let exampleCategory;
let defaultUser;
let mongoServer;
const expect = chai.expect;

function handleErr(err) {
  if (err) {
    throw err;
  }
}

before(async function () {
  mongoServer = new MongoMemoryServer.default();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
  defaultUser = new User({ email: "lobster-ice-cream-lover@gmeil.com" });
  defaultUser.save(handleErr);
  exampleCategory = new Category({ title: "hello there", userId: defaultUser._id });
  exampleCategory.save(handleErr);
});

after(async function () {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('categoryRouter', function () {
  it('...', async function () {
    await Category.find(function (err, categories) {
      handleErr(err);
      console.log(categories);
    });
    const cnt = await User.count();
    expect(cnt).to.equal(1);
  });
});