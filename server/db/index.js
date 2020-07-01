const mongoose = require('mongoose');

const defaultUri = 'mongodb+srv://user:password@lobstericecream-trflp.gcp.mongodb.net/home?retryWrites=true&w=majority';
const options = {
  useNewUrlParser: true, useUnifiedTopology: true
};

function getMongoDB(uri) {
  mongoose
    .connect(uri, options)
    .then(() => console.log('MongoDB successfully connected'))
    .catch((e) => {
      console.error('Connection error', e.message);
    });
  return mongoose.connection;
}

module.exports = { getMongoDB, defaultUri };
