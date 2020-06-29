const chai = require("chai");
const chaiHttp = require("chai-http");
const MongoClient = require('mongodb');
const MongoMemoryServer = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
const expect = chai.expect

before(async function () {
	mongoServer = new MongoMemoryServer.default();
	const mongoUri = await mongoServer.getUri();
	await mongoose.connect(mongoUri);
});

after(async function () {
	await mongoose.disconnect();
	await mongoServer.stop();
});

describe('...', function () {
	it('...', async () => {
		const User = mongoose.model('User', new mongoose.Schema({ name: String }));
		const cnt = await User.count();
		expect(cnt).to.equal(0);
	});
});