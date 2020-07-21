const mongoose = require('mongoose');
require('dotenv').config();

const defaultUri = 'mongodb+srv://' + process.env.USERNAME + ':' + process.env.PASSWORD
  + '@lobstericecream-trflp.gcp.mongodb.net/home?retryWrites=true&w=majority';
const options = {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
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

module.exports = {
  getMongoDB: getMongoDB,
  uri: defaultUri
};
