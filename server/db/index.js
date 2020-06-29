const mongoose = require('mongoose');

const defaultURI = 'mongodb+srv://user:password@lobstericecream-trflp.gcp.mongodb.net/home?retryWrites=true&w=majority';

function getDB(URI) {
  mongoose
    .connect(URI)
    .then(() => console.log('MongoDB successfully connected'))
    .catch((e) => {
      console.error('Connection error', e.message);
    });
  return mongoose.connection;
}

module.exports = { getDB, defaultURI };
