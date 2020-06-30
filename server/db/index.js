const mongoose = require('mongoose');

const defaultUri = 'mongodb+srv://user:password@lobstericecream-trflp.gcp.mongodb.net/home?retryWrites=true&w=majority';
const opts = {
  useNewUrlParser: true, useUnifiedTopology: true
};

function getDB(uri) {
  mongoose
    .connect(uri, opts)
    .then(() => console.log('MongoDB successfully connected'))
    .catch((e) => {
      console.error('Connection error', e.message);
    });
  return mongoose.connection;
}

module.exports = { getDB, defaultUri };
